/* NISC — member.js : team member profile (team/member.html?id=…). */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, I = N.icon, E = N.esc, F = N.fmt, P = N.plain, U = N.url;
  var root = document.getElementById('member-root');
  var T = N.team || { roles: [], current: [], alumni: [] };
  var id = N.param('id');
  var m = ui.byId(T.current, id), isAlum = false;
  if (!m) { m = ui.byId(T.alumni, id); isAlum = !!m; }
  if (!m) {
    ui.notFound(root, { title: 'Profile not found', text: 'This team member may have moved to a different role.', backHref: 'team/index.html', backLabel: 'Meet the team' });
    return;
  }
  var role = ui.role(m.role);
  var roleTitle = role.title || m.roleTitle || '';
  var name = P(m.name) || roleTitle;
  N.setTitle(name, roleTitle + ' at NISC');
  var photo = m.photo ? '<img src="' + U(m.photo) + '" alt="' + E(m.photoAlt || 'Portrait of ' + name) + '">' : '<img src="' + U('assets/img/illustrations/avatar.svg') + '" alt="">';
  var social = N.socialLinks(m.links || {}, 'btn btn--secondary btn--sm');

  var involvement = (m.involvement || []).map(function (ref) {
    var ev = N.events ? ui.byId(N.events, ref) : null;
    if (ev) return '<li>' + I('calendar') + '<a href="' + N.eventUrl(ev) + '">' + E(N.eventName(ev)) + '</a></li>';
    var ms = N.timeline ? ui.byId(N.timeline.milestones, ref) : null;
    if (ms) return '<li>' + I('route') + '<a href="' + U('discover/milestone.html?id=' + ms.id) + '">' + F(ms.title) + '</a></li>';
    return '';
  }).join('');

  var html = '<section class="page-hero"><div class="container">' +
    '<nav class="breadcrumbs" aria-label="Breadcrumb" style="margin-bottom:28px"><ol><li><a href="' + U('index.html') + '">Home</a></li><li><a href="' + U('team/index.html') + '">Team</a></li><li aria-current="page">' + E(name) + '</li></ol></nav>' +
    '<div class="profile"><div class="profile__photo">' + photo + '</div><div class="profile__info">' +
      '<div class="cluster cluster--sm"><span class="pill pill--upcoming">' + E(roleTitle) + '</span>' + (isAlum ? '<span class="pill">Past team · ' + E(m.term || '') + '</span>' : (T.term ? '<span class="pill">' + F(T.term) + '</span>' : '')) + '</div>' +
      '<h1>' + F(m.name) + '</h1>' +
      (m.college ? '<p class="text-2">' + I('grad') + ' ' + F(m.college) + '</p>' : '') +
      '<p class="lead">' + F(m.intro) + '</p>' +
      (social ? '<div class="cluster">' + social + '</div>' : '') +
    '</div></div></div></section>';

  html += '<section class="section section--tight"><div class="container"><div class="grid grid--2">' +
    '<div class="card card--pad"><h2 style="font-size:var(--fs-lg)">' + I('clipboard') + ' Responsibilities</h2>' + (ui.list(role.responsibilities || m.responsibilities, 'check') || '<p class="text-2">N/A</p>') + '</div>' +
    '<div class="stack stack--lg">' + (ui.tags(m.skills, 'tag--accent') ? '<div class="card card--pad"><h2 style="font-size:var(--fs-lg)">' + I('sparkles') + ' Skills &amp; focus areas</h2>' + ui.tags(m.skills, 'tag--accent') + '</div>' : '') +
    (involvement ? '<div class="card card--pad"><h2 style="font-size:var(--fs-lg)">' + I('route') + ' Involvement at NISC</h2><ul class="meta-list">' + involvement + '</ul></div>' : '') + '</div>' +
    '</div></div></section>';

  var others = T.current.filter(function (x) { return x.id !== m.id; });
  if (others.length) {
    html += '<section class="section section--alt section--grid"><div class="container"><div class="section-head"><div class="section-head__text"><span class="eyebrow">The team</span><h2>Other team members</h2></div><a class="btn btn--secondary" href="' + U('team/index.html') + '">Full team ' + I('arrow-right', 'i--arrow') + '</a></div><div class="grid grid--4">' + others.slice(0, 4).map(ui.memberCard).join('') + '</div></div></section>';
  }
  root.innerHTML = html;
  N.enhance(root);
})();
