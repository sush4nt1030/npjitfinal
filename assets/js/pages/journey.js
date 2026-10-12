/* NISC — journey.js : the interactive "Our Journey" timeline. */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, I = N.icon, E = N.esc, F = N.fmt, U = N.url;
  var T = N.timeline;
  var host = document.getElementById('journey');
  var bar = document.getElementById('phase-bar');
  var filterEl = document.getElementById('journey-filter');
  if (!T || !host) return;

  var KIND = { formation: ['Formation', 'flag'], team: ['Team', 'users'], session: ['Session', 'book'], workshop: ['Workshop', 'wrench'], event: ['Event', 'calendar'], launch: ['Launch', 'rocket'], achievement: ['Achievement', 'award'], future: ['Planned', 'sparkles'] };
  var kind = 'all';

  function node(m, n) {
    var k = KIND[m.kind] || ['Milestone', 'flag'];
    var d = N.parseDate(m.date);
    var ev = m.event && N.events ? ui.byId(N.events, m.event) : null;
    var thumbs = (m.photos || []).slice(0, 3).map(function (p) { return '<img src="' + U(p) + '" alt="" loading="lazy">'; }).join('');
    return '<div class="jnode' + (n % 2 ? ' jnode--alt' : '') + (m.future ? ' jnode--future' : '') + '" data-kind="' + E(m.kind) + '">' +
      '<span class="jnode__dot" aria-hidden="true"></span>' +
      '<article class="card card--link jnode__card" data-reveal><div class="card__body">' +
        '<p class="jnode__date">' + I('calendar') + (d ? N.fmtDateLong(d) : F(m.dateText)) + '</p>' +
        '<div class="cluster cluster--sm"><span class="tag tag--accent">' + I(k[1]) + k[0] + '</span>' + (m.future ? '<span class="pill pill--upcoming">What’s next</span>' : '') + '</div>' +
        '<h3 class="card__title"><a class="card__link" href="' + U('discover/milestone.html?id=' + m.id) + '">' + F(m.title) + '</a></h3>' +
        '<p class="card__text">' + F(m.summary) + '</p>' +
        (thumbs ? '<div class="card__photos">' + thumbs + '</div>' : '') +
        (ev ? '<p class="muted" style="font-size:.88rem">' + I('link') + ' Related event: ' + E(N.eventName(ev)) + '</p>' : '') +
      '</div><div class="card__foot"><span>Read the story</span>' + I('arrow-right', 'i--arrow') + '</div></article></div>';
  }

  function render() {
    var n = 0;
    var out = '<div class="journey__line" aria-hidden="true"><div class="journey__progress"></div></div>';
    T.phases.forEach(function (p, i) {
      var items = T.milestones.filter(function (m) { return m.phase === p.id && (kind === 'all' || m.kind === kind); });
      if (!items.length && kind !== 'all') return;
      out += '<div class="journey__phase" id="phase-' + p.id + '" data-phase-index="' + i + '"><div class="journey__phase-label"><span class="eyebrow eyebrow--plain">Chapter ' + (i + 1) + ' of ' + T.phases.length + '</span><strong>' + E(p.label) + '</strong><span>' + E(p.blurb) + '</span></div></div>';
      out += items.map(function (m) { return node(m, n++); }).join('');
    });
    host.innerHTML = out;
    N.enhance(host);
    observePhases();
    progress();
  }

  /* Phase bar */
  if (bar) {
    bar.innerHTML = '<div class="container"><ol role="list"><span class="phase-bar__fill" aria-hidden="true"></span>' + T.phases.map(function (p, i) {
      return '<li><button type="button" data-goto="' + p.id + '" aria-label="Go to chapter ' + (i + 1) + ': ' + E(p.label) + '">' + E(p.label) + '</button></li>';
    }).join('') + '</ol></div>';
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-goto]');
      if (!b) return;
      var t = document.getElementById('phase-' + b.getAttribute('data-goto'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  function setPhase(i) {
    if (!bar) return;
    N.qsa('button', bar).forEach(function (b, j) {
      b.classList.toggle('is-active', j === i);
      b.classList.toggle('is-past', j < i);
      if (j === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    var ol = N.qs('ol', bar);
    ol.style.setProperty('--phase-progress', T.phases.length > 1 ? i / (T.phases.length - 1) : 1);
  }
  var phaseIO = null;
  function observePhases() {
    if (phaseIO) phaseIO.disconnect();
    if (!('IntersectionObserver' in window)) return;
    phaseIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setPhase(+en.target.getAttribute('data-phase-index')); });
    }, { rootMargin: '-35% 0px -60% 0px' });
    N.qsa('.journey__phase', host).forEach(function (p) { phaseIO.observe(p); });
  }
  setPhase(0);

  /* Line progress */
  var ticking = false;
  function progress() {
    ticking = false;
    var line = N.qs('.journey__line', host);
    if (!line) return;
    var r = host.getBoundingClientRect();
    var p = (innerHeight * 0.55 - r.top) / r.height;
    line.style.setProperty('--journey-progress', Math.max(0, Math.min(1, p)).toFixed(3));
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(progress); } }, { passive: true });

  /* Kind filter */
  if (filterEl) {
    var kinds = [];
    T.milestones.forEach(function (m) { if (kinds.indexOf(m.kind) < 0) kinds.push(m.kind); });
    ui.chips(filterEl, [{ value: 'all', label: 'All milestones', count: T.milestones.length }].concat(kinds.map(function (k) {
      return { value: k, label: (KIND[k] || [k])[0], icon: (KIND[k] || [0, 'flag'])[1], count: T.milestones.filter(function (m) { return m.kind === k; }).length };
    })), 'all');
    filterEl.addEventListener('click', function (e) {
      var c = e.target.closest('.chip');
      if (!c) return;
      kind = c.getAttribute('data-value');
      N.qsa('.chip', filterEl).forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
      render();
      N.qsa('[data-reveal]', host).forEach(function (el) { el.classList.add('is-in'); });
    });
  }

  /* Counts in the hero */
  var cnt = document.querySelector('[data-journey-count]');
  if (cnt) cnt.textContent = T.milestones.filter(function (m) { return !m.future; }).length;

  render();
})();
