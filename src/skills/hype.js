/**
 * src/skills/hype.js – Hype transform skill.
 * Applies niche-specific emotional amplifiers and CTR multipliers.
 * Pure functions only – no side effects.
 * @module skills/hype
 */

/** Hype modifiers keyed by niche */
const HYPE_MODIFIERS = {
  tech:          { multiplier: 1.15, suffix: '🔥', prefix: '' },
  finance:       { multiplier: 1.20, suffix: '💰', prefix: '' },
  health:        { multiplier: 1.10, suffix: '💪', prefix: '' },
  gaming:        { multiplier: 1.18, suffix: '🎮', prefix: '' },
  education:     { multiplier: 1.05, suffix: '📚', prefix: '' },
  entertainment: { multiplier: 1.22, suffix: '🎬', prefix: '' },
  business:      { multiplier: 1.18, suffix: '🚀', prefix: '' },
  general:       { multiplier: 1.00, suffix: '',   prefix: '' },
};

/** Emotional intensity patterns that boost hype score */
const EMOTIONAL_PATTERNS = [
  /\bwon't believe\b/i,
  /\bshocking\b/i,
  /\bincredible\b/i,
  /\bchanged (my|my life|everything)\b/i,
  /\bsecret\b/i,
  /\bnobody (tells|talks|knows)\b/i,
  /\bfinally\b/i,
  /\bwarning\b/i,
];

/**
 * Apply hype transforms to a hooked headline.
 * @param {{ text: string, formula: string, hookScore: number }} hook
 * @param {{ niche: string }} ctx
 * @returns {{ text: string, formula: string, hookScore: number, hypeScore: number, hypeMultiplier: number }}
 */
export function hypeTransform(hook, { niche }) {
  if (!hook || typeof hook.text !== 'string') {
    throw new TypeError('hypeTransform: hook must have a text property');
  }
  const mod          = HYPE_MODIFIERS[niche] ?? HYPE_MODIFIERS.general;
  const emotionCount = countEmotionalPatterns(hook.text);
  const hypeBonus    = emotionCount * 6;
  const hypeScore    = Math.min(100, Math.round((hook.hookScore ?? 40) * mod.multiplier + hypeBonus));
  return {
    ...hook,
    hypeScore,
    hypeMultiplier: mod.multiplier,
    hypeEmoji:      mod.suffix,
  };
}

/**
 * Count how many emotional intensity patterns match the headline.
 * @param {string} text
 * @returns {number}
 */
export function countEmotionalPatterns(text) {
  if (typeof text !== 'string') return 0;
  return EMOTIONAL_PATTERNS.reduce((n, re) => n + (re.test(text) ? 1 : 0), 0);
}

/**
 * Get hype modifier config for a niche.
 * @param {string} niche
 * @returns {{ multiplier: number, suffix: string, prefix: string }}
 */
export function getHypeModifier(niche) {
  return HYPE_MODIFIERS[niche] ?? HYPE_MODIFIERS.general;
}
