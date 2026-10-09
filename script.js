/* ============================================================
   Kia Kurniawan — Portfolio
   Data layer: defaults + localStorage overrides (admin-editable)
   ============================================================ */

const LS = {
  hash: 'kia_portfolio_admin_hash_v1',
  projects: 'kia_portfolio_projects_v1',
  certs: 'kia_portfolio_certs_v1',
};

/* ---------- Default content (real work only) ---------- */
const DEFAULT_PROJECTS = [
  {
    id: 'p-mining',
    title: 'Mining Production & Predictive Maintenance Intelligence',
    category: 'Data Science',
    description: 'Executive Streamlit dashboard (7 pages, 6 KPIs) with 5 ML models: production forecasting, equipment failure prediction, anomaly detection, cost prediction, and ore quality prediction on 737K rows of real mining data.',
    tech: ['Python', 'Streamlit', 'Scikit-learn', 'Pandas', 'Plotly'],
    github: 'https://github.com/KayyyKrwn/mining-production-intelligence',
    demo: '',
    image: '',
    featured: true,
  },
  {
    id: 'p-predictive-maintenance',
    title: 'Smart Manufacturing Analytics & Predictive Maintenance',
    category: 'Machine Learning',
    description: 'Predictive maintenance dashboard on the AI4I 2020 dataset. RandomForest failure prediction (ROC-AUC 0.9715), SHAP explanations, and a data-driven preventive maintenance schedule for 24 machines.',
    tech: ['Python', 'Streamlit', 'Scikit-learn', 'SHAP', 'Pandas'],
    github: 'https://github.com/KayyyKrwn/predictive-maintenance-dashboard',
    demo: '',
    image: '',
    featured: true,
  },
  {
    id: 'p-nfl',
    title: 'NFL Big Data Bowl 2027 — Sensor Analytics',
    category: 'Data Analytics',
    description: 'Kaggle competition writeup: 431K sensor rows engineered into motion metrics, tested whether combine sensors add predictive power over traditional drill times (repeated 5-fold CV + FDR-corrected analysis).',
    tech: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn'],
    github: '',
    demo: '',
    image: '',
    featured: true,
  },
];

const DEFAULT_CERTS = [
  { id: 'c-ibm-1', provider: 'IBM', title: 'What is Data Science?', category: 'Data Science', issued: '2024', code: '', url: '' },
  { id: 'c-ibm-2', provider: 'IBM', title: 'Tools for Data Science', category: 'Data Science', issued: '2024', code: '', url: '' },
  { id: 'c-ibm-3', provider: 'IBM', title: 'Data Science Methodology', category: 'Data Science', issued: '2024', code: '', url: '' },
  { id: 'c-ibm-4', provider: 'IBM', title: 'Excel Basics for Data Analysis', category: 'Analytics', issued: '2024', code: '', url: '' },
  { id: 'c-ibm-5', provider: 'IBM', title: 'Introduction to Data Analytics', category: 'Analytics', issued: '2024', code: '', url: '' },
];

const PROJECT_CATEGORIES = ['Data Science', 'Data Analytics', 'Machine Learning', 'Deep Learning', 'Web Development', 'Mobile Development', 'Others'];
const CERT_CATEGORIES = ['Data Science', 'Machine Learning', 'Deep Learning', 'Analytics', 'Cloud', 'Programming', 'Others'];

/* ---------- State ---------- */
let projects = loadJSON(LS.projects, DEFAULT_PROJECTS);
let certs = loadJSON(LS.certs, DEFAULT_CERTS);
let adminUnlocked = false;

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return structuredClone(fallback);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : structuredClone(fallback);
  } catch { return structuredClone(fallback); }
}
function saveAll() {
  localStorage.setItem(LS.projects, JSON.stringify(projects));
  localStorage.setItem(LS.certs, JSON.stringify(certs));
}
const uid = prefix => `${prefix}-${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;

/* ---------- Helpers ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const artClass = cat => ({
  'Data Science': 'art-data', 'Data Analytics': 'art-analytics',
  'Machine Learning': 'art-ml', 'Deep Learning': 'art-ml',
  'Web Development': 'art-web', 'Mobile Development': 'art-mobile',
}[cat] || 'art-default');
const catClass = cat => cat === 'Data Science' ? 'data' : cat === 'Mobile Development' ? 'mobile' : '';
const certTone = provider => ({
  IBM: 'tone-violet', Google: 'tone-blue', Meta: 'tone-blue', AWS: 'tone-amber',
  Microsoft: 'tone-teal', Dicoding: 'tone-violet', Kaggle: 'tone-teal',
  'DeepLearning.AI': 'tone-amber',
}[provider] || 'tone-violet');

/* ---------- Cards ---------- */
function adminBtns(kind, id) {
  if (!adminUnlocked) return '';
  return `<div class="card-admin">
    <button data-edit="${kind}" data-id="${esc(id)}" title="Edit">✎</button>
    <button data-edit="${kind}" data-id="${esc(id)}" data-del="1" class="del" title="Delete">🗑</button>
  </div>`;
}

function projectCard(p) {
  const artStyle = p.image ? ` style="background-image:url('${esc(p.image)}')"` : '';
  const links = [
    p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noreferrer">GitHub ↗</a>` : '',
    p.demo ? `<a href="${esc(p.demo)}" target="_blank" rel="noreferrer">Live demo ↗</a>` : '',
  ].filter(Boolean).join('');
  return `<article class="project-card" data-category="${esc(p.category)}">
    ${adminBtns('project', p.id)}
    <div class="project-art ${p.image ? '' : artClass(p.category)}"${artStyle}></div>
    <p class="category ${catClass(p.category)}">${esc(p.category)}</p>
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.description)}</p>
    <div class="chip-row">${(p.tech || []).map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>
    <div class="project-footer"><span class="links">${links || '<span style="color:#6b7089">Details soon</span>'}</span></div>
  </article>`;
}

function certificateCard(c) {
  const initials = c.provider.split(/\s+/).map(w => w[0]).join('').slice(0, 3).toUpperCase();
  const credLine = [c.issued ? `Issued ${esc(c.issued)}` : '', c.code ? `Credential ID: ${esc(c.code)}` : ''].filter(Boolean).join(' &nbsp;•&nbsp; ');
  const viewBtn = c.url ? `<a class="credential-button" href="${esc(c.url)}" target="_blank" rel="noreferrer">View Credential &nbsp;↗</a>` : `<span class="credential-button" style="opacity:.45">No link yet</span>`;
  return `<article class="certificate-card" data-category="${esc(c.category)}">
    ${adminBtns('cert', c.id)}
    <div class="certificate-art ${certTone(c.provider)}">
      <span class="issuer">${esc(c.provider)}</span>
      <span class="credential-title">${esc(c.title)}</span>
      <span class="completion">Certificate of Completion</span>
      <span class="certificate-name">Kia Kurniawan</span>
    </div>
    <div class="certificate-provider"><b class="provider-dot">${esc(initials)}</b><span>${esc(c.provider)}</span></div>
    <h3>${esc(c.title)}</h3>
    <p>${credLine}</p>
    <div class="certificate-footer">${viewBtn}<span></span></div>
  </article>`;
}

function miniCertificate(c) {
  const initials = c.provider.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return `<article class="cert-mini"><div class="cert-logo">${esc(initials)}</div>
    <div><h3>${esc(c.title)}</h3><p>${esc(c.provider)}${c.issued ? ' · ' + esc(c.issued) : ''}</p></div>
  </article>`;
}

/* ---------- Render ---------- */
function renderAll() {
  const featured = projects.filter(p => p.featured).slice(0, 3);
  document.getElementById('featured-projects').innerHTML = (featured.length ? featured : projects.slice(0, 3)).map(projectCard).join('');
  document.getElementById('project-grid').innerHTML = projects.map(projectCard).join('');
  document.getElementById('certificate-grid').innerHTML = certs.map(certificateCard).join('');
  document.getElementById('home-cert-list').innerHTML = certs.slice(0, 4).map(miniCertificate).join('');
  renderFilters('projects', projects);
  renderFilters('certifications', certs);
  renderStats();
  document.getElementById('year').textContent = new Date().getFullYear();
}

function renderFilters(group, items) {
  const wrap = document.getElementById(group === 'projects' ? 'project-filters' : 'cert-filters');
  const cats = [...new Set(items.map(i => i.category).filter(Boolean))];
  wrap.innerHTML = `<button class="filter active" data-filter="all">All</button>` +
    cats.map(c => `<button class="filter" data-filter="${esc(c)}">${esc(c)}</button>`).join('');
}

function renderStats() {
  const tech = new Set(projects.flatMap(p => p.tech || []));
  const projCats = new Set(projects.map(p => p.category).filter(Boolean));
  document.getElementById('project-stats').innerHTML = `
    <div class="stat-card glass"><b>▱</b><strong>${projects.length}</strong><span>Projects</span></div>
    <div class="stat-card glass"><b>⌘</b><strong>${tech.size}</strong><span>Technologies</span></div>
    <div class="stat-card glass"><b>◈</b><strong>${projCats.size}</strong><span>Categories</span></div>
    <div class="stat-card glass"><b>◖</b><strong>${projects.filter(p => p.github).length}</strong><span>Open Source</span></div>`;
  const providers = new Set(certs.map(c => c.provider).filter(Boolean));
  const years = certs.map(c => parseInt(c.issued, 10)).filter(Number.isFinite);
  document.getElementById('cert-stats').innerHTML = `
    <div class="stat-card glass"><b>✿</b><strong>${certs.length}</strong><span>Certificates</span></div>
    <div class="stat-card glass"><b>▣</b><strong>${providers.size}</strong><span>Providers</span></div>
    <div class="stat-card glass"><b>▦</b><strong>${years.length ? Math.max(...years) : '—'}</strong><span>Latest</span></div>
    <div class="stat-card glass"><b>◴</b><strong>${new Set(certs.map(c => c.category).filter(Boolean)).size}</strong><span>Fields</span></div>`;
}

/* ---------- Routing ---------- */
function switchPage(page) {
  document.querySelectorAll('[data-page]').forEach(el => el.classList.toggle('active', el.dataset.page === page));
  document.querySelectorAll('[data-page-link]').forEach(el => el.classList.toggle('active', el.dataset.pageLink === page));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function resolveRoute() {
  const route = window.location.hash.replace('#', '') || 'home';
  switchPage(document.querySelector(`[data-page="${route}"]`) ? route : 'home');
}
window.addEventListener('hashchange', resolveRoute);

/* ---------- Filters ---------- */
document.querySelectorAll('[data-filter-group]').forEach(group => {
  group.addEventListener('click', event => {
    const button = event.target.closest('.filter');
    if (!button) return;
    group.querySelectorAll('.filter').forEach(el => el.classList.toggle('active', el === button));
    const cards = group.dataset.filterGroup === 'projects'
      ? document.querySelectorAll('#project-grid .project-card')
      : document.querySelectorAll('#certificate-grid .certificate-card');
    cards.forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
  });
});

/* ---------- Card edit/delete (event delegation) ---------- */
document.addEventListener('click', event => {
  const btn = event.target.closest('[data-edit]');
  if (!btn || !adminUnlocked) return;
  event.stopPropagation();
  const { edit: kind, id, del } = btn.dataset;
  if (del) return confirmDelete(kind, id);
  if (kind === 'project') openProjectForm(projects.find(p => p.id === id));
  else openCertForm(certs.find(c => c.id === id));
});

function confirmDelete(kind, id) {
  const item = kind === 'project' ? projects.find(p => p.id === id) : certs.find(c => c.id === id);
  openModal(kind === 'project' ? 'Delete project' : 'Delete certificate',
    `<p class="form-hint">Delete <b style="color:#fff">“${esc(item.title)}”</b>? This can't be undone (unless you have an exported backup).</p>
     <div class="form-actions">
       <button class="button secondary" id="m-cancel">Cancel</button>
       <button class="button primary" id="m-delete" style="background:linear-gradient(110deg,#b91c1c,#ef4444);box-shadow:0 5px 22px rgba(239,68,68,.4)">Delete</button>
     </div>`);
  document.getElementById('m-cancel').onclick = closeModal;
  document.getElementById('m-delete').onclick = () => {
    if (kind === 'project') projects = projects.filter(p => p.id !== id);
    else certs = certs.filter(c => c.id !== id);
    saveAll(); renderAll(); closeModal();
  };
}

/* ---------- Modal ---------- */
const overlay = document.getElementById('modal-overlay');
function openModal(title, bodyHTML) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  overlay.hidden = true;
  document.body.style.overflow = '';
}
document.getElementById('modal-close').onclick = closeModal;
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !overlay.hidden) closeModal(); });

/* ---------- Admin auth ---------- */
async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

const lockBtn = document.getElementById('admin-lock');
const adminBar = document.getElementById('admin-bar');

lockBtn.addEventListener('click', () => {
  if (adminUnlocked) return setAdmin(false);
  const hasPassword = !!localStorage.getItem(LS.hash);
  openModal(hasPassword ? 'Admin login' : 'Set admin password', `
    <div class="form-grid">
      <p class="form-hint">${hasPassword
        ? 'Enter your admin password to manage projects & certificates.'
        : 'First time here? Create an admin password. Only someone with this password can add, edit, or delete your projects and certificates.'}</p>
      <label>Password
        <input type="password" id="m-pass" placeholder="${hasPassword ? 'Enter password' : 'Create password (min 4 characters)'}" autocomplete="new-password" />
      </label>
      ${!hasPassword ? `<label>Confirm password<input type="password" id="m-pass2" placeholder="Repeat password" autocomplete="new-password" /></label>` : ''}
      <p class="form-error" id="m-error"></p>
      <div class="form-actions">
        <button class="button secondary" id="m-cancel">Cancel</button>
        <button class="button primary" id="m-submit">${hasPassword ? 'Unlock' : 'Create & unlock'}</button>
      </div>
    </div>`);
  document.getElementById('m-cancel').onclick = closeModal;
  const submit = async () => {
    const pass = document.getElementById('m-pass').value;
    const err = document.getElementById('m-error');
    if (pass.length < 4) { err.textContent = 'Password must be at least 4 characters.'; return; }
    if (!hasPassword) {
      const pass2 = document.getElementById('m-pass2').value;
      if (pass !== pass2) { err.textContent = 'Passwords do not match.'; return; }
      localStorage.setItem(LS.hash, await sha256(pass));
      setAdmin(true); closeModal();
    } else {
      if (await sha256(pass) === localStorage.getItem(LS.hash)) { setAdmin(true); closeModal(); }
      else err.textContent = 'Wrong password. Try again.';
    }
  };
  document.getElementById('m-submit').onclick = submit;
  document.getElementById('m-pass').addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  setTimeout(() => document.getElementById('m-pass').focus(), 50);
});

function setAdmin(on) {
  adminUnlocked = on;
  adminBar.hidden = !on;
  lockBtn.classList.toggle('unlocked', on);
  lockBtn.textContent = on ? '🔓' : '🔒';
  lockBtn.title = on ? 'Admin mode on — click to lock' : 'Admin mode';
  renderAll();
}

/* ---------- Admin: forms ---------- */
const selectOpts = (list, current) => list.map(c => `<option ${c === current ? 'selected' : ''}>${esc(c)}</option>`).join('');

function openProjectForm(p) {
  const isNew = !p;
  p = p || { title: '', category: 'Data Science', description: '', tech: [], github: '', demo: '', image: '', featured: false };
  openModal(isNew ? 'Add project' : 'Edit project', `
    <div class="form-grid">
      <label>Title<input id="f-title" value="${esc(p.title)}" placeholder="e.g. Sales Forecasting Dashboard" /></label>
      <label>Category<select id="f-cat">${selectOpts(PROJECT_CATEGORIES, p.category)}</select></label>
      <label>Description<textarea id="f-desc" placeholder="What does it do? What data, what models, what results?">${esc(p.description)}</textarea></label>
      <label>Tech stack (comma separated)<input id="f-tech" value="${esc((p.tech || []).join(', '))}" placeholder="Python, Streamlit, Scikit-learn" /></label>
      <label>GitHub URL<input id="f-github" value="${esc(p.github)}" placeholder="https://github.com/..." /></label>
      <label>Live demo URL (optional)<input id="f-demo" value="${esc(p.demo)}" placeholder="https://..." /></label>
      <label>Cover image URL (optional)<input id="f-image" value="${esc(p.image)}" placeholder="https://... — leave empty for auto art" /></label>
      <label style="display:flex;flex-direction:row;align-items:center;gap:10px;cursor:pointer">
        <input type="checkbox" id="f-feat" ${p.featured ? 'checked' : ''} style="width:auto" /> Show on homepage (max 3)
      </label>
      <p class="form-error" id="f-error"></p>
      <div class="form-actions">
        <button class="button secondary" id="f-cancel">Cancel</button>
        <button class="button primary" id="f-save">${isNew ? 'Add project' : 'Save changes'}</button>
      </div>
    </div>`);
  document.getElementById('f-cancel').onclick = closeModal;
  document.getElementById('f-save').onclick = () => {
    const title = document.getElementById('f-title').value.trim();
    if (!title) { document.getElementById('f-error').textContent = 'Title is required.'; return; }
    const data = {
      id: p.id || uid('p'),
      title,
      category: document.getElementById('f-cat').value,
      description: document.getElementById('f-desc').value.trim(),
      tech: document.getElementById('f-tech').value.split(',').map(s => s.trim()).filter(Boolean),
      github: document.getElementById('f-github').value.trim(),
      demo: document.getElementById('f-demo').value.trim(),
      image: document.getElementById('f-image').value.trim(),
      featured: document.getElementById('f-feat').checked,
    };
    if (isNew) projects.unshift(data);
    else projects = projects.map(x => x.id === p.id ? data : x);
    saveAll(); renderAll(); closeModal();
  };
}

function openCertForm(c) {
  const isNew = !c;
  c = c || { provider: '', title: '', category: 'Data Science', issued: '', code: '', url: '' };
  openModal(isNew ? 'Add certificate' : 'Edit certificate', `
    <div class="form-grid">
      <label>Provider<input id="f-provider" value="${esc(c.provider)}" placeholder="e.g. IBM, Google, Dicoding" /></label>
      <label>Certificate title<input id="f-title" value="${esc(c.title)}" placeholder="e.g. Data Science Professional Certificate" /></label>
      <label>Category<select id="f-cat">${selectOpts(CERT_CATEGORIES, c.category)}</select></label>
      <label>Issued (e.g. 2024 / Nov 2024)<input id="f-issued" value="${esc(c.issued)}" placeholder="2024" /></label>
      <label>Credential ID (optional)<input id="f-code" value="${esc(c.code)}" placeholder="ABC-123" /></label>
      <label>Credential URL (optional)<input id="f-url" value="${esc(c.url)}" placeholder="https://..." /></label>
      <p class="form-error" id="f-error"></p>
      <div class="form-actions">
        <button class="button secondary" id="f-cancel">Cancel</button>
        <button class="button primary" id="f-save">${isNew ? 'Add certificate' : 'Save changes'}</button>
      </div>
    </div>`);
  document.getElementById('f-cancel').onclick = closeModal;
  document.getElementById('f-save').onclick = () => {
    const title = document.getElementById('f-title').value.trim();
    if (!title) { document.getElementById('f-error').textContent = 'Title is required.'; return; }
    const data = {
      id: c.id || uid('c'),
      provider: document.getElementById('f-provider').value.trim() || '—',
      title,
      category: document.getElementById('f-cat').value,
      issued: document.getElementById('f-issued').value.trim(),
      code: document.getElementById('f-code').value.trim(),
      url: document.getElementById('f-url').value.trim(),
    };
    if (isNew) certs.unshift(data);
    else certs = certs.map(x => x.id === c.id ? data : x);
    saveAll(); renderAll(); closeModal();
  };
}

/* ---------- Admin: toolbar actions ---------- */
document.getElementById('btn-add-project').onclick = () => openProjectForm();
document.getElementById('btn-add-cert').onclick = () => openCertForm();
document.getElementById('btn-lock').onclick = () => setAdmin(false);
document.getElementById('btn-reset').onclick = () => {
  openModal('Reset content', `<p class="form-hint">Restore the original projects & certificates, discarding all your edits?</p>
    <div class="form-actions">
      <button class="button secondary" id="m-cancel">Cancel</button>
      <button class="button primary" id="m-yes">Reset</button>
    </div>`);
  document.getElementById('m-cancel').onclick = closeModal;
  document.getElementById('m-yes').onclick = () => {
    localStorage.removeItem(LS.projects); localStorage.removeItem(LS.certs);
    projects = structuredClone(DEFAULT_PROJECTS); certs = structuredClone(DEFAULT_CERTS);
    renderAll(); closeModal();
  };
};
document.getElementById('btn-export').onclick = () => {
  const blob = new Blob([JSON.stringify({ projects, certs }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'portfolio-data.json';
  a.click();
  URL.revokeObjectURL(a.href);
};
document.getElementById('btn-import').onclick = () => document.getElementById('import-file').click();
document.getElementById('import-file').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data.projects) || !Array.isArray(data.certs)) throw new Error('bad shape');
      projects = data.projects; certs = data.certs;
      saveAll(); renderAll();
      alert('Import successful.');
    } catch { alert('Invalid file — import cancelled.'); }
    e.target.value = '';
  };
  reader.readAsText(file);
});

/* ---------- Aurora background ---------- */
const canvas = document.getElementById('aurora');
const context = canvas.getContext('2d');
let pointer = { x: innerWidth * .65, y: innerHeight * .32 };
function resizeCanvas() {
  canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`;
  context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
function drawAurora(time) {
  const width = innerWidth, height = innerHeight;
  context.clearRect(0, 0, width, height);
  const base = context.createLinearGradient(0, 0, width, height);
  base.addColorStop(0, '#050914'); base.addColorStop(.5, '#070a15'); base.addColorStop(1, '#060814');
  context.fillStyle = base; context.fillRect(0, 0, width, height);
  const clouds = [[width * .16, height * .22, width * .42, '#3b1d8d'], [width * .63, height * .21, width * .44, '#162e82'], [pointer.x, pointer.y, width * .25, '#7131bb'], [width * .45, height * .85, width * .38, '#1c286a']];
  clouds.forEach(([x, y, r, color], index) => {
    const drift = Math.sin(time * .00018 + index * 2) * 30;
    const glow = context.createRadialGradient(x + drift, y, 0, x + drift, y, r);
    glow.addColorStop(0, `${color}34`); glow.addColorStop(.45, `${color}13`); glow.addColorStop(1, `${color}00`);
    context.fillStyle = glow; context.fillRect(0, 0, width, height);
  });
  requestAnimationFrame(drawAurora);
}
addEventListener('resize', resizeCanvas);
addEventListener('pointermove', event => pointer = { x: event.clientX, y: event.clientY });
resizeCanvas(); requestAnimationFrame(drawAurora);

/* ---------- init ---------- */
renderAll();
resolveRoute();
