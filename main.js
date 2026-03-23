/**
 * JTQ GLOBAL JOBS BOARD — main.js
 */

const DEPT_ICONS = {
  'Customer Support':  '🎧',
  'Sales & Marketing': '📈',
  'Tech':              '💻',
  'Operations':        '⚙️',
  'Finance':           '💼',
  'HR':                '🤝',
  'Other':             '🌐',
};

const SETUP_CLASS = { 'Remote': 'job-badge--remote', 'On-site': 'job-badge--on-site', 'Hybrid': 'job-badge--hybrid' };
const TYPE_CLASS  = { 'Full-time': 'job-badge--full-time', 'Part-time': 'job-badge--part-time', 'Contract': 'job-badge--contract', 'Project-based': 'job-badge--project' };

const formatDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const daysAgo = (iso) => {
  const d = Math.floor((Date.now() - new Date(iso + 'T00:00:00')) / 86_400_000);
  if (d === 0) return 'Posted today';
  if (d === 1) return 'Posted 1 day ago';
  if (d < 30)  return `Posted ${d} days ago`;
  return `Posted ${formatDate(iso)}`;
};

/* ── Nav (mirrors shared.js) ─────────────────── */
function initNav() {
  const nav      = document.querySelector('.nav');
  const hero     = document.querySelector('.fullbleed-hero');
  const toggle   = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  const update = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    if (hero) nav.classList.toggle('on-hero', hero.getBoundingClientRect().bottom > 60);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });

  toggle?.addEventListener('click', function () {
    const open = navLinks.classList.toggle('open');
    this.setAttribute('aria-expanded', open);
    this.classList.toggle('open', open);
  });
  navLinks?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    })
  );
}

/* ── Card builder ────────────────────────────── */
function buildCard(job, index) {
  const card = document.createElement('article');
  card.className = 'job-card';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `View details for ${job.title}`);
  card.style.animationDelay = `${index * 55}ms`;

  card.innerHTML = `
    <div class="job-card__top">
      <div class="job-card__dept-icon" aria-hidden="true">${DEPT_ICONS[job.department] ?? '🌐'}</div>
      <div class="job-card__badges">
        <span class="job-badge ${SETUP_CLASS[job.workSetup] ?? ''}">${job.workSetup}</span>
        <span class="job-badge ${TYPE_CLASS[job.employmentType] ?? ''}">${job.employmentType}</span>
      </div>
    </div>
    <div>
      <h2 class="job-card__title">${job.title}</h2>
      <div class="job-card__meta">
        <span class="job-card__meta-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
          ${job.department}
        </span>
        <span class="job-card__meta-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${job.location}
        </span>
      </div>
    </div>
    <p class="job-card__desc">${job.shortDescription}</p>
    <div class="job-card__footer">
      <span>${daysAgo(job.postedDate)}</span>
      <span class="job-card__cta">View role <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
    </div>`;

  const open = () => openModal(job);
  card.addEventListener('click', open);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  return card;
}

/* ── Modal ───────────────────────────────────── */
let overlay   = null;
let modal     = null;
let modalBody = null;
let lastFocused = null;

function initModal() {
  overlay   = document.getElementById('modal-overlay');
  modal     = document.getElementById('modal');
  modalBody = document.getElementById('modal-body');
  if (!overlay) return;

  // Close button
  document.querySelector('.modal__close').addEventListener('click', closeModal);

  // Backdrop tap
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
  });

  // Focus trap
  modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = [...modal.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    if (e.shiftKey && document.activeElement === focusable[0]) { e.preventDefault(); focusable.at(-1).focus(); }
    else if (!e.shiftKey && document.activeElement === focusable.at(-1)) { e.preventDefault(); focusable[0].focus(); }
  });

  // ── Touch drag-to-dismiss (mobile only) ───────
  let dragStart = null;   // { y, scrollTop }
  let dragY     = 0;

  const header = modal.querySelector('.modal__header');

  const onTouchStart = (e) => {
    // Only initiate drag when: sheet is scrolled to top OR touch starts on the header
    const scrolledToTop = modal.scrollTop === 0;
    const touchOnHeader = header.contains(e.target);
    if (!scrolledToTop && !touchOnHeader) return;

    dragStart = { y: e.touches[0].clientY, scrollTop: modal.scrollTop };
    dragY = 0;
    modal.classList.add('is-dragging');
  };

  const onTouchMove = (e) => {
    if (dragStart === null) return;

    const dy = e.touches[0].clientY - dragStart.y;

    // If user is scrolling up inside the sheet, cancel the drag
    if (dy < 0) {
      dragStart = null;
      modal.classList.remove('is-dragging');
      return;
    }

    // Prevent the page from scrolling while we're dragging the sheet
    e.preventDefault();

    dragY = dy;
    modal.style.transform = `translateY(${dragY}px)`;
  };

  const onTouchEnd = () => {
    if (dragStart === null) return;
    modal.classList.remove('is-dragging');
    modal.style.transform = '';

    // Dismiss if dragged more than 120px or flicked quickly
    if (dragY > 120) {
      closeModal();
    }

    dragStart = null;
    dragY = 0;
  };

  modal.addEventListener('touchstart', onTouchStart, { passive: true });
  modal.addEventListener('touchmove',  onTouchMove,  { passive: false });
  modal.addEventListener('touchend',   onTouchEnd,   { passive: true });
}

function openModal(job) {
  lastFocused = document.activeElement;

  modalBody.innerHTML = `
    <div>
      <p class="modal__title">${job.title}</p>
      <div class="modal__badges">
        <span class="job-badge ${SETUP_CLASS[job.workSetup] ?? ''}">${job.workSetup}</span>
        <span class="job-badge ${TYPE_CLASS[job.employmentType] ?? ''}">${job.employmentType}</span>
      </div>
    </div>
    <div class="modal__meta-grid">
      <div class="modal__meta-item"><div class="modal__meta-label">Department</div><div class="modal__meta-value">${job.department}</div></div>
      <div class="modal__meta-item"><div class="modal__meta-label">Location</div><div class="modal__meta-value">${job.location}</div></div>
      <div class="modal__meta-item"><div class="modal__meta-label">Work Setup</div><div class="modal__meta-value">${job.workSetup}</div></div>
      <div class="modal__meta-item"><div class="modal__meta-label">Posted</div><div class="modal__meta-value">${formatDate(job.postedDate)}</div></div>
    </div>
    <div class="modal__section">
      <p class="modal__section-title">Role Overview</p>
      <p class="modal__desc">${job.shortDescription}</p>
    </div>
    <div class="modal__section">
      <p class="modal__section-title">Responsibilities</p>
      <ul class="modal__list">${job.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>
    </div>
    <div class="modal__section">
      <p class="modal__section-title">Qualifications</p>
      <ul class="modal__list">${job.qualifications.map(q => `<li>${q}</li>`).join('')}</ul>
    </div>
    ${job.niceToHave?.length ? `
    <div class="modal__section">
      <p class="modal__section-title">Nice to Have</p>
      <ul class="modal__list">${job.niceToHave.map(n => `<li>${n}</li>`).join('')}</ul>
    </div>` : ''}
    <div class="modal__apply">
      <div class="modal__apply-copy">
        <strong>Ready to apply?</strong>
        <p>Send your CV and a short introduction to our team.</p>
      </div>
      <a href="mailto:${job.applyEmail}?subject=Application: ${encodeURIComponent(job.title)}" class="btn-apply" aria-label="Apply for ${job.title}">
        Apply Now
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>`;

  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.querySelector('.modal__close')?.focus(), 50);
}

function closeModal() {
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lastFocused?.focus();
}

/* ── Filter & Render ─────────────────────────── */
const jobsGrid    = document.getElementById('jobs-grid');
const emptyState  = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const filterDept  = document.getElementById('filter-dept');
const filterSetup = document.getElementById('filter-setup');
const filterType  = document.getElementById('filter-type');
const countEl     = document.getElementById('results-count');

let activeJobs = [];

function render(jobs) {
  jobsGrid.innerHTML = '';
  const none = jobs.length === 0;
  emptyState.classList.toggle('is-visible', none);
  countEl.innerHTML = none ? '<strong>0</strong> roles found'
    : `<strong>${jobs.length}</strong> role${jobs.length !== 1 ? 's' : ''} available`;
  jobs.forEach((job, i) => jobsGrid.appendChild(buildCard(job, i)));
}

function applyFilters() {
  const q = searchInput.value.toLowerCase().trim();
  render(activeJobs.filter(job =>
    (!q || [job.title, job.department, job.shortDescription, job.location].some(s => s.toLowerCase().includes(q))) &&
    (!filterDept.value  || job.department     === filterDept.value) &&
    (!filterSetup.value || job.workSetup       === filterSetup.value) &&
    (!filterType.value  || job.employmentType  === filterType.value)
  ));
}

/* ── Init ────────────────────────────────────── */
(function init() {
  activeJobs = (typeof JOBS !== 'undefined' ? JOBS : []).filter(j => j.active);

  initModal();

  [...new Set(activeJobs.map(j => j.department))].sort().forEach(d => {
    filterDept.insertAdjacentHTML('beforeend', `<option value="${d}">${d}</option>`);
  });

  const statEl = document.getElementById('stat-roles');
  if (statEl) statEl.innerHTML = `${activeJobs.length}<span>+</span>`;

  render(activeJobs);

  [searchInput, filterDept, filterSetup, filterType].forEach(el =>
    el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', applyFilters)
  );

  initNav();
})();
