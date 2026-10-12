/* NISC — milestone.js : detail page for a journey milestone (discover/milestone.html?id=…). */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, I = N.icon, E = N.esc, F = N.fmt, P = N.plain, U = N.url;
  var root = document.getElementById('milestone-root');
  var T = N.timeline;
  var list = T ? T.milestones : [];
  var idx = -1;
  var id = N.param('id');
  list.forEach(function (m, i) { if (m.id === id) idx = i; });
  var m = list[idx];
  if (!m) {
    ui.notFound(root, { title: 'Milestone not found', text: 'This part of the journey may have moved.', backHref: 'discover/our-journey.html', backLabel: 'Back to Our Journey' });
    return;
  }
  var phase = ui.byId(T.phases, m.phase) || { label: '' };
  var phaseIdx = T.phases.indexOf(phase);
  var title = P(m.title) || 'Upcoming milestone';
  N.setTitle(title, P(m.summary));
  var d = N.parseDate(m.date);
  var dateHtml = d ? N.fmtDateLong(d) : F(m.dateText);
  var ev = m.event && N.events ? ui.byId(N.events, m.event) : null;
  var photos = (m.photos || []).map(function (src, i) { return { src: U(src), alt: title + ' photo ' + (i + 1), title: title, meta: [dateHtml] }; });

  var html = '<section class="page-hero"><div class="container"><div class="page-hero__inner">' +
    '<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="' + U('index.html') + '">Home</a></li><li><a href="' + U('discover/index.html') + '">Discover</a></li><li><a href="' + U('discover/our-journey.html') + '">Our Journey</a></li><li aria-current="page">' + E(title) + '</li></ol></nav>' +
    '<span class="eyebrow">Chapter ' + (phaseIdx + 1) + ' · ' + E(phase.label) + '</span>' +
    '<h1 class="page-hero__title">' + F(m.title) + '</h1>' +
    '<p class="page-hero__lead">' + F(m.summary) + '</p>' +
    '<div class="page-hero__meta"><span>' + I('calendar') + dateHtml + '</span>' + (m.future ? '<span>' + I('sparkles') + 'Planned milestone</span>' : '') + (ev ? '<span>' + I('link') + '<a href="' + N.eventUrl(ev) + '">' + E(N.eventName(ev)) + '</a></span>' : '') + '</div>' +
    '</div></div></section>';

  var main = '<section class="detail-section"><h2>' + I('book') + 'The story</h2><div class="prose">' + ui.paragraphs(m.story) + '</div></section>';
  if ((m.people || []).length) main += '<section class="detail-section"><h2>' + I('users') + 'People involved</h2>' +
    '<ul class="people-list" role="list">' + m.people.map(function (p) { return '<li>' + ui.avatar(p) + F(p) + '</li>'; }).join('') + '</ul></section>';
  if (photos.length || !m.future) main += '<section class="detail-section"><h2>' + I('camera') + 'Pictures</h2>' +
    (photos.length ? '<div class="photo-grid">' + photos.map(function (p, i) { return '<button type="button" data-photo="' + i + '" aria-label="Open photo ' + (i + 1) + '"><img src="' + p.src + '" alt="' + E(p.alt) + '" loading="lazy"></button>'; }).join('') + '</div>'
      : ui.empty({ icon: 'camera', title: 'No photographs yet', text: 'Have a photo from this moment? Help us document it.', actions: [{ label: 'Share a photo', href: 'contact.html?topic=archive' }] })) + '</section>';
  if (ev) main += '<section class="detail-section"><h2>' + I('calendar') + 'Related event</h2><div class="grid grid--2">' + ui.eventCard(ev) + '</div></section>';
  if ((m.outcomes || []).length) main += '<section class="detail-section"><h2>' + I('check-circle') + 'Outcomes</h2>' + ui.list(m.outcomes) + '</section>';
  if ((m.links || []).length) {
    main += '<section class="detail-section"><h2>' + I('link') + 'Links</h2><div class="cluster">' + m.links.map(function (l) { return '<a class="btn btn--secondary" href="' + U(l.href) + '">' + E(l.label) + ' ' + I('arrow-right', 'i--arrow') + '</a>'; }).join('') + '</div></section>';
  }

  var prev = list[idx - 1], next = list[idx + 1];
  var aside = '<div class="side-card"><h2>Milestone facts</h2><dl class="dl-grid"><dt>Chapter</dt><dd>' + E(phase.label) + '</dd><dt>Date</dt><dd>' + dateHtml + '</dd><dt>Type</dt><dd>' + E(({ formation: 'Formation', team: 'Team', session: 'Session', workshop: 'Workshop', event: 'Event', launch: 'Launch', achievement: 'Achievement', future: 'Planned' })[m.kind] || m.kind) + '</dd>' +
    (ev ? '<dt>Event</dt><dd><a href="' + N.eventUrl(ev) + '">' + E(N.eventName(ev)) + '</a></dd>' : '') + '</dl>' +
    '<a class="btn btn--secondary btn--block" href="' + U('discover/our-journey.html') + '">' + I('route') + 'Back to the journey</a></div>' +
    '<div class="side-card side-card--plain"><h3>Help us keep the archive accurate</h3><p class="text-2" style="font-size:.93rem">Have photos, dates or details about this milestone? Send them to the team.</p><a class="link-arrow" href="' + U('contact.html?topic=archive') + '">Contribute to the archive ' + I('arrow-right') + '</a></div>';

  html += '<section class="section section--tight"><div class="container split"><div>' + main +
    '<nav class="pager" aria-label="Milestones">' +
      (prev ? '<a class="pager__link pager__link--prev" href="' + U('discover/milestone.html?id=' + prev.id) + '"><span class="pager__label">' + I('arrow-left') + 'Previous milestone</span><span class="pager__title">' + F(prev.title) + '</span></a>' : '') +
      (next ? '<a class="pager__link pager__link--next" href="' + U('discover/milestone.html?id=' + next.id) + '"><span class="pager__label">Next milestone' + I('arrow-right') + '</span><span class="pager__title">' + F(next.title) + '</span></a>' : '') +
    '</nav></div><aside class="sticky-aside" aria-label="Milestone summary">' + aside + '</aside></div></section>';

  root.innerHTML = html;
  N.enhance(root);
  N.qsa('[data-photo]', root).forEach(function (b) {
    b.addEventListener('click', function () { N.lightbox.open(photos, +b.getAttribute('data-photo')); });
  });
})();
