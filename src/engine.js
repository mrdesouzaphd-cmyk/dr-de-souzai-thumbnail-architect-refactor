/**
 * src/engine.js – Core headline generation engine.
 * @module engine
 */

import { hookTransform }  from './skills/hook.js';
import { hypeTransform }  from './skills/hype.js';
import { tableTransform } from './skills/table.js';

const FORMULAS = {
  curiosity: curiosityFormulas,
  listicle:  listicleFormulas,
  howto:     howtoFormulas,
  shocking:  shockingFormulas,
  question:  questionFormulas,
  story:     storyFormulas,
};

export async function generateHeadlines({ topic, niche, style }) {
  if (!topic || typeof topic !== 'string') throw new TypeError('topic must be a non-empty string');
  const formulaFn = FORMULAS[style] ?? FORMULAS.curiosity;
  const rawHooks  = formulaFn(topic, niche);
  const hooked    = rawHooks.map((h) => hookTransform(h, { topic, niche }));
  const hyped     = hooked.map((h) => hypeTransform(h, { niche }));
  const scored    = hyped.map((h) => tableTransform(h, { topic, niche, style }));
  scored.sort((a, b) => b.score - a.score);
  return { topic, niche, style, hooks: scored, meta: { generatedAt: new Date().toISOString(), formulaSet: style, count: scored.length } };
}

function curiosityFormulas(topic) {
  const t = topic;
  return [
    { text: `The ${t} Secret Nobody Tells You`, formula: 'Secret Reveal' },
    { text: `What Happens When You Try ${t} (You Won't Believe)`, formula: 'Curiosity Gap' },
    { text: `I Tried ${t} For 30 Days – Here's What Changed`, formula: 'Personal Experiment' },
    { text: `The Dark Side of ${t} Nobody Talks About`, formula: 'Forbidden Knowledge' },
    { text: `${t}: The Truth Finally Revealed`, formula: 'Expose' },
    { text: `Why Everyone Is Wrong About ${t}`, formula: 'Contrarian' },
  ];
}

function listicleFormulas(topic) {
  const t = topic;
  return [
    { text: `7 ${t} Hacks That Will Change Everything`, formula: 'Power List' },
    { text: `5 Things You MUST Know About ${t}`, formula: 'Must-Know List' },
    { text: `10 ${t} Mistakes You're Making Right Now`, formula: 'Mistake List' },
    { text: `3 ${t} Tips Experts Don't Share`, formula: 'Expert Secrets List' },
    { text: `The #1 ${t} Strategy (Plus 4 Bonuses)`, formula: 'Number + Bonus' },
    { text: `8 Reasons ${t} Will Transform Your Life`, formula: 'Benefit List' },
  ];
}

function howtoFormulas(topic) {
  const t = topic;
  return [
    { text: `How to Master ${t} in 7 Days (Step by Step)`, formula: 'Speed Tutorial' },
    { text: `The Complete ${t} Guide for Beginners`, formula: 'Beginner Blueprint' },
    { text: `How I Used ${t} to Change My Life`, formula: 'Personal How-To' },
    { text: `How to Use ${t} Like a Pro (Even If You're a Beginner)`, formula: 'Pro Method' },
    { text: `${t} Tutorial: From Zero to Hero`, formula: 'Zero to Hero' },
    { text: `How to Finally Succeed With ${t}`, formula: 'Success Method' },
  ];
}

function shockingFormulas(topic) {
  const t = topic;
  return [
    { text: `I Can't Believe ${t} Did This…`, formula: 'Shock Reveal' },
    { text: `This ${t} Discovery Shocked Experts`, formula: 'Expert Shock' },
    { text: `Warning: Never Do This With ${t}`, formula: 'Warning Hook' },
    { text: `The ${t} Scandal You Need to Know About`, formula: 'Scandal Frame' },
    { text: `${t} Changed Overnight – Here's Why`, formula: 'Sudden Change' },
    { text: `The Biggest ${t} Lie You've Been Told`, formula: 'Lie Expose' },
  ];
}

function questionFormulas(topic) {
  const t = topic;
  return [
    { text: `Is ${t} Really Worth It?`, formula: 'Value Question' },
    { text: `Can You Really Make Money With ${t}?`, formula: 'Possibility Question' },
    { text: `What If ${t} Is Totally Wrong?`, formula: 'Challenge Question' },
    { text: `Are You Using ${t} Correctly?`, formula: 'Audit Question' },
    { text: `Why Is Everyone Talking About ${t}?`, formula: 'Trend Question' },
    { text: `Is ${t} the Future? (Honest Answer)`, formula: 'Future Question' },
  ];
}

function storyFormulas(topic) {
  const t = topic;
  return [
    { text: `How ${t} Saved My Career (True Story)`, formula: 'Redemption Arc' },
    { text: `My ${t} Journey: From Failure to Success`, formula: 'Journey Story' },
    { text: `I Failed at ${t} Until I Learned This`, formula: 'Lesson Story' },
    { text: `The Day ${t} Changed Everything For Me`, formula: 'Turning Point' },
    { text: `Why I Almost Quit ${t} (And Why I'm Glad I Didn't)`, formula: 'Perseverance Story' },
    { text: `${t} Ruined My Life – Until It Didn't`, formula: 'Reversal Story' },
  ];
}
