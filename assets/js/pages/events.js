/* NISC — events.js : event discovery (featured, status tabs, type filters, search). */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui;
  var events = N.visible(N.events || []);
  var RANK = { ongoing: 0, upcoming: 1, completed: 2 };
  function time(e) { var d = N.parseDate(e.start); return d ? d.getTime() : null; }

  /* Featured: the next upcoming/ongoing event, otherwise the latest completed one */
  var feat = document.getElementById('events-featured');
  if (feat) {
    var live = events.filter(function (e) { return N.eventStatus(e) !== 'completed' && !e.cancelled; })
      .sort(function (a, b) { return (time(a) || Infinity) - (time(b) || Infinity); });
    var pick = live[0] || events.filter(function (e) { return N.eventStatus(e) === 'completed'; })[0];
    feat.innerHTML = pick ? ui.featureEvent(pick, live[0] ? (N.eventStatus(pick) === 'ongoing' ? 'Happening now' : 'Next up') : 'Latest in the archive') : '';
  }

  function count(fn) { return events.filter(fn).length; }
  var statusOpts = [
    { value: 'all', label: 'All events', count: events.length },
    { value: 'upcoming', label: 'Upcoming', count: count(function (e) { return N.eventStatus(e) === 'upcoming'; }) },
    { value: 'ongoing', label: 'Ongoing', count: count(function (e) { return N.eventStatus(e) === 'ongoing'; }) },
    { value: 'completed', label: 'Completed', count: count(function (e) { return N.eventStatus(e) === 'completed'; }) }
  ];
  var typeOpts = [{ value: 'all', label: 'All types' }].concat(
    [['session', 'Sessions', 'book'], ['workshop', 'Workshops', 'wrench'], ['meetup', 'Meetups', 'coffee'], ['competition', 'Competitions', 'trophy'], ['community', 'Community activities', 'users']]
      .map(function (t) { return { value: t[0], label: t[1], icon: t[2], count: count(function (e) { return e.type === t[0]; }) }; })
  );

  ui.filterList({
    items: events,
    grid: document.getElementById('events-grid'),
    count: document.getElementById('events-count'),
    search: document.getElementById('events-search'),
    noun: ['event', 'events'],
    text: function (e) { return [e.title, e.label, e.topic, e.summary, e.venue, e.type, (e.tags || []).join(' ')].map(N.plain).join(' '); },
    groups: [
      { name: 'status', el: document.getElementById('events-status'), options: statusOpts, hash: true, match: function (e, v) { return N.eventStatus(e) === v; } },
      { name: 'type', el: document.getElementById('events-type'), options: typeOpts, hash: true, match: function (e, v) { return e.type === v; } }
    ],
    sort: function (a, b) {
      var ra = RANK[N.eventStatus(a)], rb = RANK[N.eventStatus(b)];
      if (ra !== rb) return ra - rb;
      var ta = time(a), tb = time(b);
      if (ta == null || tb == null) return 0;
      return ra === 2 ? tb - ta : ta - tb;
    },
    render: ui.eventCard,
    empty: function (s) {
      if (s.sel.status === 'upcoming' || s.sel.status === 'ongoing') {
        return ui.empty({ icon: 'calendar', title: 'Nothing scheduled right now',
          text: 'The next NISC event will be announced here and in NISC Updates. Join the community to hear first.',
          actions: [{ label: 'Join NISC', href: 'join.html', primary: true }, { label: 'See completed events', href: 'events/index.html#completed' }] });
      }
      return ui.empty({ icon: 'search', title: 'No events match these filters', text: 'Try another type, or clear the search.' });
    }
  });
})();
