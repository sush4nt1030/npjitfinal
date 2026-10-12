/* NISC — stories.js : Student Stories listing. */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui;
  var items = N.visible(N.stories || []);
  var themes = [];
  items.forEach(function (s) { if (themes.indexOf(s.theme) < 0) themes.push(s.theme); });
  ui.filterList({
    items: items,
    grid: document.getElementById('stories-grid'),
    count: document.getElementById('stories-count'),
    noun: ['story', 'stories'],
    text: function (s) { return [s.title, s.quote, s.name, s.theme].map(N.plain).join(' '); },
    groups: [{ name: 'theme', el: document.getElementById('stories-themes'), options: [{ value: 'all', label: 'All stories', count: items.length }].concat(themes.map(function (t) { return { value: t, label: t }; })), match: function (s, v) { return s.theme === v; } }],
    render: ui.storyCard,
    empty: function () {
      return ui.empty({ icon: 'quote', title: 'Stories from NISC members will appear here', text: 'Attended a session, built something, or found your confidence with NISC? Your story could help the next student.', actions: [{ label: 'Share your story', href: 'contact.html?topic=story', primary: true }] });
    }
  });
})();
