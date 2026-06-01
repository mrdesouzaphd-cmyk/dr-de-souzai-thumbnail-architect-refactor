/**
 * src/skills/summary.js - Summary transform skill.
 * Generates a human-readable strategy summary from ranked hooks.
 * Pure functions only - no side effects.
 * @module skills/summary
 */

const NICHE_TIPS = {
  tech:          'Focus on specificity and credibility signals. Include version numbers or tech names when possible.',
  finance:       'Lead with outcome (money, returns, savings). Viewers respond to concrete numbers.',
  health:        'Emphasise transformation and safety. Avoid unverified medical claims in thumbnails.',
  gaming:        'Use gaming slang and emojis to signal in-group familiarity. Speed and competition language converts well.',
  education:     'Structure and completeness matter. "Step-by-step" and "complete guide" signal high value.',
  entertainment: 'Emotion and surprise are primary drivers. Keep text short; let the image carry context.',
  business:      'ROI and scalability language performs well. Pair with credibility (results, case studies).',
  general:       'Keep headlines concise and benefit-driven. Test multiple variants to find what resonates.',
};

const STYLE_NOTES = {
  curiosity:  'Curiosity gaps work best when the payoff inside the video is worth it. Never mislead viewers.',
  listicle:   'Odd numbers (7, 5, 3) tend to outperform even numbers in click-through studies.',
  howto:      'Include a timeframe or difficulty signal to boost clicks.',
  shocking:   'Use sparingly to avoid desensitising your audience. Back up every claim in the video.',
  question:   'Questions work best when the viewer already has a mild opinion on the topic.',
  story:      'Story hooks create strong emotional pull but may have lower search traffic.',
};

/**
 * Render a human-readable strategy summary from a GenerateResult.
 * @param {object} result
 * @returns {string}
 */
export function renderSummary(result) {
  if (!result || !Array.isArray(result.hooks) || result.hooks.length === 0) {
    return 'No results to summarise.';
  }
  const top       = result.hooks[0];
  const avgScore  = Math.round(result.hooks.reduce((s, h) => s + h.score, 0) / result.hooks.length);
  const nicheTip  = NICHE_TIPS[result.niche]  ?? NICHE_TIPS.general;
  const styleNote = STYLE_NOTES[result.style] ?? '';
  const lines = [
    'TOP PICK: "' + top.text + '"',
    '   Score: ' + top.score + '/100  |  Formula: ' + top.formula,
    '',
    'BATCH STATS',
    '   Headlines generated: ' + result.hooks.length,
    '   Average score:       ' + avgScore + '/100',
    '   Best formula:        ' + top.formula,
    '',
    'NICHE TIP (' + result.niche.toUpperCase() + ')',
    '   ' + nicheTip,
    '',
    'STYLE NOTE (' + result.style + ')',
    '   ' + styleNote,
    '',
    'Generated: ' + new Date(result.meta?.generatedAt).toLocaleString(),
  ];
  return lines.join('\n');
}

/**
 * Summarise a single hook for compact display.
 * @param {{ text: string, score: number, formula: string }} hook
 * @returns {string}
 */
export function summariseHook(hook) {
  if (!hook) return '';
  return '[' + hook.score + '/100] ' + hook.text + ' (' + hook.formula + ')';
}
