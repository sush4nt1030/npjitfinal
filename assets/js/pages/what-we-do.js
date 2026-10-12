/* NISC — what-we-do.js : the twelve activity areas and what students gain. */
(function () {
  'use strict';
  var N = window.NISC, I = N.icon, E = N.esc, U = N.url;
  var grid = document.getElementById('wwd-grid');
  if (!grid) return;
  grid.innerHTML = (N.activities || []).map(function (a) {
    return '<article class="card card--pad activity-card" id="' + a.id + '" data-reveal>' +
      '<div class="cluster"><span class="icon-tile">' + I(a.icon) + '</span><h3>' + E(a.name) + '</h3></div>' +
      '<p class="text-2">' + E(a.summary) + '</p>' +
      '<div class="gain"><strong>What you gain</strong><ul>' + a.gains.map(function (g) { return '<li>' + E(g) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="links">' + (a.links || []).map(function (l) { return '<a class="link-arrow" href="' + U(l.href) + '">' + E(l.label) + ' ' + I('arrow-right') + '</a>'; }).join('') + '</div></article>';
  }).join('');
  var chips = document.getElementById('wwd-jump');
  if (chips) {
    chips.innerHTML = (N.activities || []).map(function (a) { return '<a class="chip" href="#' + a.id + '">' + I(a.icon) + E(a.name) + '</a>'; }).join('');
  }
  if (location.hash.length > 1) {
    var t = document.getElementById(location.hash.slice(1));
    if (t) setTimeout(function () { t.scrollIntoView({ block: 'start' }); t.classList.add('is-in'); }, 60);
  }
})();
