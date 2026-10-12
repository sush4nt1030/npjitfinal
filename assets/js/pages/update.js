/* NISC — update.js : single announcement (updates/update.html?id=…). */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, I = N.icon, E = N.esc, F = N.fmt, V = N.val, P = N.plain, U = N.url;
  var root = document.getElementById('update-root');
  var list = N.updates || [];
  var idx = -1, id = N.param('id');
  list.forEach(function (u, i) { if (u.id === id) idx = i; });
  var u = list[idx];
  if (!u) {
    ui.notFound(root, { title: 'Update not found', backHref: 'updates/index.html', backLabel: 'All updates' });
    return;
  }
  var title = P(u.title);
  N.setTitle(title, P(u.excerpt));
  var newer = list[idx - 1], older = list[idx + 1];

  var html = '<section class="page-hero"><div class="container container--narrow"><div class="page-hero__inner">' +
    '<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="' + U('index.html') + '">Home</a></li><li><a href="' + U('updates/index.html') + '">NISC Updates</a></li><li aria-current="page">' + E(title) + '</li></ol></nav>' +
    '<span class="tag tag--accent" style="align-self:flex-start">' + E(u.category) + '</span>' +
    '<h1 class="page-hero__title">' + F(u.title) + '</h1>' +
    '<div class="article-meta"><span>' + I('calendar') + ' ' + ui.updateDate(u) + '</span><span>' + I('user') + ' ' + F(u.author || 'NISC Team') + '</span>' +
    '<button class="btn btn--ghost btn--sm" type="button" data-share>' + I('share') + 'Share</button></div></div></div></section>';

  html += '<section class="section section--tight"><div class="container container--narrow"><article class="prose" style="max-width:none">' +
    (u.live ? '' : '<p class="lead" style="color:var(--ink)">' + F(u.excerpt) + '</p>') + ui.paragraphs(u.body) + '</article>' +
    ((u.links || []).length ? '<div class="cluster mt-lg">' + u.links.map(function (l, i) { return '<a class="btn ' + (i ? 'btn--secondary' : 'btn--primary') + '" href="' + U(l.href) + '">' + E(l.label) + ' ' + I('arrow-right', 'i--arrow') + '</a>'; }).join('') + '</div>' : '') +
    '<nav class="pager" aria-label="More updates">' +
      (older ? '<a class="pager__link pager__link--prev" href="' + U('updates/update.html?id=' + older.id) + '"><span class="pager__label">' + I('arrow-left') + 'Older</span><span class="pager__title">' + F(older.title) + '</span></a>' : '') +
      (newer ? '<a class="pager__link pager__link--next" href="' + U('updates/update.html?id=' + newer.id) + '"><span class="pager__label">Newer' + I('arrow-right') + '</span><span class="pager__title">' + F(newer.title) + '</span></a>' : '') +
    '</nav></div></section>';
  root.innerHTML = html;
  N.enhance(root);
})();
