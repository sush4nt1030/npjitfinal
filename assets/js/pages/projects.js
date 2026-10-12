/* NISC — projects.js : projects showcase with category + technology filters. */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, P = N.plain;
  var items = N.visible(N.projects || []);
  var CATS = ['Web', 'Mobile', 'AI / Data', 'Security', 'Design', 'Tool', 'Other'];
  var catOpts = [{ value: 'all', label: 'All categories', count: items.length }].concat(CATS.map(function (c) {
    return { value: c, label: c, count: items.filter(function (p) { return p.category === c; }).length };
  }).filter(function (o) { return o.count > 0; }));
  var techs = [];
  items.forEach(function (p) { (p.tech || []).forEach(function (t) { t = P(t); if (t && techs.indexOf(t) < 0) techs.push(t); }); });
  techs.sort();
  var techOpts = [{ value: 'all', label: 'Any technology' }].concat(techs.map(function (t) { return { value: t, label: t }; }));
  var techEl = document.getElementById('projects-tech');
  if (techEl && techs.length === 0) techEl.closest('.toolbar__row').hidden = true;

  ui.filterList({
    items: items,
    grid: document.getElementById('projects-grid'),
    count: document.getElementById('projects-count'),
    search: document.getElementById('projects-search'),
    noun: ['project', 'projects'],
    text: function (p) { return [p.title, p.tagline, p.category, p.problem, p.solution, (p.tech || []).join(' '), (p.contributors || []).map(function (c) { return c.name; }).join(' ')].map(P).join(' '); },
    groups: [
      { name: 'cat', el: document.getElementById('projects-cats'), options: catOpts, match: function (p, v) { return p.category === v; } },
      { name: 'tech', el: techEl, options: techOpts, match: function (p, v) { return (p.tech || []).map(P).indexOf(v) > -1; } }
    ],
    render: ui.projectCard,
    empty: function () {
      return ui.empty(items.length ? { icon: 'search', title: 'No projects match', text: 'Try another category or technology.' } :
        { icon: 'rocket', title: 'Be the first project on the showcase', text: 'Built something with other NISC members? Share it so the whole community can learn from it.', actions: [{ label: 'Submit your project', href: 'contact.html?topic=project', primary: true }] });
    }
  });
})();
