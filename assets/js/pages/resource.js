/* NISC — resource.js : Learning Hub resource / starter path detail. */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, I = N.icon, E = N.esc, U = N.url;
  var root = document.getElementById('resource-root');
  var all = N.resources || [];
  var r = ui.byId(all, N.param('id'));
  if (!r) {
    ui.notFound(root, { title: 'Resource not found', backHref: 'resources/index.html', backLabel: 'Learning Hub' });
    return;
  }
  var c = ui.category(r.category);
  N.setTitle(r.title, r.summary);
  var open = r.url ? '<a class="btn btn--primary btn--lg" href="' + E(r.url) + '">Open resource ' + I('external') + '</a>' : '';

  var html = '<section class="page-hero"><div class="container"><div class="page-hero__inner">' +
    '<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="' + U('index.html') + '">Home</a></li><li><a href="' + U('resources/index.html') + '">Learning Hub</a></li><li><a href="' + U('resources/index.html#' + c.id) + '">' + E(c.name) + '</a></li><li aria-current="page">' + E(r.title) + '</li></ol></nav>' +
    '<div class="cluster cluster--sm"><span class="tag tag--accent">' + I(c.icon) + E(c.name) + '</span><span class="tag">' + E(r.type) + '</span>' + ui.difficulty(r.level) + '</div>' +
    '<h1 class="page-hero__title">' + E(r.title) + '</h1><p class="page-hero__lead">' + E(r.summary) + '</p>' +
    '<div class="page-hero__meta"><span>' + I('user') + E(r.source) + '</span><span>' + I('ticket') + E(r.cost) + '</span></div>' +
    (open ? '<div class="page-hero__actions">' + open + '</div>' : '') + '</div></div></section>';

  var main = '';
  if (r.starter) {
    main += '<section class="detail-section"><h2>' + I('route') + 'The path</h2><ol class="roadmap">' + (r.steps || []).map(function (s) {
      var res = (s.resources || []).map(function (id) { var x = ui.byId(all, id); return x ? '<a class="tag tag--accent" href="' + U('resources/resource.html?id=' + x.id) + '">' + E(x.title) + '</a>' : ''; }).join('');
      return '<li><div><h3>' + E(s.title) + '</h3><p>' + E(s.text) + '</p>' + (res ? '<div class="cluster cluster--sm">' + res + '</div>' : '') + '</div></li>';
    }).join('') + '</ol></section>';
  }
  main += '<section class="detail-section"><h2>' + I('book') + 'What you’ll learn</h2>' + ui.list(r.learn, 'check') + '</section>';
  main += '<section class="detail-section"><h2>' + I('users') + 'Best for</h2><div class="prose"><p>' + E(r.bestFor) + '</p></div></section>';
  main += '<section class="detail-section"><div class="notice">' + I('lightbulb') + '<div><strong>NISC tip</strong><p>' + E(r.tip) + '</p></div></div></section>';

  var aside = '<div class="side-card"><h2>Resource details</h2><dl class="dl-grid"><dt>Topic</dt><dd>' + E(c.name) + '</dd><dt>Type</dt><dd>' + E(r.type) + '</dd><dt>Level</dt><dd>' + ui.difficulty(r.level) + '</dd><dt>Source</dt><dd>' + E(r.source) + '</dd><dt>Cost</dt><dd>' + E(r.cost) + '</dd></dl>' +
    (open ? open.replace('btn--lg', 'btn--block') : '') + '</div>' +
    '<div class="side-card side-card--plain"><h3>Learn with others</h3><p class="text-2" style="font-size:.93rem">Studying this? Find a study partner in the NISC community.</p><a class="link-arrow" href="' + U('join.html') + '">Join NISC ' + I('arrow-right') + '</a></div>';

  var related = all.filter(function (x) { return x.category === r.category && x.id !== r.id; }).slice(0, 3);
  html += '<section class="section section--tight"><div class="container split"><div>' + main + '</div><aside class="sticky-aside" aria-label="Resource summary">' + aside + '</aside></div></section>';
  if (related.length) html += '<section class="section section--alt section--grid"><div class="container"><div class="section-head"><div class="section-head__text"><span class="eyebrow">' + E(c.name) + '</span><h2>More in this topic</h2></div><a class="btn btn--secondary" href="' + U('resources/index.html#' + c.id) + '">See all ' + I('arrow-right', 'i--arrow') + '</a></div><div class="grid grid--3">' + related.map(ui.resourceCard).join('') + '</div></div></section>';
  root.innerHTML = html;
  N.enhance(root);
})();
