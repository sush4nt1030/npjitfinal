/* NISC — community.js : community directory, pulse feed and highlights. */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, I = N.icon, E = N.esc, F = N.fmt, P = N.plain, U = N.url;

  function n(x) { return x == null ? '' : x; }
  var counts = {
    team: (N.team && N.team.current || []).length,
    projects: N.visible(N.projects || []).filter(function (p) { return !p.template; }).length,
    stories: N.visible(N.stories || []).filter(function (s) { return !s.template; }).length,
    updates: (N.updates || []).length,
    events: N.visible(N.events || []).filter(function (e) { return !e.template; }).length,
    photos: (N.gallery && N.gallery.photos || []).filter(function (p) { return !p.placeholder; }).length
  };
  N.qsa('[data-community-count]').forEach(function (el) {
    var k = el.getAttribute('data-community-count');
    var v = counts[k];
    el.textContent = v ? v + ' ' + (el.getAttribute('data-noun') || '') : (el.getAttribute('data-empty') || 'Growing');
  });

  /* Community pulse: latest across the site */
  var feed = document.getElementById('community-feed');
  if (feed) {
    var items = [];
    (N.updates || []).slice(0, 3).forEach(function (u) { items.push({ icon: 'megaphone', type: u.category, title: P(u.title), href: U('updates/update.html?id=' + u.id), text: P(u.excerpt) }); });
    N.visible(N.events || []).filter(function (e) { return !e.template; }).slice(0, 2).forEach(function (e) { items.push({ icon: 'calendar', type: 'Event · ' + N.STATUS_LABELS[N.eventStatus(e)], title: N.eventName(e), href: N.eventUrl(e), text: P(e.summary) }); });
    if (N.timeline) N.timeline.milestones.filter(function (m) { return !m.future; }).slice(-2).forEach(function (m) { items.push({ icon: 'route', type: 'Milestone', title: P(m.title), href: U('discover/milestone.html?id=' + m.id), text: P(m.summary) }); });
    feed.innerHTML = items.map(function (it) {
      return '<li data-reveal><span class="feed__icon">' + I(it.icon) + '</span><div><p class="feed__type">' + E(it.type) + '</p><a href="' + it.href + '">' + E(it.title) + '</a><p>' + E(it.text) + '</p></div></li>';
    }).join('');
  }

  /* Highlights: photos preview */
  var hl = document.getElementById('community-photos');
  if (hl && N.gallery) {
    hl.innerHTML = N.gallery.photos.slice(0, 4).map(function (p) {
      return '<a href="' + U('gallery/index.html#' + p.album) + '" style="display:block;border-radius:var(--radius-md);overflow:hidden;aspect-ratio:4/3"><img src="' + U(p.src) + '" alt="' + E(P(p.alt)) + '" loading="lazy" style="width:100%;height:100%;object-fit:cover"></a>';
    }).join('');
  }
  var stories = document.getElementById('community-stories');
  if (stories) {
    var list = N.visible(N.stories || []).slice(0, 2);
    stories.innerHTML = list.length ? list.map(ui.storyCard).join('') : ui.empty({ icon: 'quote', title: 'Member stories are coming', actions: [{ label: 'Share yours', href: 'contact.html?topic=story', primary: true }] });
  }
  N.enhance(document);
})();
