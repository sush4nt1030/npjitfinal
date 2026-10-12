/* NISC — home.js : renders the live parts of the homepage story. */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, I = N.icon, E = N.esc, F = N.fmt, U = N.url;
  var $ = function (id) { return document.getElementById(id); };

  /* 02 — What we do */
  var act = $('home-activities');
  if (act) {
    act.innerHTML = (N.activities || []).map(function (a) {
      return '<a class="activity-tile" href="' + U('discover/what-we-do.html#' + a.id) + '" data-reveal><span class="icon-tile">' + I(a.icon) + '</span>' + E(a.name) + '</a>';
    }).join('');
  }

  /* 03 — What we've done: journey preview */
  var jr = $('home-journey');
  if (jr && N.timeline) {
    var phases = {};
    N.timeline.phases.forEach(function (p) { phases[p.id] = p.label; });
    jr.innerHTML = N.timeline.milestones.map(function (m) {
      var d = N.parseDate(m.date);
      return '<a class="mini-step' + (m.future ? ' mini-step--future' : '') + '" href="' + U('discover/milestone.html?id=' + m.id) + '">' +
        '<span class="mini-step__phase">' + E(phases[m.phase] || '') + '</span>' +
        '<span class="mini-step__title">' + F(m.title) + '</span>' +
        '<span class="mini-step__date">' + (d ? N.fmtShort(d) : F(m.dateText)) + '</span></a>';
    }).join('');
  }

  var events = N.visible(N.events || []);
  var done = $('home-completed');
  if (done) {
    var completed = events.filter(function (e) { return N.eventStatus(e) === 'completed'; }).slice(0, 3);
    var more = completed.length && completed.length < 3 ? '<a class="card card--link archive-card" href="' + U('discover/our-journey.html') + '" data-reveal><span class="icon-tile">' + I('route') + '</span><h3 class="card__title">Every milestone, in one timeline</h3><p class="card__text">See how each session fits into the NISC story, from where we started to what\u2019s next.</p><span class="link-arrow">Open Our Journey ' + I('arrow-right') + '</span></a>' : '';
    done.innerHTML = completed.length ? completed.map(ui.eventCard).join('') + more :
      ui.empty({ icon: 'archive', title: 'The archive starts here', text: 'Completed events will appear here.' });
  }

  /* 04 — What's happening */
  var hap = $('home-happening');
  if (hap) {
    var live = events.filter(function (e) { return N.eventStatus(e) !== 'completed' && !e.cancelled; });
    live.sort(function (a, b) {
      var da = N.parseDate(a.start), db = N.parseDate(b.start);
      return (da ? da.getTime() : Infinity) - (db ? db.getTime() : Infinity);
    });
    hap.innerHTML = live.length ? ui.featureEvent(live[0], N.eventStatus(live[0]) === 'ongoing' ? 'Happening now' : 'Coming up next') :
      ui.empty({
        icon: 'calendar', title: 'No upcoming events announced yet',
        text: 'The next NISC activity will be announced here first. Join the community so you don’t miss it.',
        actions: [{ label: 'Join NISC', href: 'join.html', primary: true }, { label: 'Browse past events', href: 'events/index.html#completed' }]
      });
  }
  var upd = $('home-updates');
  if (upd) {
    upd.innerHTML = (N.updates || []).slice(0, 3).map(ui.updateRow).join('') ||
      ui.empty({ icon: 'megaphone', title: 'No updates yet' });
  }

  /* Story navigation: highlight the active chapter */
  var nav = document.querySelector('.story-nav');
  var chapters = N.qsa('.chapter');
  if (nav && chapters.length && 'IntersectionObserver' in window) {
    var links = N.qsa('a', nav);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        chapters.forEach(function (c) { c.classList.toggle('is-active', c === en.target); });
        links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + id;
          a.classList.toggle('is-active', on);
          if (on) {
            a.setAttribute('aria-current', 'step');
            var ol = a.closest('ol');
            if (ol && ol.scrollWidth > ol.clientWidth) ol.scrollTo({ left: a.parentNode.offsetLeft - 20, behavior: 'smooth' });
          } else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    chapters.forEach(function (c) { io.observe(c); });
  }
})();
