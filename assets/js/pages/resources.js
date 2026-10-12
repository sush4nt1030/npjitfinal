/* NISC — resources.js : Learning Hub with categories, difficulty and search. */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, I = N.icon, E = N.esc, U = N.url;
  var items = (N.resources || []).slice();
  var cats = N.resourceCategories || [];

  /* Category tiles act as the category filter */
  var tiles = document.getElementById('res-cats');
  var catOpts = [{ value: 'all', label: 'All topics', icon: 'grid', count: items.length }].concat(cats.map(function (c) {
    return { value: c.id, label: c.name, icon: c.icon, count: items.filter(function (r) { return r.category === c.id; }).length };
  }));

  var paths = document.getElementById('res-paths');
  if (paths) {
    paths.innerHTML = items.filter(function (r) { return r.starter; }).map(function (r) {
      return '<a class="card card--link card--pad" href="' + U('resources/resource.html?id=' + r.id) + '" data-reveal style="text-decoration:none;color:inherit">' +
        '<div class="cluster" style="justify-content:space-between"><span class="icon-tile icon-tile--navy">' + I('route') + '</span><span class="tag">' + (r.steps || []).length + ' steps</span></div>' +
        '<h3 class="card__title">' + E(r.title) + '</h3><p class="card__text">' + E(r.summary) + '</p><span class="link-arrow" style="margin-top:auto">Start the path ' + I('arrow-right') + '</span></a>';
    }).join('');
  }

  var list = ui.filterList({
    items: items,
    grid: document.getElementById('res-grid'),
    count: document.getElementById('res-count'),
    search: document.getElementById('res-search'),
    noun: ['resource', 'resources'],
    text: function (r) { return [r.title, r.source, r.summary, r.type, (r.learn || []).join(' '), ui.category(r.category).name].join(' '); },
    groups: [
      { name: 'cat', el: null, options: catOpts, hash: true, match: function (r, v) { return r.category === v; } },
      { name: 'level', el: document.getElementById('res-level'), options: [{ value: 'all', label: 'All levels' }, { value: '1', label: 'Beginner' }, { value: '2', label: 'Intermediate' }, { value: '3', label: 'Advanced' }], match: function (r, v) { return String(r.level) === v; } }
    ],
    render: ui.resourceCard,
    empty: function () { return ui.empty({ icon: 'search', title: 'No resources match', text: 'Try another topic or level. Know a great resource? <a href="' + U('contact.html?topic=resource') + '">Suggest it</a>.' }); },
    onUpdate: function (l, s) {
      if (!tiles) return;
      N.qsa('.category-tile', tiles).forEach(function (t) { t.setAttribute('aria-pressed', t.getAttribute('data-value') === s.sel.cat ? 'true' : 'false'); });
    }
  });

  if (tiles) {
    tiles.innerHTML = catOpts.map(function (c) {
      return '<button type="button" class="category-tile" data-value="' + c.value + '" aria-pressed="' + (list.state.sel.cat === c.value) + '"><span class="icon-tile">' + I(c.icon) + '</span><strong>' + E(c.label) + '</strong><span>' + c.count + (c.count === 1 ? ' resource' : ' resources') + '</span></button>';
    }).join('');
    tiles.addEventListener('click', function (e) {
      var t = e.target.closest('.category-tile');
      if (!t) return;
      list.set('cat', t.getAttribute('data-value'));
      var grid = document.getElementById('res-results');
      if (grid && grid.getBoundingClientRect().top > innerHeight * 0.6) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
})();
