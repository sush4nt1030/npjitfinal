/* NISC — search.js : full search results page (search.html?q=…). */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, I = N.icon, E = N.esc;
  var input = document.getElementById('search-page-input');
  var out = document.getElementById('search-results');
  var chips = document.getElementById('search-types');
  var countEl = document.getElementById('search-count');
  var type = 'all';
  var index = [];
  input.value = N.param('q') || '';

  function run() {
    var q = input.value.trim();
    if (history.replaceState) history.replaceState(null, '', location.pathname + (q ? '?q=' + encodeURIComponent(q) : ''));
    if (!q) {
      chips.innerHTML = '';
      countEl.textContent = '';
      out.innerHTML = ui.empty({ icon: 'search', title: 'Search everything NISC', text: 'Events, projects, opportunities, learning resources, updates, stories and team members.' });
      return;
    }
    var res = N.search(q, index);
    var counts = {};
    res.forEach(function (r) { counts[r.type] = (counts[r.type] || 0) + 1; });
    if (type !== 'all' && !counts[type]) type = 'all';
    ui.chips(chips, [{ value: 'all', label: 'All results', count: res.length }].concat(Object.keys(N.SEARCH_TYPES).filter(function (t) { return counts[t]; }).map(function (t) {
      return { value: t, label: N.SEARCH_TYPES[t].label, icon: N.SEARCH_TYPES[t].icon, count: counts[t] };
    })), type);
    var list = type === 'all' ? res : res.filter(function (r) { return r.type === type; });
    countEl.textContent = list.length + (list.length === 1 ? ' result' : ' results') + ' for “' + q + '”';
    out.innerHTML = list.length ? list.map(function (r) {
      var T = N.SEARCH_TYPES[r.type];
      return '<article class="result-card"><span class="sr-item__icon">' + I(T.icon) + '</span><div><p class="card__kicker">' + T.label + '</p><h3><a class="card__link" href="' + N.url(r.url) + '">' + N.highlight(r.title, q) + '</a></h3><p>' + E(r.sub) + '</p></div></article>';
    }).join('') : ui.empty({ icon: 'search', title: 'No results for “' + q + '”', text: 'Check the spelling or try a broader word, like “events”, “web” or “join”.', actions: [{ label: 'Browse events', href: 'events/index.html' }, { label: 'Learning Hub', href: 'resources/index.html' }] });
  }
  chips.addEventListener('click', function (e) {
    var c = e.target.closest('.chip');
    if (c) { type = c.getAttribute('data-value'); run(); }
  });
  document.getElementById('search-page-form').addEventListener('submit', function (e) { e.preventDefault(); run(); });
  input.addEventListener('input', N.debounce(run, 160));
  N.getIndex().then(function (idx) { index = idx; run(); });
})();
