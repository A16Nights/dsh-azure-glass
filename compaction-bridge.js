/**
 * dsh-azure-glass — zero-dependency compatibility bridge for billion-context.
 *
 * When billion-context is active, its bili-compaction-gate disables
 * `@deepseek-ai/dsh-compaction-basic` inside every agent preset (including
 * third-party presets such as `dsh-multigameassistant`'s `preset-mga` and
 * `preset-mga-ptc`). However, `dsh-multigameassistant/low-context` sits in the
 * same isolated `compaction` group with `inject = ['compaction']`, causing the
 * preset to stall forever with `waiting for compaction` and triggering repeated
 * empty-session creation loops in `adg-workspace`.
 *
 * Because billion-context already intercepts LLM traffic globally across all
 * DSH sessions, disabling `dsh-multigameassistant/low-context` whenever
 * billion-context is active (or when `dsh-compaction-basic` is already disabled
 * in the preset) restores MultiGameAssistant agent functionality seamlessly
 * while leaving native low-context untouched if billion-context is disabled.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const name = 'azure-glass-compaction-bridge';
export const inject = [];

const DSH_COMPACTION_BASIC_PACKAGE = '@deepseek-ai/dsh-compaction-basic';
const BILI_COMPACTION_VERDICT_KEY = '__BILI_DSH_COMPACTION_VERDICT__';
const BRIDGE_SERVICE_NAME = 'azureGlassCompactionBridge';

const LEGACY_COMPACTION_DEPENDENTS = new Set([
  'dsh-multigameassistant/low-context',
]);

const LEGACY_COMPACTION_DEPENDENT_IDS = new Set([
  'adg-low-context',
]);

function isBridgeEnabledByConfig() {
  try {
    const dshHome = (typeof process.env.DSH_HOME === 'string' && process.env.DSH_HOME.trim())
      ? process.env.DSH_HOME.trim()
      : path.join(os.homedir(), '.dsh');
    const cfgPath = path.join(dshHome, 'plugins', 'dsh-azure-glass', 'config.json');
    if (!fs.existsSync(cfgPath)) return true;
    const raw = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    if (raw && raw.biliCompatBridgeEnabled === false) return false;
  } catch {}
  return true;
}

function isBiliCompactionActive() {
  return globalThis[BILI_COMPACTION_VERDICT_KEY] === 'active';
}

function hasDisabledBasicCompaction(rows) {
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    if (row.name === DSH_COMPACTION_BASIC_PACKAGE && row.disabled === true) {
      return true;
    }
    if (row.group && Array.isArray(row.config) && hasDisabledBasicCompaction(row.config)) {
      return true;
    }
  }
  return false;
}

function isLegacyCompactionDependent(row) {
  if (!row || typeof row !== 'object' || row.disabled === true) return false;
  if (typeof row.name === 'string' && LEGACY_COMPACTION_DEPENDENTS.has(row.name)) return true;
  if (typeof row.id === 'string' && LEGACY_COMPACTION_DEPENDENT_IDS.has(row.id)) return true;
  return false;
}

function disableLegacyDependents(rows) {
  let count = 0;
  const nextRows = rows.map((row) => {
    if (!row || typeof row !== 'object') return row;
    if (isLegacyCompactionDependent(row)) {
      count += 1;
      return { ...row, disabled: true };
    }
    if (row.group && Array.isArray(row.config)) {
      const sub = disableLegacyDependents(row.config);
      if (sub.count > 0) {
        count += sub.count;
        return { ...row, config: sub.rows };
      }
    }
    return row;
  });
  return { rows: nextRows, count };
}

export function apply(ctx) {
  const log = typeof ctx.logger === 'function' ? ctx.logger('dsh-azure-glass') : ctx.logger;

  if (typeof ctx.on === 'function') {
    ctx.on('internal/config', function (_raw, next) {
      const resolved = next();
      if (!resolved || typeof resolved !== 'object' || !Array.isArray(resolved.plugins)) {
        return resolved;
      }
      if (!isBridgeEnabledByConfig()) return resolved;
      const shouldBridge = isBiliCompactionActive() || hasDisabledBasicCompaction(resolved.plugins);
      if (!shouldBridge) return resolved;

      const { rows: nextPlugins, count } = disableLegacyDependents(resolved.plugins);
      if (count === 0) return resolved;

      const rawName = this?.entry?.options?.name || this?.entry?.options?.id || 'agent-preset';
      log?.info?.(
        `[dsh-azure-glass] compaction-bridge: disabled ${count} legacy compaction-dependent plugin(s) for billion-context compatibility (${String(rawName).slice(0, 120)})`
      );
      return { ...resolved, plugins: nextPlugins };
    }, { global: true });
  }

  ctx.reflect?.provide?.(BRIDGE_SERVICE_NAME, Object.freeze({
    owner: 'dsh-azure-glass',
    targets: [...LEGACY_COMPACTION_DEPENDENTS],
  }));
}
