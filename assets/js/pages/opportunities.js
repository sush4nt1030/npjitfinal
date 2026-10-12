/* NISC — opportunities.js : verified opportunities hub with type filters. */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, P = N.plain;
  var items = N.visible(N.opportunities || []);
  var MAIN = ['internship', 'job', 'hackathon', 'scholarship', 'competition', 'workshop', 'volunteer'];
  function typeOf(o) { return MAIN.indexOf(o.type) > -1 ? o.type : 'other'; }
  var opts = [{ value: 'all', label: 'All', count: items.length }].concat(MAIN.concat(['other']).map(function (t) {
    var d = ui.OPP_TYPES[t];
    return { value: t, label: d[0], icon: d[1], count: items.filter(function (o) { return typeOf(o) === t; }).length };
  }));
  var showClosed = document.getElementById('opps-closed');
  var list = ui.filterList({
    items: items,
    grid: document.getElementById('opps-grid'),
    count: document.getElementById('opps-count'),
    search: document.getElementById('opps-search'),
    noun: ['opportunity', 'opportunities'],
    text: function (o) { return [o.title, o.organization, o.description, o.location, o.type, (o.eligibility || []).join(' ')].map(P).join(' '); },
    groups: [
      { name: 'type', el: document.getElementById('opps-types'), options: opts, hash: true, match: function (o, v) { return typeOf(o) === v; } },
      { name: 'closed', options: [{ value: 'all' }, { value: 'hide' }], initial: 'hide', match: function (o) { return ui.deadline(o).state !== 'closed'; } }
    ],
    sort: function (a, b) {
      var da = ui.deadline(a), db = ui.deadline(b);
      if ((da.state === 'closed') !== (db.state === 'closed')) return da.state === 'closed' ? 1 : -1;
      return (a.deadline || '9999') < (b.deadline || '9999') ? -1 : 1;
    },
    render: ui.oppCard,
    empty: function () {
      return ui.empty(items.length ? { icon: 'search', title: 'No opportunities match', text: 'Try another type, or include closed opportunities.' } :
        { icon: 'briefcase', title: 'No verified opportunities right now', text: 'We only publish opportunities we have checked. Know of one? Send it to us.', actions: [{ label: 'Share an opportunity', href: 'contact.html?topic=opportunity', primary: true }] });
    }
  });
  if (showClosed) showClosed.addEventListener('change', function () { list.set('closed', showClosed.checked ? 'all' : 'hide'); });
})();
