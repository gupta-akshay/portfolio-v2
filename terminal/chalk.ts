import { Chalk } from 'chalk';

type ChalkLevel = 0 | 1 | 2 | 3;

const DEFAULT_LEVEL: ChalkLevel = 3;

const parseLevel = (value?: string): ChalkLevel | undefined => {
  if (!value?.length) return undefined;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return undefined;
  const clamped = Math.max(0, Math.min(3, Math.round(numeric))) as ChalkLevel;
  return clamped;
};

const configuredLevel =
  parseLevel(process.env.TERMINAL_CHALK_LEVEL) ??
  parseLevel(process.env.FORCE_COLOR) ??
  DEFAULT_LEVEL;

const forcedChalk = new Chalk({ level: configuredLevel });

export default forcedChalk;
