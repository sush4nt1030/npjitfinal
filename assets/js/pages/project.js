/* NISC — project.js : project detail (projects/project.html?id=…). */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, I = N.icon, E = N.esc, F = N.fmt, V = N.val, P = N.plain, U = N.url;
  var root = document.getElementById('project-root');
  var p = ui.byId(N.visible(N.projects || []), N.param('id'));
  if (!p) {
    ui.notFound(root, { title: 'Project not found', backHref: 'projects/index.html', backLabel: 'All projects' });
    return;
  }
  var title = P(p.title) || 'Project';
  N.setTitle(title, P(p.tagline));
  var shots = (p.screenshots || []).map(function (s, i) { return { src: U(s), alt: title + ' screenshot ' + (i + 1), title: title }; });
  var links = (p.github ? '<a class="btn btn--primary" href="' + E(p.github) + '">' + I('github') + 'GitHub repository</a>' : '') +
    (p.demo ? '<a class="btn btn--secondary" href="' + E(p.demo) + '">' + I('external') + 'Live demo</a>' : '');
  var ev = p.event && N.events ? ui.byId(N.events, p.event) : null;

  var html = '<section class="page-hero"><div class="container"><div class="page-hero__inner">' +
    '<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="' + U('index.html') + '">Home</a></li><li><a href="' + U('projects/index.html') + '">Projects</a></li><li aria-current="page">' + E(title) + '</li></ol></nav>' +
    '<div class="cluster cluster--sm">' + ui.projectStatus(p.status) + '<span class="tag tag--accent">' + E(p.category) + '</span>' + (p.template ? ui.templatePill : '') + '</div>' +
    '<h1 class="page-hero__title">' + F(p.title) + '</h1><p class="page-hero__lead">' + F(p.tagline) + '</p>' +
    (links ? '<div class="page-hero__actions">' + links + '</div>' : '') + '</div></div></section>';

  var main = '<section class="detail-section"><h2>' + I('image') + 'Screenshots</h2>' +
    (shots.length ? '<div class="shot-grid">' + shots.map(function (s, i) { return '<button type="button" data-shot="' + i + '" aria-label="Open screenshot ' + (i + 1) + '"><img src="' + s.src + '" alt="' + E(s.alt) + '" loading="lazy"></button>'; }).join('') + '</div>'
      : '<div class="card__media" style="border-radius:var(--radius-lg)">' + ui.cover('project', p.category || 'Project', title, true) + '</div>') + '</section>';
  if (p.problem) main += '<section class="detail-section"><h2>' + I('alert') + 'The problem</h2><div class="prose"><p>' + F(p.problem) + '</p></div></section>';
  if (p.solution) main += '<section class="detail-section"><h2>' + I('lightbulb') + 'The solution</h2><div class="prose"><p>' + F(p.solution) + '</p></div></section>';
  if ((p.features || []).length) main += '<section class="detail-section"><h2>' + I('layers') + 'What it does</h2>' + ui.list(p.features, 'check') + '</section>';
  if ((p.learned || []).length) main += '<section class="detail-section"><h2>' + I('sprout') + 'What the team learned</h2>' + ui.list(p.learned, 'check-circle') + '</section>';

  var aside = '<div class="side-card"><h2>Project facts</h2><dl class="dl-grid"><dt>Status</dt><dd>' + E((ui.PROJECT_STATUS[p.status] || [p.status])[0]) + '</dd><dt>Category</dt><dd>' + E(p.category) + '</dd><dt>Started</dt><dd>' + V(p.startedText, 'N/A') + '</dd>' +
    (ev ? '<dt>Started at</dt><dd><a href="' + N.eventUrl(ev) + '">' + E(N.eventName(ev)) + '</a></dd>' : '') + '</dl>' +
    (ui.tags(p.tech, 'tag--accent') ? '<div><h3 style="font-size:.95rem;margin-bottom:10px">Technologies</h3>' + ui.tags(p.tech, 'tag--accent') + '</div>' : '') +
    '<div><h3 style="font-size:.95rem;margin-bottom:10px">Contributors</h3><ul class="people-list" role="list">' + (p.contributors || []).map(function (c) {
      var inner = ui.avatar(c.name) + F(c.name);
      return '<li>' + (c.member ? '<a href="' + U('team/member.html?id=' + c.member) + '">' + inner + '</a>' : inner) + '</li>';
    }).join('') + '</ul></div>' + (links ? '<div class="stack stack--sm">' + links.replace(/btn--primary|btn--secondary/g, 'btn--secondary btn--block') + '</div>' : '') + '</div>';

  html += '<section class="section section--tight"><div class="container split"><div>' + main + '</div><aside class="sticky-aside" aria-label="Project summary">' + aside + '</aside></div></section>';
  html += '<section class="section section--alt"><div class="container"><div class="cta-band"><div class="cta-band__inner"><div><span class="eyebrow">Showcase</span><h2>Built something with NISC?</h2><p>Share your project so other students can learn from your work.</p></div><div class="cta-band__actions"><a class="btn btn--light btn--lg" href="' + U('contact.html?topic=project') + '">Submit a project</a><a class="btn btn--outline-light btn--lg" href="' + U('projects/index.html') + '">All projects</a></div></div></div></div></section>';
  root.innerHTML = html;
  N.enhance(root);
  N.qsa('[data-shot]', root).forEach(function (b) { b.addEventListener('click', function () { N.lightbox.open(shots, +b.getAttribute('data-shot')); }); });
})();
