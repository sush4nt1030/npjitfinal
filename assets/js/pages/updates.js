/* NISC — updates.js : NISC Updates (announcements) listing. */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, I = N.icon, E = N.esc, F = N.fmt, U = N.url;
  var items = (N.updates || []).slice();
  var featured = items.filter(function (u) { return u.featured; })[0];
  var fe = document.getElementById('updates-featured');
  if (fe && featured) {
    fe.innerHTML = '<article class="update-feature" data-reveal><div><span class="eyebrow">Featured · ' + E(featured.category) + '</span>' +
      '<h2><a href="' + U('updates/update.html?id=' + featured.id) + '">' + F(featured.title) + '</a></h2><p>' + F(featured.excerpt) + '</p>' +
      '<p class="mono" style="font-size:.8rem;margin-top:14px;color:var(--band-ink-2)">' + ui.updateDate(featured) + '</p></div>' +
      '<a class="btn btn--light" href="' + U('updates/update.html?id=' + featured.id) + '">Read update ' + I('arrow-right', 'i--arrow') + '</a></article>';
  }
  var CATS = ['Announcement', 'Registration', 'Event update', 'Team', 'Opportunity', 'Community'];
  ui.filterList({
    items: items,
    grid: document.getElementById('updates-list'),
    count: document.getElementById('updates-count'),
    search: document.getElementById('updates-search'),
    noun: ['update', 'updates'],
    text: function (u) { return [u.title, u.excerpt, u.category, (u.body || []).join(' ')].map(N.plain).join(' '); },
    groups: [{ name: 'cat', el: document.getElementById('updates-cats'), options: [{ value: 'all', label: 'All updates', count: items.length }].concat(CATS.map(function (c) {
      return { value: c, label: c, count: items.filter(function (u) { return u.category === c; }).length };
    }).filter(function (o) { return o.count; })), match: function (u, v) { return u.category === v; } }],
    render: ui.updateRow,
    empty: function () { return ui.empty({ icon: 'megaphone', title: 'No updates in this category yet' }); }
  });
})();
