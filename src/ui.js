/**
 * src/ui.js - Orchestrates all UI interactions for the Thumbnail Architect side panel.
 * @module ui
 */

import { generateHeadlines }  from './engine.js';
import { renderSummary }       from './skills/summary.js';
import { exportJSON, exportPNG, renderThumbnailCanvas } from './skills/table.js';
import { getTranslationAdapter } from './adapters/index.js';
import { loadSettings, saveSettings, clearSettings } from './settings.js';

const tabBtns       = document.querySelectorAll('.tab-btn');
const tabPanels     = document.querySelectorAll('.tab-panel');
const topicInput    = document.getElementById('topicInput');
const nicheSelect   = document.getElementById('nicheSelect');
const styleSelect   = document.getElementById('styleSelect');
const generateBtn   = document.getElementById('generateBtn');
const generateIcon  = document.getElementById('generateBtnIcon');
const progressWrap  = document.getElementById('progressWrap');
const progressFill  = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');
const progressPct   = document.getElementById('progressPct');
const resultsCard   = document.getElementById('resultsCard');
const hooksBody     = document.getElementById('hooksBody');
const summaryBox    = document.getElementById('summaryBox');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const exportPngBtn  = document.getElementById('exportPngBtn');
const copyAllBtn    = document.getElementById('copyAllBtn');
const translateInput  = document.getElementById('translateInput');
const sourceLang      = document.getElementById('sourceLang');
const targetLang      = document.getElementById('targetLang');
const translateBtn    = document.getElementById('translateBtn');
const translateOutput = document.getElementById('translateOutput');
const previewHeadline  = document.getElemen

tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => activateTab(btn));
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const dirs = Array.from(tabBtns), idx = dirs.indexOf(btn);
      const next = e.key === 'ArrowRight' ? dirs[(idx+1)%dirs.length] : dirs[(idx-1+dirs.length)%dirs.length];
      next.focus(); activateTab(next);
    }
  });
});

function activateTab(btn) {
  tabBtns.forEach((b) => { b.setAttribute('aria-selected','false'); b.tabIndex = -1; });
  tabPanels.forEach((p) => p.classList.remove('active'));
  btn.setAttribute('aria-selected','true'); btn.tabIndex = 0;
  document.getElementById(btn.getAttribute('aria-controls'))?.classList.add('active');
}

function setProgress(pct, label) {
  progressWrap.classList.add('visible');
  progressFill.style.width = pct + '%';
  progressWrap.setAttribute('aria-valuenow', pct);
  progressLabel.textContent = label;
  progressPct.textContent = Math.round(pct) + '%';
}
function hideProgress() { progressWrap.classList.remove('visible'); progressFill.style.width = '0%'; }

generateBtn.addEventListener('click', async () => {
  const topic = topicInput.value.trim();
  if (!topic) { topicInput.focus(); topicInput.style.borderColor='var(--error)'; setTimeout(()=>(topicInput.style.borderColor=''),1500); return; }
  generateBtn.disabled = true;
  generateIcon.textContent = '...';
  resultsCard.classList.remove('visible'); hooksBody.innerHTML = ''; summaryBox.textContent = '';
  try {
    setProgress(10,'Initialising...'); await sleep(200);
    setProgress(30,'Applying formulas...');
    const result = await generateHeadlines({ topic, niche: nicheSelect.value, style: styleSelect.value });
    setProgress(70,'Scoring...'); await sleep(150);
    setProgress(90,'Rendering...'); await sleep(100);
    renderResults(result); lastResult = result;
    previewHeadline.value = result.hooks[0]?.text ?? '';
    setProgress(100,'Done!'); await sleep(400); hideProgress();
    resultsCard.classList.add('visible');
    resultsCard.scrollIntoView({ behavior:'smooth', block:'nearest' });
  } catch(err) {
    hideProgress(); summaryBox.textContent = 'Error: ' + err.message;
    resultsCard.classList.add('visible'); console.error('[ui]',err);
  } finally { generateBtn.disabled = false; generateIcon.textContent = 'Generate'; }
});

function renderResults(result) {
  hooksBody.innerHTML = '';
  result.hooks.forEach((hook, i) => {
    const tr = document.createElement('tr');
    const sc = hook.score >= 80 ? 'score-high' : hook.score >= 55 ? 'score-medium' : 'score-low';
    tr.innerHTML = '<td>'+(i+1)+'</td><td>'+hook.text+'</td><td><span class="hook-score '+sc+'">'+hook.score+'</span></td><td><span class="chip">'+hook.formula+'</span></td>';
    hooksBody.appendChild(tr);

translateBtn.addEventListener('click', async () => {
  const text = translateInput.value.trim();
  if (!text) { translateInput.focus(); return; }
  translateBtn.disabled = true;
  translateOutput.style.display = 'block';
  translateOutput.textContent = 'Translating...';
  try {
    const settings = await loadSettings();
    const adapter  = await getTranslationAdapter(settings);
    const result   = await adapter.translate({ q: text, source: sourceLang.value, target: targetLang.value });
    translateOutput.textContent = result.translatedText ?? result;
  } catch (err) {
    translateOutput.textContent = 'Translation error: ' + err.message;
  } finally { translateBtn.disabled = false; }
});

renderPreviewBtn.addEventListener('click', () => {
  const headline = previewHeadline.value.trim() || 'Your Headline Here';
  renderThumbnailCanvas(thumbnailCanvas, { headline, niche: previewNiche.value });
  thumbnailCanvas.classList.add('visible');
  downloadPngBtn.style.display = 'block';
});

downloadPngBtn.addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = thumbnailCanvas.toDataURL('image/png');
  a.download = 'thumbnail-placeholder.png';
  a.click();
});

providerSelect.addEventListener('change', () => {
  const val = providerSelect.value;
  libreSection.style.display      = (val === 'libretranslate' || val === 'custom') ? '' : 'none';
  customEndpointSec.style.display = val === 'custom' ? '' : 'none';
});

testConnectionBtn.addEventListener('click', async () => {
  const endpoint = libreEndpoint.value.trim() || 'http://localhost:5000';
  connectionStatus.style.color = 'var(--text-muted)';
  connectionStatus.textContent = 'Testing...';
  try {
    const res = await fetch(endpoint + '/languages', { signal: AbortSignal.timeout(5000) });
    if (res.ok) { connectionStatus.style.color = 'var(--success)'; connectionStatus.textContent = 'Connected!'; }
    else throw new Error('HTTP ' + res.status);
  } catch (err) {
    connectionStatus.style.color = 'var(--error)';
    connectionStatus.textContent = 'Failed: ' + err.message;
  }
});

saveSettingsBtn.addEventListener('click', async () => {
  await saveSettings({ provider: providerSelect.value, libreEndpoint: libreEndpoint.value.trim(), libreApiKey: libreApiKey.value.trim(), customEndpoint: customEndpoint.value.trim() });
  settingsSaveStatus.textContent = 'Settings saved.';
  setTimeout(() => (settingsSaveStatus.textContent = ''), 2500);
});

clearSettingsBtn.addEventListener('click', async () => {
  if (!confirm('Clear all saved settings?')) return;
  await clearSettings();
  libreEndpoint.value = ''; libreApiKey.value = ''; customEndpoint.value = '';
  providerSelect.value = 'mock';
  providerSelect.dispatchEvent(new Event('change'));
  settingsSaveStatus.textContent = 'Settings cleared.';
  setTimeout(() => (settingsSaveStatus.textContent = ''), 2000);
});

(async () => {
  const s = await loadSettings();
  if (s.provider)       providerSelect.value = s.provider;
  if (s.libreEndpoint)  libreEndpoint.value  = s.libreEndpoint;
  if (s.libreApiKey)    libreApiKey.value     = s.libreApiKey;
  if (s.customEndpoint) customEndpoint.value  = s.customEndpoint;
  providerSelect.dispatchEvent(new Event('change'));
  tabBtns.forEach((b, i) => { b.tabIndex = i === 0 ? 0 : -1; });
})();

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

export function sanitise(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}
  });
  summaryBox.textContent = renderSummary(result);
}

exportJsonBtn.addEventListener('click',()=>{ if(lastResult) exportJSON(lastResult); });
exportPngBtn.addEventListener('click',()=>{ if(lastResult) exportPNG({ headline: lastResult.hooks[0]?.text??lastResult.topic, niche:lastResult.niche }); });
copyAllBtn.addEventListener('click', async () => {
  if (!lastResult) return;
  const text = lastResult.hooks.map((h,i)=>(i+1)+'. '+h.text).join('\n');
  await navigator.clipboard.writeText(text).catch(()=>{});
  copyAllBtn.textContent = 'Copied!'; setTimeout(()=>(copyAllBtn.textContent='Copy'),1800);
});tById('previewHeadline');
const previewNiche     = document.getElementById('previewNiche');
const renderPreviewBtn = document.getElementById('renderPreviewBtn');
const thumbnailCanvas  = document.getElementById('thumbnailPreview');
const downloadPngBtn   = document.getElementById('downloadPngBtn');
const providerSelect      = document.getElementById('providerSelect');
const libreSection        = document.getElementById('libreSection');
const libreEndpoint       = document.getElementById('libreEndpoint');
const libreApiKey         = document.getElementById('libreApiKey');
const customEndpointSec   = document.getElementById('customEndpointSection');
const customEndpoint      = document.getElementById('customEndpoint');
const testConnectionBtn   = document.getElementById('testConnectionBtn');
const connectionStatus    = document.getElementById('connectionStatus');
const saveSettingsBtn     = document.getElementById('saveSettingsBtn');
const clearSettingsBtn    = document.getElementById('clearSettingsBtn');
const settingsSaveStatus  = document.getElementById('settingsSaveStatus');

let lastResult = null;
