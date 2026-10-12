/* NISC — team.js : current team, roles and past team members. */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, I = N.icon, E = N.esc, F = N.fmt, U = N.url;
  var T = N.team || { roles: [], current: [], alumni: [] };

  var term = document.getElementById('team-term');
  if (term) {
    if (T.term) term.innerHTML = F(T.term);
    else { var meta = term.closest('.page-hero__meta'); if (meta) meta.innerHTML = '<span>' + I('users') + 'One team · one community</span>'; }
  }

  var grid = document.getElementById('team-grid');
  if (grid) {
    var admins = T.current.filter(function (m) { return m.group === 'admin'; });
    var core = T.current.filter(function (m) { return m.group !== 'admin'; });
    var group = function (eyebrow, title, text, list, cls) {
      return '<div class="team-group"><div class="team-group__head"><span class="eyebrow">' + E(eyebrow) + '</span><h2>' + E(title) + '</h2>' + (text ? '<p class="text-2">' + E(text) + '</p>' : '') + '</div>' +
        '<div class="grid team-grid' + (cls ? ' ' + cls : '') + '" data-reveal-stagger>' + list.map(ui.memberCard).join('') + '</div></div>';
    };
    grid.innerHTML = !T.current.length ? ui.empty({ icon: 'users', title: 'Team members will be listed here', text: 'The current NISC team will be introduced here.' }) :
      (admins.length ? group('Co-founders', 'Admins', 'The two people who started NISC and still run it.', admins, 'team-grid--lead') : '') +
      (core.length ? group('Core team', 'Team leads', 'Each lead looks after one part of NISC.', core, '') : '');
  }

  var roles = document.getElementById('team-roles');
  if (roles) {
    roles.innerHTML = T.roles.map(function (r) {
      return '<div class="role-row" data-reveal><span class="icon-tile">' + I(r.icon) + '</span><div><h3>' + E(r.title) + '</h3><p>' + E(r.about) + '</p>' +
        '<ul class="tag-list" role="list" style="margin-top:10px">' + r.responsibilities.map(function (x) { return '<li class="tag">' + E(x) + '</li>'; }).join('') + '</ul></div></div>';
    }).join('');
  }

  var alumni = document.getElementById('team-alumni');
  if (alumni) {
    alumni.innerHTML = T.alumni.length ? T.alumni.map(function (m) {
      return '<article class="card card--link card--pad" data-reveal><div class="cluster">' + ui.avatar(m.name, m.photo, 'avatar--lg') + '<div><h3 class="card__title"><a class="card__link" href="' + U('team/member.html?id=' + m.id) + '">' + F(m.name) + '</a></h3><p class="muted">' + E(m.roleTitle || '') + ' · ' + E(m.term || '') + '</p></div></div></article>';
    }).join('') : ui.empty({ icon: 'archive', title: 'The team archive starts here', text: 'When the team changes, previous members move here so every contribution to NISC stays on record.' });
  }
})();
