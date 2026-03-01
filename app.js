// Draagkompas – app navigatie & filters
const SCREENS = ["screen-1","screen-2","screen-3","screen-4-zoek","screen-4-vergelijk","screen-5-results"];
let currentScreen = "screen-1";
let lastChoice = null; // 'zoek' | 'vergelijk'
let filtersConfig = null;

function goTo(id) {
  SCREENS.forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.toggle('active', s === id);
  });
  currentScreen = id;
  updateHeaderVisibility();
  updateNavStates();
}

function updateHeaderVisibility() {
  const header = document.getElementById('app-header');
  const index = SCREENS.indexOf(currentScreen);
  // Header zichtbaar vanaf scherm 3
  if (index >= 2) header.classList.remove('hidden'); else header.classList.add('hidden');
}

function updateNavStates() {
  // Screen 1 back disabled
  const back1 = document.getElementById('btn-back-1');
  if (back1) { back1.disabled = true; back1.setAttribute('aria-disabled','true'); }

  // Screen 3 Verder afhankelijk van keuze
  const next3 = document.getElementById('btn-next-3');
  if (next3) { const enabled = !!lastChoice; next3.disabled = !enabled; next3.setAttribute('aria-disabled', String(!enabled)); }

  // On results, next disabled
  const next5 = document.getElementById('btn-next-5');
  if (next5) { next5.disabled = true; next5.setAttribute('aria-disabled','true'); }
}

function layerActiveForPath(layer, path) {
  if (layer === 'basis') return true;
  if (layer === 'uitgebreid') return path === 'vergelijk';
  if (layer === 'expert') return false;
  return false;
}

function createFieldEl(field, path) {
  const isActive = layerActiveForPath(field.layer, path);
  const isOverrideDisabled = filtersConfig.overrides && filtersConfig.overrides[field.id]?.forceDisabled;
  const active = isActive && !isOverrideDisabled;
  const group = document.createElement('div');
  group.className = 'field' + (active ? '' : ' is-disabled');

  const label = document.createElement('div'); label.className = 'field-label'; label.textContent = field.label;
  const meta = document.createElement('div'); meta.className = 'badges';
  const badge = document.createElement('span'); badge.className = 'badge'; badge.textContent = field.layer.toUpperCase(); meta.appendChild(badge);

  if (!active) {
    const lock = document.createElement('span'); lock.className = 'lock';
    const icon = document.createElement('span'); icon.className = 'icon'; icon.textContent = '🔒'; lock.appendChild(icon);
    const txt = document.createElement('span'); txt.textContent = (filtersConfig.overrides && filtersConfig.overrides[field.id]?.tooltip) || `Beschikbaar in ${field.layer.toUpperCase()}`; lock.appendChild(txt);
    const info = document.createElement('button'); info.className = 'info-btn'; info.type = 'button'; info.setAttribute('aria-label','Meer info'); info.title = txt.textContent || txt; info.textContent = 'ⓘ'; lock.appendChild(info);
    meta.appendChild(lock);
  }

  const header = document.createElement('div'); header.style.display='flex'; header.style.alignItems='center'; header.style.justifyContent='space-between'; header.style.gap='8px';
  header.appendChild(label); header.appendChild(meta); group.appendChild(header);

  const controls = document.createElement('div'); controls.className = 'field-controls';
  function disableControls(el){ if(!active){ el.setAttribute('disabled',''); el.setAttribute('aria-disabled','true'); }}

  switch(field.type){
    case 'chips':{ const wrap=document.createElement('div'); wrap.className='chips'; (field.options||[]).forEach(opt=>{ const chip=document.createElement('button'); chip.type='button'; chip.className='chip'; chip.setAttribute('aria-pressed','false'); chip.textContent=opt; if(active){ chip.addEventListener('click',()=>{ const p=chip.getAttribute('aria-pressed')==='true'; chip.setAttribute('aria-pressed', String(!p)); }); } else { chip.style.pointerEvents='none'; chip.style.cursor='not-allowed'; } wrap.appendChild(chip); }); controls.appendChild(wrap); break; }
    case 'checkbox':{ (field.options||[]).forEach(opt=>{ const lab=document.createElement('label'); lab.className='toggle'; const input=document.createElement('input'); input.type='checkbox'; disableControls(input); const span=document.createElement('span'); span.textContent=opt; lab.appendChild(input); lab.appendChild(span); controls.appendChild(lab); }); break; }
    case 'toggle':{ const lab=document.createElement('label'); lab.className='toggle'; const input=document.createElement('input'); input.type='checkbox'; disableControls(input); const span=document.createElement('span'); span.textContent='JA/NEE'; lab.appendChild(input); lab.appendChild(span); controls.appendChild(lab); break; }
    case 'select':{ const sel=document.createElement('select'); (field.options||[]).forEach(opt=>{ const o=document.createElement('option'); o.value=String(opt); o.textContent=String(opt); sel.appendChild(o); }); disableControls(sel); controls.appendChild(sel); break; }
    case 'multi-select':{ const wrap=document.createElement('div'); wrap.className='chips'; (field.options||[]).forEach(opt=>{ const chip=document.createElement('button'); chip.type='button'; chip.className='chip'; chip.setAttribute('aria-pressed','false'); chip.textContent=opt; if(active){ chip.addEventListener('click',()=>{ const p=chip.getAttribute('aria-pressed')==='true'; chip.setAttribute('aria-pressed', String(!p)); }); } else { chip.style.pointerEvents='none'; chip.style.cursor='not-allowed'; } wrap.appendChild(chip); }); controls.appendChild(wrap); break; }
    case 'number':{ const input=document.createElement('input'); input.type='number'; input.placeholder='0'; disableControls(input); controls.appendChild(input); break; }
    case 'text':{ const input=document.createElement('input'); input.type='text'; input.placeholder='—'; disableControls(input); controls.appendChild(input); break; }
    default:{ const input=document.createElement('input'); input.type='text'; disableControls(input); controls.appendChild(input); break; }
  }

  group.appendChild(controls);
  return group;
}

function renderFiltersForPath(path){
  const basicMount=document.getElementById(`filters-${path}-basic`);
  const moreMount=document.getElementById(`filters-${path}-more`);
  if(!basicMount||!moreMount) return; basicMount.innerHTML=''; moreMount.innerHTML='';
  const groups=filtersConfig.groups; const fields=filtersConfig.fields;
  groups.forEach(g=>{
    const basicFields=fields.filter(f=>f.group===g.id && f.layer==='basis');
    const moreFields=fields.filter(f=>f.group===g.id && f.layer!=='basis');
    if(basicFields.length){ const groupEl=document.createElement('section'); groupEl.className='group'; const head=document.createElement('div'); head.className='group-header'; const title=document.createElement('div'); title.className='group-title'; title.textContent=g.label; const badges=document.createElement('div'); badges.className='badges'; const b=document.createElement('span'); b.className='badge'; b.textContent='BASIS'; badges.appendChild(b); head.appendChild(title); head.appendChild(badges); groupEl.appendChild(head); basicFields.forEach(f=> groupEl.appendChild(createFieldEl(f, path))); basicMount.appendChild(groupEl); }
    if(moreFields.length){ const groupEl=document.createElement('section'); groupEl.className='group'; const head=document.createElement('div'); head.className='group-header'; const title=document.createElement('div'); title.className='group-title'; title.textContent=g.label; const badges=document.createElement('div'); badges.className='badges'; const hasU=moreFields.some(f=>f.layer==='uitgebreid'); const hasE=moreFields.some(f=>f.layer==='expert'); if(hasU){ const b=document.createElement('span'); b.className='badge'; b.textContent='UITGEBREID'; badges.appendChild(b); } if(hasE){ const b=document.createElement('span'); b.className='badge'; b.textContent='EXPERT'; badges.appendChild(b); } head.appendChild(title); head.appendChild(badges); groupEl.appendChild(head); moreFields.forEach(f=> groupEl.appendChild(createFieldEl(f, path))); moreMount.appendChild(groupEl); }
  });
}

function summarizeSelections(){
  const summary=[];
  document.querySelectorAll('.chip[aria-pressed="true"]').forEach(chip=> summary.push(`• ${chip.textContent}`));
  document.querySelectorAll('.field:not(.is-disabled) .field-controls input, .field:not(.is-disabled) .field-controls select').forEach(input=>{
    if(input.type==='checkbox'){ if(input.checked) summary.push(`• ${input.closest('.field').querySelector('.field-label').textContent.trim()}: JA`); }
    else if(input.tagName==='SELECT'){ const label=input.closest('.field').querySelector('.field-label').textContent.trim(); summary.push(`• ${label}: ${input.value}`); }
    else if(input.type==='number' && input.value){ const label=input.closest('.field').querySelector('.field-label').textContent.trim(); summary.push(`• ${label}: ${input.value}`); }
    else if(input.type==='text' && input.value){ const label=input.closest('.field').querySelector('.field-label').textContent.trim(); summary.push(`• ${label}: ${input.value}`); }
  });
  const out=document.getElementById('selected-filters'); if(out) out.textContent = summary.length ? summary.join('
') : 'Nog geen filters geselecteerd.';
}

function setupEvents(){
  // Screen 1
  document.getElementById('btn-next-1')?.addEventListener('click', ()=> goTo('screen-2'));

  // Screen 2
  document.getElementById('btn-back-2')?.addEventListener('click', ()=> goTo('screen-1'));
  document.getElementById('btn-next-2')?.addEventListener('click', ()=> goTo('screen-3'));

  // Screen 3
  document.getElementById('btn-back-3')?.addEventListener('click', ()=> goTo('screen-2'));
  document.getElementById('btn-next-3')?.addEventListener('click', ()=>{ if(lastChoice==='zoek') goTo('screen-4-zoek'); else if(lastChoice==='vergelijk') goTo('screen-4-vergelijk'); });
  document.getElementById('card-zoek')?.addEventListener('click', ()=>{ lastChoice='zoek'; updateNavStates(); renderFiltersForPath('zoek'); goTo('screen-4-zoek'); });
  document.getElementById('card-vergelijk')?.addEventListener('click', ()=>{ lastChoice='vergelijk'; updateNavStates(); renderFiltersForPath('vergelijk'); goTo('screen-4-vergelijk'); });

  // Filters – IK ZOEK
  document.getElementById('btn-back-4-zoek')?.addEventListener('click', ()=> goTo('screen-3'));
  document.getElementById('btn-next-4-zoek')?.addEventListener('click', ()=>{ summarizeSelections(); goTo('screen-5-results'); });
  document.getElementById('toggle-more-zoek')?.addEventListener('click', (e)=>{ const panel=document.getElementById('filters-zoek-more'); const expanded=e.currentTarget.getAttribute('aria-expanded')==='true'; e.currentTarget.setAttribute('aria-expanded', String(!expanded)); panel.hidden = expanded; });

  // Filters – IK VERGELIJK
  document.getElementById('btn-back-4-vergelijk')?.addEventListener('click', ()=> goTo('screen-3'));
  document.getElementById('btn-next-4-vergelijk')?.addEventListener('click', ()=>{ summarizeSelections(); goTo('screen-5-results'); });
  document.getElementById('toggle-more-vergelijk')?.addEventListener('click', (e)=>{ const panel=document.getElementById('filters-vergelijk-more'); const expanded=e.currentTarget.getAttribute('aria-expanded')==='true'; e.currentTarget.setAttribute('aria-expanded', String(!expanded)); panel.hidden = expanded; });

  // Results
  document.getElementById('btn-back-5')?.addEventListener('click', ()=>{ if(lastChoice==='zoek') goTo('screen-4-zoek'); else if(lastChoice==='vergelijk') goTo('screen-4-vergelijk'); });
}

async function bootstrap(){
  try{ const resp = await fetch('data/filters.json'); filtersConfig = await resp.json(); }
  catch(e){ console.error('Kon filters.json niet laden', e); filtersConfig = { groups: [], fields: [], overrides: {} }; }
  setupEvents(); updateHeaderVisibility(); updateNavStates();
}

document.addEventListener('DOMContentLoaded', bootstrap);
