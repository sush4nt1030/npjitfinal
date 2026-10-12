/* NISC — impact.js : verified impact numbers and evidence. */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, I = N.icon, E = N.esc;
  var s = (N.site && N.site.stats) || {};
  // Known facts first; other numbers appear only once they are counted.
  s = Object.assign({ founded: 2023, teamMembers: (N.team && N.team.current || []).length || null, firstGroup: 291, projects: (N.projects || []).length || null }, s, { projects: s.projects != null ? s.projects : ((N.projects || []).length || null) });
  var DEF = [
    ['sessionsCompleted', 'Sessions completed', 'book', 'NISC has successfully completed two sessions.'],
    ['founded', 'Year founded', 'flag', 'NISC officially started on 18 November 2023.'],
    ['teamMembers', 'Core team members', 'users', 'Two admins and five leads.'],
    ['firstGroup', 'Members in the first group', 'users', 'The first NISC group grew to around 291 members.'],
    ['members', 'Community members', 'users', 'Counted from the membership list.'],
    ['studentsReached', 'Students reached', 'megaphone', 'Across all events and activities.'],
    ['projects', 'Projects built', 'rocket', 'Listed in the Projects showcase.'],
    ['volunteers', 'Volunteers', 'heart', 'Students who helped run activities.'],
    ['collaborations', 'Collaborations', 'handshake', 'Verified partner activities.']
  ];
  var grid = document.getElementById('impact-stats');
  if (grid) {
    grid.innerHTML = DEF.filter(function (d) { var v = s[d[0]]; return v != null && v !== ''; }).map(function (d) {
      var v = s[d[0]];
      var isYear = d[0] === 'founded';
      return '<div class="stat stat--verified" data-reveal>' +
        '<span class="icon-tile">' + I(d[2]) + '</span>' +
        '<span class="stat__value"' + (isYear ? '' : ' data-count="' + E(v) + '"') + '>' + E(v) + '</span>' +
        '<span class="stat__label">' + d[1] + '</span><span class="stat__note">' + d[3] + '</span></div>';
    }).join('');
  }
  var done = document.getElementById('impact-events');
  if (done) {
    var list = N.visible(N.events || []).filter(function (e) { return N.eventStatus(e) === 'completed'; });
    done.innerHTML = list.map(ui.eventCard).join('') || ui.empty({ icon: 'calendar', title: 'Completed events will be listed here' });
  }
})();
