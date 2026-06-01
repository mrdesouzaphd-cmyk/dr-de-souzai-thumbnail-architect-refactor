/**
 * src/skills/hook.js – Hook transform skill.
 * Enhances raw headlines with power words, emotional triggers, and CTR boosters.
 * Pure functions only – no side effects.
 * @module skills/hook
 */

/** Power words grouped by emotional category */
const POWER_WORDS = {
  urgency:    ['Now', 'Today', 'Instantly', 'Immediately', 'Fast'],
  curiosity:  ['Secret', 'Hidden', 'Unknown', 'Untold', 'Revealed'],
  value:      ['Free', 'Proven', 'Guaranteed', 'Ultimate', 'Complete'],
  emotion:    ['Shocking', 'Incredible', 'Unbelievable', 'Surprising', 'Amazing'],
  authority:  ['Expert', 'Professional', 'Certified', 'Trusted', 'Official'],
  negative:   ['Warning', 'Mistake', 'Danger', 'Avoid', 'Stop'],
};

/** Niche-specific power word overrides */
const NICHE_POWER_WORDS = {
  tech:          ['Breakthrough', 'Advanced', 'Cutting-Edge', 'Next-Level'],
  finance:       ['Profitable', 'Wealth-Building', 'High-Return', 'Tax-Free'],
  health:        ['Healthy', 'Energising', 'Life-Changing', 'Doctor-Approved'],
  gaming:        ['OP', 'Meta', 'Game-Breaking', 'Overpowered'],
  education:     ['Mastery', 'Comprehensive', 'In-Depth', 'Step-by-Step'],
  entertainment: ['Hilarious', 'Jaw-Dropping', 'Must-Watch', 'Epic'],
  business:      ['Profitable', 'Scalable', 'Automated', 'Revenue-Generating'],
  general:       ['Essential', 'Must-Know', 'Important', 'Valuable'],
};

/**
 * Apply hook transforms to a raw headline object.
 * @param {{ text: string, formula: string }} hook
 * @param {{ topic: string, niche: string }} ctx
 * @returns {{ text: string, formula: string, powerWords: string[], hookScore: number }}
 */
export function hookTransform(hook, { topic, niche }) {
  if (!hook || typeof hook.text !== 'string') {
    throw new TypeError('hookTransform: hook must have a text property');
  }
  const detectedPowerWords = detectPowerWords(hook.text);
  const nicheWords         = NICHE_POWER_WORDS[niche] ?? NICHE_POWER_WORDS.general;
  const hookScore          = calculateHookScore(hook.text, detectedPowerWords, nicheWords);
  return { ...hook, powerWords: detectedPowerWords, hookScore };
}

/**
 * Detect power words present in a headline.
 * @param {string} text
 * @returns {string[]}
 */
export function detectPowerWords(text) {
  if (typeof text !== 'string') return [];
  const lower    = text.toLowerCase();
  const detected = [];
  for (const [, words] of Object.entries(POWER_WORDS)) {
    for (const word of words) {
      if (lower.includes(word.toLowerCase()) && !detected.includes(word)) {
        detected.push(word);
      }
    }
  }
  return detected;
}

/**
 * Calculate a raw hook engagement score based on linguistic signals.
 * @param {string} text
 * @param {string[]} powerWords
 * @param {string[]} nicheWords
 * @returns {number} 0-100
 */
export function calculateHookScore(text, powerWords = [], nicheWords = []) {
  if (typeof text !== 'string') return 0;
  let score = 45;
  score += Math.min(powerWords.length * 8, 30);
  if (/\b\d+\b/.test(text)) score += 10;
  if (text.includes('?') || text.includes('...')) score += 5;
  const capsWords = (text.match(/\b[A-Z]{2,}\b/g) ?? []).length;
  score += Math.min(capsWords * 4, 8);
  const len = text.length;
  if (len >= 40 && len <= 65) score += 7;
  else if (len < 30 || len > 80) score -= 5;
  const lower = text.toLowerCase();
  for (const nw of nicheWords) {
    if (lower.includes(nw.toLowerCase())) { score += 5; break; }
  }
  return Math.max(0, Math.min(100, Math.round(score)));
}
