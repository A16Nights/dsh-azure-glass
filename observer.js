import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';

const CNY_PER_USD = 7.2;
const BALANCE_CACHE_TTL_MS = 5 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;

const FALLBACK_PRICING = [
  { prefix: 'deepseek-v4-pro', input: 0.435, output: 0.87, cacheRead: 0.003625 },
  { prefix: 'deepseek-v4-flash', input: 0.14, output: 0.28, cacheRead: 0.0028 },
  { prefix: 'deepseek-chat', input: 0.14, output: 0.28, cacheRead: 0.0028 },
  { prefix: 'deepseek-reasoner', input: 0.14, output: 0.28, cacheRead: 0.0028 },
];

const MODEL_WINDOW_HINTS = [
  { re: /deepseek[-_.\s]?v4/i, win: 1000000 },
  { re: /gemini[-_.\s]?(2|3|4)/i, win: 1000000 },
  { re: /gemini/i, win: 256000 },
  { re: /claude/i, win: 200000 },
  { re: /glm-5|kimi-k|qwen3/i, win: 256000 },
  { re: /deepseek/i, win: 131072 },
  { re: /gpt-4\.1|gpt-5|o3|o4/i, win: 200000 },
];

function isDeepSeekProvider(p) {
  return p === 'deepseek' || p === 'deepseek-official' || p === 'deepseek-vision';
}

function isDeepSeekModel(model) {
  return typeof model === 'string' && /deepseek/i.test(model);
}

function estimateTokensFromText(text) {
  if (!text || typeof text !== 'string') return 0;
  let cjk = 0;
  let other = 0;
  const len = Math.min(text.length, 400000);
  for (let i = 0; i < len; i++) {
    const code = text.charCodeAt(i);
    if (code >= 0x3000 && code <= 0x9fff) cjk++;
    else other++;
  }
  const ratio = text.length > len ? text.length / len : 1;
  return Math.round((cjk * 0.65 + other * 0.27) * ratio);
}

function stringifyContent(content) {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    let out = '';
    for (const part of content) {
      if (!part) continue;
      if (typeof part === 'string') out += part;
      else if (typeof part.text === 'string') out += part.text;
      else if (typeof part.thinking === 'string') out += part.thinking;
      else if (typeof part.arguments === 'string') out += part.arguments;
      else {
        try { out += JSON.stringify(part); } catch {}
      }
    }
    return out;
  }
  try { return JSON.stringify(content); } catch { return ''; }
}

function categorizeTool(name) {
  const n = String(name || '').toLowerCase();
  if (/read|grep|glob|find|search|ls|list|cat|view|stat/.test(n)) return 'File Reads & Search';
  if (/bash|pwsh|shell|exec|cmd|run|term|job|process|task/.test(n)) return 'Terminal & Tasks';
  if (/edit|write|patch|create|delete|replace|apply|rename/.test(n)) return 'Code Edits & Writes';
  if (/subagent|agent|mcp|swarm|web|fetch|browser/.test(n)) return 'Subagents & MCP';
  return 'Other Tools';
}

function resolveDshHome() {
  try {
    const fromEnv = typeof process.env.DSH_HOME === 'string' ? process.env.DSH_HOME.trim() : '';
    if (fromEnv) return fromEnv;
  } catch {}
  return path.join(os.homedir(), '.dsh');
}

function round2(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

function toNum(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseUsageFields(u) {
  if (!u || typeof u !== 'object') return null;
  const rawInput = toNum(u.inputTokens ?? u.input_tokens ?? u.prompt_tokens ?? u.promptTokens) || 0;
  const cacheRead = toNum(u.cacheReadTokens ?? u.cache_read_tokens ?? u.cached_tokens ?? u.prompt_cache_hit_tokens ?? u.cacheReadInputTokens) || 0;
  const cacheWrite = toNum(u.cacheWriteTokens ?? u.cache_write_tokens ?? u.cacheCreationInputTokens) || 0;
  const output = toNum(u.outputTokens ?? u.output_tokens ?? u.completion_tokens ?? u.completionTokens) || 0;
  const totalRaw = toNum(u.totalTokens ?? u.total_tokens);
  if (rawInput === 0 && cacheRead === 0 && cacheWrite === 0 && output === 0) return null;

  // DSH (pi-ai) usage reports inputTokens as uncached input and totalTokens = inputTokens + cacheReadTokens + cacheWriteTokens + outputTokens.
  // Some OpenAI-compatible payloads report prompt_tokens as inclusive of cached tokens.
  let inputIncludesCache = false;
  if (cacheRead > 0) {
    if (totalRaw !== null && totalRaw > 0) {
      const diffExclusive = Math.abs(totalRaw - (rawInput + cacheRead + cacheWrite + output));
      const diffInclusive = Math.abs(totalRaw - (rawInput + cacheWrite + output));
      inputIncludesCache = diffInclusive < diffExclusive && rawInput >= cacheRead;
    } else if (u.prompt_tokens !== undefined && u.inputTokens === undefined && u.input_tokens === undefined) {
      inputIncludesCache = rawInput >= cacheRead;
    }
  }

  const uncachedInput = inputIncludesCache ? Math.max(0, rawInput - cacheRead) : rawInput;
  const totalInput = inputIncludesCache ? (rawInput + cacheWrite) : (rawInput + cacheRead + cacheWrite);
  const total = totalRaw !== null && totalRaw > 0 ? totalRaw : (totalInput + output);
  return { input: totalInput, uncachedInput, cacheRead, cacheWrite, output, total };
}

function calcDeepSeekCostCny(model, uncachedInput, cacheRead, output) {
  const m = String(model || '').toLowerCase();
  const rule = FALLBACK_PRICING.find((p) => m.includes(p.prefix)) || FALLBACK_PRICING[2];
  const uncached = Math.max(0, Number(uncachedInput) || 0);
  const cached = Math.max(0, Number(cacheRead) || 0);
  const out = Math.max(0, Number(output) || 0);
  const usd = (uncached * rule.input + cached * rule.cacheRead + out * rule.output) / 1e6;
  return round2(usd * CNY_PER_USD);
}

function normalizeIsoCountdown(resetAt) {
  if (!resetAt) return '';
  const ts = typeof resetAt === 'number'
    ? (resetAt > 1e12 ? resetAt : resetAt * 1000)
    : Date.parse(String(resetAt));
  if (!Number.isFinite(ts)) return '';
  const diffSec = Math.max(0, Math.floor((ts - Date.now()) / 1000));
  if (diffSec <= 0) return '即将重置';
  const days = Math.floor(diffSec / 86400);
  const hours = Math.floor((diffSec % 86400) / 3600);
  const mins = Math.floor((diffSec % 3600) / 60);
  if (days > 0) return `${days}天${hours}小时后重置`;
  if (hours > 0) return `${hours}小时${mins}分后重置`;
  return `${Math.max(1, mins)}分钟后重置`;
}

async function readCredential(ctx, keys) {
  const creds = typeof ctx?.get === 'function' ? ctx.get('credentials') : ctx?.credentials;
  const list = Array.isArray(keys) ? keys : [keys];
  for (const key of list) {
    if (!key) continue;
    try {
      if (creds && typeof creds.get === 'function') {
        const v = await creds.get(key);
        if (typeof v === 'string' && v.trim()) return v.trim();
        if (v && typeof v.value === 'string' && v.value.trim()) return v.value.trim();
      }
      if (creds && typeof creds.resolve === 'function') {
        const v = await creds.resolve(key);
        if (typeof v === 'string' && v.trim()) return v.trim();
      }
    } catch {}
    if (typeof process.env[key] === 'string' && process.env[key].trim()) {
      return process.env[key].trim();
    }
  }
  return '';
}

async function fetchJsonWithTimeout(url, headers = {}) {
  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json', ...headers },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 120)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON response');
  }
}

export function registerObserver(ctx, { withRequestGuard, setCors, sendJson }) {
  const liveBySession = new Map();
  const sessionPathCache = new Map();
  const parsedSessionCache = new Map();
  const balanceCache = new Map();

  // 1. Live llm/stream tap (pass-through, zero mutation)
  if (typeof ctx.on === 'function') {
    try {
      ctx.on('llm/stream', function (options, next) {
        const upstream = next();
        const sid = options && options.sessionId ? String(options.sessionId) : '';
        const model = options && typeof options.model === 'string' ? options.model : '';
        const provider = options && typeof options.provider === 'string' ? options.provider : '';
        const tStart = Date.now();
        let tFirstToken = 0;
        let streamedChars = 0;
        let usage = null;

        return (async function* () {
          try {
            for await (const chunk of upstream) {
              if (chunk && chunk.type === 'usage' && chunk.usage) {
                usage = parseUsageFields(chunk.usage) || usage;
              } else if (chunk && (chunk.type === 'text-delta' || chunk.type === 'reasoning-delta' || chunk.type === 'text' || chunk.type === 'delta')) {
                if (!tFirstToken) tFirstToken = Date.now();
                const delta = chunk.delta || chunk.text || '';
                if (typeof delta === 'string') streamedChars += delta.length;
              }
              yield chunk;
            }
          } finally {
            if (sid) {
              const elapsedSec = Math.max(0.15, (Date.now() - (tFirstToken || tStart)) / 1000);
              const outTok = usage ? usage.output : Math.round(streamedChars * 0.4);
              const tokPerSec = outTok > 0 ? Math.round((outTok / elapsedSec) * 10) / 10 : 0;
              const cur = liveBySession.get(sid) || {
                requests: 0,
                inputTokens: 0,
                uncachedInputTokens: 0,
                cacheReadTokens: 0,
                outputTokens: 0,
                totalAllTokens: 0,
                lastContextTokens: 0,
                spendCny: 0,
                lastTokPerSec: 0,
                lastModel: '',
                lastProvider: '',
                updatedAt: 0,
              };
              cur.requests += 1;
              if (usage) {
                cur.inputTokens += usage.input;
                cur.uncachedInputTokens += usage.uncachedInput;
                cur.cacheReadTokens += usage.cacheRead;
                cur.outputTokens += usage.output;
                cur.totalAllTokens += usage.total;
                cur.lastContextTokens = usage.total;
                if (isDeepSeekModel(model) || isDeepSeekProvider(provider)) {
                  cur.spendCny = round2(cur.spendCny + calcDeepSeekCostCny(model, usage.uncachedInput, usage.cacheRead, usage.output));
                }
              }
              if (tokPerSec > 0 && tokPerSec < 5000) cur.lastTokPerSec = tokPerSec;
              if (model) cur.lastModel = model;
              if (provider) cur.lastProvider = provider;
              cur.updatedAt = Date.now();
              liveBySession.set(sid, cur);
            }
          }
        })();
      });
    } catch (err) {
      ctx.logger?.warn?.(`[dsh-azure-glass] observer llm/stream hook skipped: ${err?.message || err}`);
    }
  }

  function currentSelection(sessionId) {
    if (sessionId) {
      const agents = typeof ctx.get === 'function' ? ctx.get('agents') : ctx.agents;
      if (agents && typeof agents.get === 'function') {
        try {
          const agent = agents.get(String(sessionId));
          const header = agent && agent.session && typeof agent.session.requestHeader === 'function'
            ? agent.session.requestHeader()
            : null;
          const cfg = header && header.config;
          if (cfg && typeof cfg.provider === 'string' && typeof cfg.model === 'string') {
            return { provider: cfg.provider, model: cfg.model };
          }
        } catch {}
      }
      const live = liveBySession.get(String(sessionId));
      if (live && live.lastProvider && live.lastModel) {
        return { provider: live.lastProvider, model: live.lastModel };
      }
    }
    const adm = typeof ctx.get === 'function' ? ctx.get('agentDefaultModel') : ctx.agentDefaultModel;
    if (adm && typeof adm.currentSelection === 'function') {
      try {
        const sel = adm.currentSelection();
        if (sel && typeof sel === 'object') {
          return {
            provider: typeof sel.provider === 'string' ? sel.provider : '',
            model: typeof sel.model === 'string' ? sel.model : '',
          };
        }
      } catch {}
    }
    return { provider: '', model: '' };
  }

  function locateSessionFile(sessionId) {
    const cleanId = String(sessionId || '').trim();
    if (!cleanId || /[\\/]|\.\./.test(cleanId)) return null;

    const cached = sessionPathCache.get(cleanId);
    if (cached && fs.existsSync(cached)) return cached;

    const sessionsRoot = path.join(resolveDshHome(), 'sessions');
    if (!fs.existsSync(sessionsRoot)) return null;

    const candidates = cleanId.startsWith('session-')
      ? [cleanId, cleanId.slice('session-'.length)]
      : [`session-${cleanId}`, cleanId];
    const fileNames = ['session.v4.jsonl.zstd', 'session.v3.jsonl.zstd', 'session.jsonl.zstd', 'session.jsonl'];

    let wsDirs = [];
    try {
      wsDirs = fs.readdirSync(sessionsRoot, { withFileTypes: true }).filter((e) => e.isDirectory());
    } catch {
      return null;
    }

    for (const ws of wsDirs) {
      const wsPath = path.join(sessionsRoot, ws.name);
      for (const dirName of candidates) {
        const sdir = path.join(wsPath, dirName);
        if (!fs.existsSync(sdir)) continue;
        for (const fn of fileNames) {
          const fp = path.join(sdir, fn);
          if (fs.existsSync(fp)) {
            sessionPathCache.set(cleanId, fp);
            return fp;
          }
        }
      }
    }
    return null;
  }

  const ZSTD_MAGIC = 0xfd2fb528;

  function decompressZstdMultiFrame(buf) {
    if (typeof zlib.zstdDecompressSync !== 'function') {
      throw new Error('Node zstdDecompressSync unavailable');
    }
    const marks = [];
    for (let pos = 0; pos + 4 <= buf.length; pos += 1) {
      if (buf.readUInt32LE(pos) === ZSTD_MAGIC) marks.push(pos);
    }
    if (marks.length <= 1) {
      return zlib.zstdDecompressSync(buf).toString('utf8');
    }
    const tryDecode = (chunk) => {
      try {
        const out = zlib.zstdDecompressSync(chunk);
        return out && out.length > 0 ? out : null;
      } catch {
        return null;
      }
    };
    const pieces = [];
    let pending = null;
    for (let i = 0; i < marks.length; i += 1) {
      const start = marks[i];
      const end = i + 1 < marks.length ? marks[i + 1] : buf.length;
      const frame = buf.subarray(start, end);
      if (pending !== null) {
        const merged = tryDecode(Buffer.concat([pending, frame]));
        if (merged) {
          pieces.push(merged);
          pending = null;
          continue;
        }
        pending = null;
      }
      const alone = tryDecode(frame);
      if (alone) pieces.push(alone);
      else pending = frame;
    }
    if (pieces.length === 0) {
      return zlib.zstdDecompressSync(buf).toString('utf8');
    }
    const parts = [];
    for (let i = 0; i < pieces.length; i += 1) {
      const str = pieces[i].toString('utf8');
      if (!str) continue;
      parts.push(str);
      if (!str.endsWith('\n')) parts.push('\n');
    }
    return parts.join('');
  }

  function readSessionJsonl(filePath) {
    const buf = fs.readFileSync(filePath);
    if (filePath.endsWith('.zstd')) {
      return decompressZstdMultiFrame(buf);
    }
    return buf.toString('utf8');
  }

  function analyzeSession(sessionId) {
    const sid = String(sessionId || '').trim();
    const sel = currentSelection(sid);
    const live = liveBySession.get(sid) || null;
    const fp = sid ? locateSessionFile(sid) : null;

    if (!fp) {
      const liveIn = live ? live.inputTokens : 0;
      const liveCache = live ? live.cacheReadTokens : 0;
      const liveUncached = live ? live.uncachedInputTokens : 0;
      const liveOut = live ? live.outputTokens : 0;
      const liveAll = live ? (live.totalAllTokens || (liveIn + liveOut)) : 0;
      const liveCtx = live ? live.lastContextTokens : 0;
      const win = guessContextWindow(sel.model);
      return {
        ok: true,
        found: false,
        sessionId: sid,
        title: '',
        provider: sel.provider,
        model: sel.model,
        contextWindow: win,
        turns: 0,
        steps: live ? live.requests : 0,
        compactions: 0,
        tokPerSec: live ? live.lastTokPerSec : 0,
        modelDurationSec: 0,
        avgTtftSec: 0,
        currentContextTokens: liveCtx,
        contextPct: win > 0 && liveCtx > 0 ? Math.min(100, Math.round((liveCtx / win) * 1000) / 10) : 0,
        totalInputTokens: liveIn,
        uncachedInputTokens: liveUncached,
        totalCacheReadTokens: liveCache,
        totalOutputTokens: liveOut,
        totalAllTokens: liveAll,
        cacheHitRate: liveIn > 0 ? Math.min(100, Math.round((liveCache / liveIn) * 1000) / 10) : 0,
        spendCny: live ? live.spendCny : 0,
        breakdown: [],
        toolCategories: [],
        heaviestSteps: [],
      };
    }

    const st = fs.statSync(fp);
    const cacheKey = `${fp}:${st.mtimeMs}:${st.size}`;
    const prev = parsedSessionCache.get(sid);
    let parsed = prev && prev.cacheKey === cacheKey ? prev.data : null;

    if (!parsed) {
      const raw = readSessionJsonl(fp);
      const lines = raw.split(/\r?\n/);

      let title = '';
      let provider = '';
      let model = '';
      let contextWindow = 0;
      let turns = 0;
      let steps = 0;
      let nativeCompactions = 0;
      let biliCompactions = 0;
      let biliDecompactions = 0;
      const seenBiliCompressIds = new Set();
      const seenBiliDecompressIds = new Set();

      let totalInput = 0;
      let totalUncachedInput = 0;
      let totalCacheRead = 0;
      let totalOutput = 0;
      let totalAll = 0;
      let lastContextTokens = 0;
      let spendCny = 0;

      // Active-window breakdown (reset after compaction)
      let systemTok = 0;
      let toolsSchemaTok = 0;
      let userTok = 0;
      let assistantTok = 0;
      let reasoningTok = 0;
      let toolResultTok = 0;
      let compactionSummaryTok = 0;

      const toolCallsById = new Map();
      const toolCatStats = new Map();
      const stepItems = [];
      let lastStepStartTs = 0;
      let lastRequestStartTs = 0;
      let lastDerivedTokPerSec = 0;
      let totalGenOutput = 0;
      let totalGenMs = 0;
      let totalModelDurationMs = 0;
      let totalToolDurationMs = 0;
      let ttftSumMs = 0;
      let ttftCount = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line || line[0] !== '{') continue;
        let o;
        try { o = JSON.parse(line); } catch { continue; }
        const type = o.type || '';
        const d = o.data || {};

        if (type === 'session/title' && typeof d.title === 'string' && d.title.trim()) {
          title = d.title.trim();
        } else if (type === 'model/selection') {
          if (d.provider) provider = String(d.provider);
          if (d.model) model = String(d.model);
        } else if (type === 'request/context') {
          if (d.provider) provider = String(d.provider);
          if (d.model) model = String(d.model);
          if (Number(d.contextWindow) > 0) contextWindow = Number(d.contextWindow);
          if (Number(o.time) > 0) lastRequestStartTs = Number(o.time);
        } else if (type === 'request/header') {
          const cfg = d.header?.config;
          if (cfg?.provider) provider = String(cfg.provider);
          if (cfg?.model) model = String(cfg.model);
          if (Array.isArray(d.header?.tools)) {
            toolsSchemaTok = estimateTokensFromText(JSON.stringify(d.header.tools));
          }
        } else if (type === 'turn/start') {
          turns++;
        } else if (type === 'step/start') {
          steps++;
          lastStepStartTs = Number(o.time) || 0;
          lastRequestStartTs = 0;
        } else if (type === 'system/message') {
          const txt = stringifyContent(d.message?.content ?? d.content);
          systemTok = Math.max(systemTok, estimateTokensFromText(txt));
        } else if (/compact/i.test(type)) {
          nativeCompactions++;
          // After compaction, previous messages were folded into summary
          userTok = 0;
          assistantTok = 0;
          reasoningTok = 0;
          toolResultTok = 0;
          toolCatStats.clear();
          stepItems.length = 0;
          const summaryTxt = stringifyContent(d.summary ?? d.content ?? d.message?.content ?? d);
          compactionSummaryTok = estimateTokensFromText(summaryTxt);
        } else if (type === 'user/message') {
          const txt = stringifyContent(d.content ?? d.message?.content);
          userTok += estimateTokensFromText(txt);
        } else if (type === 'assistant/message') {
          const msg = d.message || d;
          const parts = Array.isArray(msg.content) ? msg.content : [];
          let msgTextLen = 0;
          let msgReasonLen = 0;
          for (const p of parts) {
            if (!p) continue;
            if (p.type === 'reasoning' || p.type === 'thinking') {
              msgReasonLen += estimateTokensFromText(p.text || p.thinking || '');
            } else if (p.type === 'text') {
              msgTextLen += estimateTokensFromText(p.text || '');
            } else if (p.type === 'tool-call') {
              msgTextLen += estimateTokensFromText(p.arguments || '');
              const tName = String(p.name || '');
              const cid = String(p.id || `msg-${i}-${tName}`);
              if (/^(?:acp_)?compress$/i.test(tName) && !seenBiliCompressIds.has(cid)) {
                seenBiliCompressIds.add(cid);
                biliCompactions++;
              } else if (/^(?:acp_)?decompress$/i.test(tName) && !seenBiliDecompressIds.has(cid)) {
                seenBiliDecompressIds.add(cid);
                biliDecompactions++;
              }
            }
          }
          assistantTok += msgTextLen;
          reasoningTok += msgReasonLen;

          const u = parseUsageFields(msg.usage || d.usage || o.usage);
          const streamEvents = Array.isArray(d.stream) ? d.stream : (Array.isArray(msg.stream) ? msg.stream : []);
          let firstStreamTs = 0;
          let lastStreamTs = 0;
          for (let si = 0; si < streamEvents.length; si++) {
            const ev = streamEvents[si];
            const t = Number(ev?.time || ev?.time0) || 0;
            if (t > 0) {
              if (!firstStreamTs || t < firstStreamTs) firstStreamTs = t;
              let endT = t;
              if (Array.isArray(ev.dt)) {
                for (let di = 0; di < ev.dt.length; di++) {
                  endT += (Number(ev.dt[di]) || 0);
                }
              }
              if (endT > lastStreamTs) lastStreamTs = endT;
            }
          }

          if (u) {
            totalInput += u.input;
            totalUncachedInput += u.uncachedInput;
            totalCacheRead += u.cacheRead;
            totalOutput += u.output;
            totalAll += u.total;
            lastContextTokens = u.total || (u.input + u.output);
            const mName = msg.source?.model || model;
            const pName = msg.source?.provider || provider;
            if (isDeepSeekModel(mName) || isDeepSeekProvider(pName)) {
              spendCny = round2(spendCny + calcDeepSeekCostCny(mName, u.uncachedInput, u.cacheRead, u.output));
            }
            const startTs = lastRequestStartTs || lastStepStartTs;
            const endTs = lastStreamTs || Number(o.time) || 0;

            const explicitTtft = toNum(msg.ttftMs ?? d.ttftMs ?? o.ttftMs ?? msg.firstTokenMs ?? d.firstTokenMs ?? msg.metrics?.ttftMs ?? d.metrics?.ttftMs);
            let ttftMs = (explicitTtft !== null && explicitTtft > 0 && explicitTtft < 600000) ? explicitTtft : 0;
            if (ttftMs <= 0 && startTs > 0 && firstStreamTs >= startTs) {
              const diffTtft = firstStreamTs - startTs;
              if (diffTtft > 0 && diffTtft < 600000) ttftMs = diffTtft;
            }
            if (ttftMs > 0) {
              ttftSumMs += ttftMs;
              ttftCount++;
            }

            const explicitDur = toNum(msg.durationMs ?? d.durationMs ?? o.durationMs ?? msg.metrics?.durationMs ?? d.metrics?.durationMs);
            let stepDurMs = explicitDur !== null && explicitDur > 0 && explicitDur < 3600000 ? explicitDur : 0;
            if (stepDurMs <= 0 && startTs > 0 && endTs > startTs) {
              const diff = endTs - startTs;
              if (diff > 0 && diff < 3600000) stepDurMs = diff;
            }
            if (stepDurMs > 0) totalModelDurationMs += stepDurMs;

            if (u.output > 0 && firstStreamTs > 0 && lastStreamTs > firstStreamTs) {
              const genMs = lastStreamTs - firstStreamTs;
              totalGenOutput += u.output;
              totalGenMs += genMs;
              const spd = Math.round((u.output / Math.max(0.15, genMs / 1000)) * 10) / 10;
              if (spd > 0 && spd < 5000) lastDerivedTokPerSec = spd;
            } else if (stepDurMs > 0 && u.output > 5) {
              const sec = Math.max(0.2, stepDurMs / 1000);
              const spd = Math.round((u.output / sec) * 10) / 10;
              if (spd > 0 && spd < 5000) lastDerivedTokPerSec = spd;
            }
          }
        } else if (type === 'tool/call') {
          const cid = d.callId || d.id || '';
          const tname = d.name || 'tool';
          const args = typeof d.arguments === 'string' ? d.arguments : JSON.stringify(d.arguments || '');
          if (cid) toolCallsById.set(cid, { name: tname, args, startTs: Number(o.time) || 0 });
          const dedupId = String(cid || `tc-${i}-${tname}`);
          if (/^(?:acp_)?compress$/i.test(tname) && !seenBiliCompressIds.has(dedupId)) {
            seenBiliCompressIds.add(dedupId);
            biliCompactions++;
          } else if (/^(?:acp_)?decompress$/i.test(tname) && !seenBiliDecompressIds.has(dedupId)) {
            seenBiliDecompressIds.add(dedupId);
            biliDecompactions++;
          }
        } else if (type === 'tool/result') {
          const cid = d.message?.toolCallId || d.message?.source?.callId || d.callId || '';
          const callInfo = toolCallsById.get(cid) || { name: d.name || 'tool', args: '', startTs: 0 };
          const resTs = Number(o.time) || 0;
          if (callInfo.startTs > 0 && resTs > callInfo.startTs) {
            const tDur = resTs - callInfo.startTs;
            if (tDur > 0 && tDur < 3600000) totalToolDurationMs += tDur;
          }
          const txt = stringifyContent(d.message?.content ?? d.content);
          const tok = estimateTokensFromText(txt) + estimateTokensFromText(callInfo.args);
          toolResultTok += tok;

          const cat = categorizeTool(callInfo.name);
          const prevCat = toolCatStats.get(cat) || { name: cat, count: 0, tokens: 0 };
          prevCat.count += 1;
          prevCat.tokens += tok;
          toolCatStats.set(cat, prevCat);

          const previewRaw = (callInfo.args || txt).replace(/\s+/g, ' ').trim();
          stepItems.push({
            tool: callInfo.name,
            preview: previewRaw.slice(0, 76),
            tokens: tok,
          });
        }
      }

      const finalProvider = sel.provider || provider;
      const finalModel = sel.model || model;
      const finalWindow = contextWindow > 0 ? contextWindow : guessContextWindow(finalModel);

      // Build breakdown items
      const rawBreakdown = [
        { key: 'system', label: 'System Prompt', tokens: systemTok, color: '#8b5cf6' },
        { key: 'toolsSchema', label: 'Tools / MCP Schema', tokens: toolsSchemaTok, color: '#38bdf8' },
        { key: 'compaction', label: 'Compaction Summary', tokens: compactionSummaryTok, color: '#f59e0b' },
        { key: 'user', label: 'User Messages', tokens: userTok, color: '#34d399' },
        { key: 'assistant', label: 'Assistant & Reasoning', tokens: assistantTok + reasoningTok, color: '#a78bfa' },
        { key: 'toolResults', label: 'Tool Results', tokens: toolResultTok, color: '#60a5fa' },
      ].filter((x) => x.tokens > 0);

      const estSum = rawBreakdown.reduce((s, x) => s + x.tokens, 0);
      const effectiveCtx = lastContextTokens > 0 ? lastContextTokens : estSum;
      const denom = Math.max(1, estSum);
      const breakdown = rawBreakdown.map((item) => {
        const scaled = lastContextTokens > 0 && estSum > 0
          ? Math.round((item.tokens / denom) * effectiveCtx)
          : item.tokens;
        const pct = Math.round((item.tokens / denom) * 1000) / 10;
        return { ...item, tokens: scaled, pct };
      });

      const cacheHitRate = totalInput > 0
        ? Math.min(100, Math.round((totalCacheRead / totalInput) * 1000) / 10)
        : 0;

      const heaviestSteps = stepItems
        .sort((a, b) => b.tokens - a.tokens)
        .slice(0, 5);

      const catOrder = ['File Reads & Search', 'Terminal & Tasks', 'Code Edits & Writes', 'Subagents & MCP', 'Other Tools'];
      const toolCategories = catOrder
        .map((name) => toolCatStats.get(name) || { name, count: 0, tokens: 0 })
        .filter((x) => x.count > 0 || x.name !== 'Other Tools');

      const compactions = nativeCompactions + biliCompactions;

      const avgTokPerSec = totalGenMs > 0 && totalGenOutput > 0
        ? Math.round((totalGenOutput / Math.max(0.15, totalGenMs / 1000)) * 10) / 10
        : lastDerivedTokPerSec;

      parsed = {
        ok: true,
        found: true,
        sessionId: sid,
        title,
        provider: finalProvider,
        model: finalModel,
        contextWindow: finalWindow,
        turns,
        steps,
        compactions,
        nativeCompactions,
        biliCompactions,
        biliDecompactions,
        tokPerSec: avgTokPerSec,
        modelDurationSec: totalModelDurationMs > 0 ? Math.round((totalModelDurationMs / 1000) * 10) / 10 : 0,
        toolDurationSec: totalToolDurationMs > 0 ? Math.round((totalToolDurationMs / 1000) * 10) / 10 : 0,
        avgTtftSec: ttftCount > 0 ? Math.round(((ttftSumMs / ttftCount) / 1000) * 10) / 10 : 0,
        currentContextTokens: effectiveCtx,
        contextPct: finalWindow > 0 ? Math.min(100, Math.round((effectiveCtx / finalWindow) * 1000) / 10) : 0,
        totalInputTokens: totalInput,
        uncachedInputTokens: totalUncachedInput,
        totalCacheReadTokens: totalCacheRead,
        totalOutputTokens: totalOutput,
        totalAllTokens: totalAll > 0 ? totalAll : (totalInput + totalOutput),
        cacheHitRate,
        spendCny,
        breakdown,
        toolCategories,
        heaviestSteps,
      };
      parsedSessionCache.set(sid, { cacheKey, data: parsed });
      if (parsedSessionCache.size > 24) {
        const firstKey = parsedSessionCache.keys().next().value;
        parsedSessionCache.delete(firstKey);
      }
    }

    // Merge real-time tok/s, live usage (when ahead of flushed disk file) & live provider/model override
    const mergedModel = sel.model || parsed.model;
    const mergedWindow = (mergedModel && mergedModel !== parsed.model)
      ? guessContextWindow(mergedModel)
      : parsed.contextWindow;
    const liveAhead = live && (live.totalAllTokens > (parsed.totalAllTokens || 0));
    const mergedTotalInput = liveAhead ? live.inputTokens : (parsed.totalInputTokens || 0);
    const mergedUncachedInput = liveAhead ? live.uncachedInputTokens : (parsed.uncachedInputTokens || 0);
    const mergedCacheRead = liveAhead ? live.cacheReadTokens : (parsed.totalCacheReadTokens || 0);
    const mergedOutput = liveAhead ? live.outputTokens : (parsed.totalOutputTokens || 0);
    const mergedTotalAll = liveAhead ? live.totalAllTokens : (parsed.totalAllTokens || 0);
    const mergedCacheHit = mergedTotalInput > 0
      ? Math.min(100, Math.round((mergedCacheRead / mergedTotalInput) * 1000) / 10)
      : (parsed.cacheHitRate || 0);
    const mergedCtxTokens = (liveAhead && live.lastContextTokens > 0)
      ? live.lastContextTokens
      : (parsed.currentContextTokens || 0);
    const mergedPct = mergedWindow > 0
      ? Math.min(100, Math.round((mergedCtxTokens / mergedWindow) * 1000) / 10)
      : parsed.contextPct;
    return {
      ...parsed,
      provider: sel.provider || parsed.provider,
      model: mergedModel,
      contextWindow: mergedWindow,
      currentContextTokens: mergedCtxTokens,
      contextPct: mergedPct,
      totalInputTokens: mergedTotalInput,
      uncachedInputTokens: mergedUncachedInput,
      totalCacheReadTokens: mergedCacheRead,
      totalOutputTokens: mergedOutput,
      totalAllTokens: mergedTotalAll,
      cacheHitRate: mergedCacheHit,
      tokPerSec: (parsed.tokPerSec > 0) ? parsed.tokPerSec : ((live && live.lastTokPerSec > 0) ? live.lastTokPerSec : 0),
      spendCny: Math.max(parsed.spendCny || 0, live ? (live.spendCny || 0) : 0),
    };
  }

  function guessContextWindow(model) {
    const m = String(model || '');
    for (const h of MODEL_WINDOW_HINTS) {
      if (h.re.test(m)) return h.win;
    }
    return 131072;
  }

  async function fetchProviderBalance(provider, forceRefresh = false) {
    const p = String(provider || '').trim();
    if (!p) return { supported: false, provider: '', label: '', items: [] };

    const cached = balanceCache.get(p);
    if (!forceRefresh && cached && (Date.now() - cached.fetchedAt) < BALANCE_CACHE_TTL_MS) {
      return { ...cached.payload, cached: true, fetchedAt: cached.fetchedAt };
    }

    try {
      let payload = { supported: false, provider: p, label: p, items: [] };

      if (isDeepSeekProvider(p)) {
        const key = await readCredential(ctx, ['DEEPSEEK_API_KEY']);
        if (!key) {
          payload = { supported: true, provider: p, label: 'DeepSeek 官方', error: '未配置 DEEPSEEK_API_KEY', items: [] };
        } else {
          const data = await fetchJsonWithTimeout('https://api.deepseek.com/user/balance', {
            Authorization: `Bearer ${key}`,
          });
          const infos = Array.isArray(data.balance_infos) ? data.balance_infos : [];
          const items = infos.map((info) => {
            const sym = info.currency === 'USD' ? '$' : (info.currency === 'EUR' ? '€' : '¥');
            const total = toNum(info.total_balance);
            return {
              title: `${info.currency || 'CNY'} 账户余额`,
              valueText: total !== null ? `${sym}${total.toFixed(2)}` : String(info.total_balance ?? '—'),
              subText: data.is_available === false ? '余额不足' : '可用',
              status: data.is_available === false ? 'error' : 'ok',
            };
          });
          payload = {
            supported: true,
            provider: p,
            label: 'DeepSeek 官方',
            shortText: items[0] ? `余额 ${items[0].valueText}` : '余额 —',
            items,
          };
        }
      } else if (p === 'kimi-coding') {
        const key = await readCredential(ctx, ['KIMI_CODING_API_KEY', 'KIMI_CODE_API_KEY', 'KIMI_API_KEY']);
        if (!key) {
          payload = { supported: true, provider: p, label: 'Kimi Coding', error: '未配置 KIMI_CODING_API_KEY', items: [] };
        } else {
          const data = await fetchJsonWithTimeout('https://api.kimi.com/coding/v1/usages', {
            Authorization: `Bearer ${key}`,
          });
          const items = [];
          const limits = Array.isArray(data.limits) ? data.limits : [];
          for (const lim of limits) {
            const d = lim.detail || lim;
            const total = toNum(d.limit) || 0;
            const used = toNum(d.used) ?? (total > 0 && toNum(d.remaining) !== null ? total - toNum(d.remaining) : 0);
            const pct = total > 0 ? Math.min(100, Math.round(((total - used) / total) * 1000) / 10) : 0;
            const winLabel = lim.window?.duration === 5 ? '5-hour' : (lim.scope || '周期配额');
            items.push({
              title: winLabel,
              pct,
              valueText: `${pct}%`,
              subText: normalizeIsoCountdown(d.resetTime),
              status: pct <= 15 ? 'error' : (pct <= 35 ? 'warn' : 'ok'),
            });
          }
          payload = {
            supported: true,
            provider: p,
            label: 'Kimi For Coding',
            shortText: items[0] ? `Kimi ${items[0].valueText}` : 'Kimi 额度',
            items,
          };
        }
      } else if (p === 'zai-coding-cn' || p === 'zai') {
        const keyName = p === 'zai-coding-cn' ? ['ZAI_CODING_CN_API_KEY', 'ZAI_API_KEY'] : ['ZAI_API_KEY', 'ZAI_CODING_CN_API_KEY'];
        const base = p === 'zai-coding-cn' ? 'https://open.bigmodel.cn' : 'https://api.z.ai';
        const key = await readCredential(ctx, keyName);
        if (!key) {
          payload = { supported: true, provider: p, label: '智谱 GLM Coding', error: '未配置 ZAI API Key', items: [] };
        } else {
          const data = await fetchJsonWithTimeout(`${base}/api/monitor/usage/quota/limit`, {
            Authorization: key,
          });
          const list = Array.isArray(data?.data?.limits) ? data.data.limits : [];
          const items = list.filter((x) => x.type === 'TOKENS_LIMIT').map((x) => {
            const usedPct = toNum(x.percentage) || 0;
            const remPct = Math.max(0, Math.round((100 - usedPct) * 10) / 10);
            return {
              title: x.unit === 3 ? '5-hour' : (x.unit === 6 ? '周配额' : '配额'),
              pct: remPct,
              valueText: `${remPct}%`,
              subText: normalizeIsoCountdown(x.nextResetTime),
              status: remPct <= 15 ? 'error' : (remPct <= 35 ? 'warn' : 'ok'),
            };
          });
          payload = {
            supported: true,
            provider: p,
            label: '智谱 GLM Coding',
            shortText: items[0] ? `GLM ${items[0].valueText}` : 'GLM 额度',
            items,
          };
        }
      } else if (p === 'minimax-cn' || p === 'minimax') {
        const keyName = p === 'minimax-cn' ? ['MINIMAX_CN_API_KEY', 'MINIMAX_API_KEY'] : ['MINIMAX_API_KEY', 'MINIMAX_CN_API_KEY'];
        const base = p === 'minimax-cn' ? 'https://api.minimaxi.com' : 'https://api.minimax.io';
        const key = await readCredential(ctx, keyName);
        if (!key) {
          payload = { supported: true, provider: p, label: 'MiniMax Coding', error: '未配置 MiniMax Key', items: [] };
        } else {
          const data = await fetchJsonWithTimeout(`${base}/v1/api/openplatform/coding_plan/remains`, {
            Authorization: `Bearer ${key}`,
          });
          const remains = Array.isArray(data?.model_remains) ? data.model_remains : [];
          const items = remains.slice(0, 3).map((r) => {
            const total = toNum(r.current_interval_total_count) || 0;
            const rem = toNum(r.current_interval_usage_count) || 0;
            const pct = total > 0 ? Math.max(0, Math.min(100, Math.round((rem / total) * 1000) / 10)) : 0;
            return {
              title: r.model_name || '5-hour',
              pct,
              valueText: `${pct}%`,
              subText: normalizeIsoCountdown(r.end_time),
              status: pct <= 15 ? 'error' : (pct <= 35 ? 'warn' : 'ok'),
            };
          });
          payload = {
            supported: true,
            provider: p,
            label: 'MiniMax Coding',
            shortText: items[0] ? `MiniMax ${items[0].valueText}` : 'MiniMax 额度',
            items,
          };
        }
      } else if (p === 'openrouter') {
        const key = await readCredential(ctx, ['OPENROUTER_API_KEY']);
        if (!key) {
          payload = { supported: true, provider: p, label: 'OpenRouter', error: '未配置 OPENROUTER_API_KEY', items: [] };
        } else {
          const data = await fetchJsonWithTimeout('https://openrouter.ai/api/v1/credits', {
            Authorization: `Bearer ${key}`,
          });
          const total = toNum(data?.data?.total_credits) || 0;
          const used = toNum(data?.data?.total_usage) || 0;
          const rem = Math.max(0, round2(total - used));
          payload = {
            supported: true,
            provider: p,
            label: 'OpenRouter',
            shortText: `余额 $${rem.toFixed(2)}`,
            items: [{ title: '剩余额度', valueText: `$${rem.toFixed(2)}`, subText: `已用 $${round2(used).toFixed(2)}`, status: 'ok' }],
          };
        }
      } else if (p === 'opencode-go') {
        const key = await readCredential(ctx, ['OPENCODE_GO_API_KEY', 'OPENCODE_API_KEY']);
        if (!key) {
          payload = { supported: true, provider: p, label: 'OpenCode Go', error: '未配置 OPENCODE_GO_API_KEY', items: [] };
        } else {
          const data = await fetchJsonWithTimeout('https://opencode.ai/zen/go/v1/usage', {
            Authorization: `Bearer ${key}`,
          });
          const items = [];
          for (const [k, label, limit] of [['rolling', '5-hour', 12], ['weekly', '周配额', 30], ['monthly', '月配额', 60]]) {
            const slot = data?.[k];
            if (!slot) continue;
            const used = toNum(slot.usage ?? slot.used) || 0;
            const pct = Math.max(0, Math.min(100, Math.round(((limit - used) / limit) * 1000) / 10));
            items.push({
              title: label,
              pct,
              valueText: `${pct}%`,
              subText: normalizeIsoCountdown(slot.resetAt || slot.reset_at),
              status: pct <= 15 ? 'error' : (pct <= 35 ? 'warn' : 'ok'),
            });
          }
          payload = {
            supported: true,
            provider: p,
            label: 'OpenCode Go',
            shortText: items[0] ? `OpenCode ${items[0].valueText}` : 'OpenCode 额度',
            items,
          };
        }
      }

      const now = Date.now();
      balanceCache.set(p, { fetchedAt: now, payload });
      return { ...payload, cached: false, fetchedAt: now };
    } catch (err) {
      return {
        supported: true,
        provider: p,
        label: p,
        error: String(err?.message || err).slice(0, 100),
        items: [],
      };
    }
  }

  const upstreamWindowCache = new Map();
  const UPSTREAM_WIN_TTL_MS = 30 * 60 * 1000;

  function extractContextWindowFromObj(obj) {
    if (!obj || typeof obj !== 'object') return 0;
    const candidates = [
      obj.contextWindow,
      obj.context_window,
      obj.contextLength,
      obj.context_length,
      obj.maxContextTokens,
      obj.max_context_tokens,
      obj.maxContextLength,
      obj.max_context_length,
      obj.max_model_len,
      obj.inputTokenLimit,
      obj.input_token_limit,
      obj.top_provider?.context_length,
      obj.limits?.context,
      obj.limit?.context,
    ];
    for (const v of candidates) {
      const n = Number(v);
      if (Number.isFinite(n) && n >= 1024 && n <= 10000000) return Math.round(n);
    }
    return 0;
  }

  function findHostProviderInfo(provider, model) {
    let baseUrl = '';
    let apiKey = '';
    let hostWindow = 0;
    try {
      const candidates = [
        typeof ctx.get === 'function' ? ctx.get('models') : ctx.models,
        typeof ctx.get === 'function' ? ctx.get('providers') : ctx.providers,
        typeof ctx.get === 'function' ? ctx.get('modelRegistry') : ctx.modelRegistry,
      ].filter(Boolean);

      for (const svc of candidates) {
        // Try model metadata lookup first
        if (typeof svc.getModel === 'function') {
          const m = svc.getModel(provider, model) || svc.getModel(model);
          const w = extractContextWindowFromObj(m);
          if (w > 0) hostWindow = w;
        }
        if (typeof svc.listModels === 'function' && !hostWindow) {
          const list = svc.listModels();
          if (Array.isArray(list)) {
            const hit = list.find((m) => (m?.id === model || m?.model === model) && (!provider || !m?.provider || m.provider === provider));
            const w = extractContextWindowFromObj(hit);
            if (w > 0) hostWindow = w;
          }
        }
        // Try provider baseURL / apiKey lookup
        const pObj = typeof svc.getProvider === 'function'
          ? svc.getProvider(provider)
          : (typeof svc.get === 'function' ? svc.get(provider) : svc?.[provider]);
        if (pObj && typeof pObj === 'object') {
          if (!baseUrl) baseUrl = String(pObj.baseURL || pObj.baseUrl || pObj.endpoint || pObj.url || '').trim();
          if (!apiKey) apiKey = String(pObj.apiKey || pObj.api_key || pObj.token || '').trim();
          if (!hostWindow && Array.isArray(pObj.models)) {
            const hit = pObj.models.find((m) => m?.id === model || m?.name === model || m?.model === model);
            const w = extractContextWindowFromObj(hit);
            if (w > 0) hostWindow = w;
          }
        }
      }
    } catch {}
    return { baseUrl, apiKey, hostWindow };
  }

  async function resolveUpstreamContextWindow(provider, model) {
    const p = String(provider || '').trim();
    const m = String(model || '').trim();
    if (!m) return 0;

    const cacheKey = `${p}::${m}`;
    const cached = upstreamWindowCache.get(cacheKey);
    if (cached && (Date.now() - cached.at) < UPSTREAM_WIN_TTL_MS) {
      return cached.win;
    }

    const { baseUrl, apiKey, hostWindow } = findHostProviderInfo(p, m);
    if (hostWindow > 0) {
      upstreamWindowCache.set(cacheKey, { at: Date.now(), win: hostWindow });
      return hostWindow;
    }

    if (!baseUrl || !/^https?:\/\//i.test(baseUrl)) {
      upstreamWindowCache.set(cacheKey, { at: Date.now(), win: 0 });
      return 0;
    }

    try {
      const cleanBase = baseUrl.replace(/\/+$/, '');
      const modelsUrl = /\/models$/i.test(cleanBase)
        ? cleanBase
        : (/\/v1$/i.test(cleanBase) ? `${cleanBase}/models` : `${cleanBase}/v1/models`);
      const headers = { Accept: 'application/json' };
      if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
      const res = await fetch(modelsUrl, { headers, signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : (Array.isArray(json?.models) ? json.models : (Array.isArray(json) ? json : []));
        const targetLower = m.toLowerCase();
        const hit = list.find((item) => {
          const id = String(item?.id || item?.name || '').toLowerCase();
          return id === targetLower || id.endsWith(`/${targetLower}`);
        });
        const win = extractContextWindowFromObj(hit);
        if (win > 0) {
          upstreamWindowCache.set(cacheKey, { at: Date.now(), win });
          return win;
        }
      }
    } catch {}

    upstreamWindowCache.set(cacheKey, { at: Date.now(), win: 0 });
    return 0;
  }

  const disposeObserverRoute = ctx.webServer.register({
    kind: 'exact',
    path: '/api/azure-glass/observer/telemetry',
    handler: withRequestGuard(ctx, async (req, res) => {
      if (setCors(req, res)) return;
      if (req.method !== 'GET') return sendJson(res, 405, { error: 'method not allowed' });
      const urlObj = new URL(req.url || '/', 'http://localhost');
      const sessionId = urlObj.searchParams.get('sessionId') || '';
      const withBalance = urlObj.searchParams.get('balance') !== '0';
      const forceBalance = urlObj.searchParams.get('refresh') === '1';

      const telemetry = analyzeSession(sessionId);
      if (telemetry && telemetry.model) {
        const upstreamWin = await resolveUpstreamContextWindow(telemetry.provider, telemetry.model);
        if (upstreamWin > 0 && upstreamWin !== telemetry.contextWindow) {
          telemetry.contextWindow = upstreamWin;
          telemetry.contextPct = Math.min(100, Math.round(((telemetry.currentContextTokens || 0) / upstreamWin) * 1000) / 10);
        }
      }
      let balance = null;
      if (withBalance && telemetry.provider) {
        balance = await fetchProviderBalance(telemetry.provider, forceBalance);
      }
      sendJson(res, 200, { ...telemetry, balance });
    }),
  });
  if (typeof disposeObserverRoute === 'function') {
    if (typeof ctx.effect === 'function') {
      ctx.effect(() => disposeObserverRoute, 'dsh-azure-glass: observer route');
    } else if (typeof ctx.on === 'function') {
      ctx.on('dispose', disposeObserverRoute);
    }
  }
}
