/* NISC — story.js : a single student story (community/story.html?id=…). */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, I = N.icon, E = N.esc, F = N.fmt, P = N.plain, U = N.url;
  var root = document.getElementById('story-root');
  var list = N.visible(N.stories || []);
  var s = ui.byId(list, N.param('id'));
  if (!s) {
    ui.notFound(root, { title: 'Story not found', backHref: 'community/stories.html', backLabel: 'All stories' });
    return;
  }
  var title = P(s.title) || 'Student story';
  N.setTitle(title, P(s.quote));
  var ev = s.event && N.events ? ui.byId(N.events, s.event) : null;

  var html = '<section class="page-hero"><div class="container container--narrow"><div class="page-hero__inner">' +
    '<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="' + U('index.html') + '">Home</a></li><li><a href="' + U('community/index.html') + '">Community</a></li><li><a href="' + U('community/stories.html') + '">Stories</a></li><li aria-current="page">' + E(title) + '</li></ol></nav>' +
    '<div class="cluster cluster--sm"><span class="tag tag--accent">' + E(s.theme) + '</span>' + (s.template ? ui.templatePill : '') + '</div>' +
    '<h1 class="page-hero__title">' + F(s.title) + '</h1>' +
    '<div class="cluster">' + ui.avatar(s.name, s.photo, 'avatar--lg') + '<div><strong>' + F(s.name) + '</strong><p class="muted">' + F(s.detail) + '</p></div></div>' +
    '</div></div></section>';

  html += '<section class="section section--tight"><div class="container container--narrow">' +
    '<blockquote class="pull-quote">' + F(s.quote) + '</blockquote>' +
    '<div class="prose mt-lg" style="max-width:none">' + ui.paragraphs(s.body) + '</div>' +
    (ev ? '<div class="mt-lg"><p class="eyebrow" style="margin-bottom:14px">Related event</p><div class="grid grid--2">' + ui.eventCard(ev) + '</div></div>' : '') +
    '<div class="cta-band mt-xl"><div class="cta-band__inner"><div><span class="eyebrow">Your turn</span><h2>Have a NISC story to share?</h2><p>Tell us what you learned, built or discovered. We publish stories with your permission.</p></div><div class="cta-band__actions"><a class="btn btn--light btn--lg" href="' + U('contact.html?topic=story') + '">Share your story</a></div></div></div>' +
    '</div></section>';
  root.innerHTML = html;
  N.enhance(root);
})();
