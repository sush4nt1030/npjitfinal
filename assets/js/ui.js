/* ==========================================================================
   NISC — ui.js
   Shared renderers (cards, pills, covers, empty states) and the reusable
   filter/search list controller used by Events, Projects, Opportunities,
   Resources, Updates and Stories.
   ========================================================================== */
(function () {
  'use strict';
  var N = window.NISC;
  var I = N.icon, E = N.esc, F = N.fmt, V = N.val, P = N.plain, U = N.url;
  var ui = N.ui = {};

  /* ---------- Small pieces ---------- */
  ui.pill = function (status, glass) {
    return '<span class="pill pill--' + status + (glass ? ' pill--glass' : '') + '"><span class="pill__dot"></span>' + (N.STATUS_LABELS[status] || status) + '</span>';
  };
  ui.templatePill = '<span class="pill pill--template">Template</span>';
  ui.cover = function (kind, kicker, big, isText) {
    return '<div class="cover cover--' + kind + '" aria-hidden="true"><span class="cover__kicker">' + E(kicker) + '</span><span class="cover__big' + (isText ? ' cover__big--text' : '') + '">' + E(big) + '</span></div>';
  };
  ui.difficulty = function (level) {
    var names = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' };
    return '<span class="difficulty" data-level="' + level + '"><span class="difficulty__bars" aria-hidden="true"><i></i><i></i><i></i></span>' + (names[level] || '') + '</span>';
  };
  ui.tags = function (list, cls) {
    list = (list || []).filter(Boolean);
    if (!list.length) return '';
    return '<ul class="tag-list" role="list">' + list.map(function (t) { return '<li class="tag ' + (cls || '') + '">' + F(t) + '</li>'; }).join('') + '</ul>';
  };
  ui.avatar = function (name, photo, cls) {
    if (photo) return '<span class="avatar ' + (cls || '') + '"><img src="' + U(photo) + '" alt="" loading="lazy"></span>';
    var ini = N.initials(name);
    return '<span class="avatar ' + (cls || '') + '" aria-hidden="true">' + (ini || I('user')) + '</span>';
  };
  ui.empty = function (o) {
    var actions = (o.actions || []).map(function (a) {
      return '<a class="btn ' + (a.primary ? 'btn--primary' : 'btn--secondary') + ' btn--sm" href="' + U(a.href) + '">' + (a.icon ? I(a.icon) : '') + E(a.label) + '</a>';
    }).join('');
    return '<div class="empty-state"><span class="icon-tile">' + I(o.icon || 'search') + '</span><h3>' + E(o.title) + '</h3>' +
      (o.text ? '<p>' + o.text + '</p>' : '') + (actions ? '<div class="cluster">' + actions + '</div>' : '') + '</div>';
  };
  ui.notFound = function (host, o) {
    N.setTitle(o.title || 'Not found');
    host.innerHTML = '<section class="section"><div class="container container--narrow">' + ui.empty({
      icon: 'alert', title: o.title || 'We couldn’t find that page',
      text: o.text || 'The link may be outdated, or the item was removed.',
      actions: [{ label: o.backLabel || 'Go back', href: o.backHref || 'index.html', primary: true }, { label: 'Search NISC', href: 'search.html' }]
    }) + '</div></section>';
  };
  ui.metaList = function (rows, cls) {
    return '<ul class="meta-list ' + (cls || '') + '">' + rows.filter(Boolean).map(function (r) {
      return '<li>' + I(r[0]) + '<span>' + r[1] + '</span></li>';
    }).join('') + '</ul>';
  };
  ui.byId = function (list, id) { return (list || []).filter(function (x) { return x.id === id; })[0]; };
  ui.paragraphs = function (arr) {
    return (arr || []).map(function (p) {
      if (/^##\s+/.test(p)) return '<h2>' + F(p.replace(/^##\s+/, '')) + '</h2>';
      return N.isPh(p) ? '' : '<p>' + F(p) + '</p>';
    }).join('');
  };
  ui.list = function (arr, icon) {
    arr = (arr || []).filter(Boolean);
    if (!arr.length) return '';
    return '<ul class="outcome-list">' + arr.map(function (t) { return '<li>' + I(icon || 'check-circle') + '<span>' + F(t) + '</span></li>'; }).join('') + '</ul>';
  };

  /* ---------- Events ---------- */
  function coverBig(e) {
    var m = /(\d+)\s*$/.exec(e.label || '');
    return m ? { big: (m[1].length < 2 ? '0' : '') + m[1], text: false } : { big: P(e.label) || 'NISC', text: true };
  }
  ui.eventMedia = function (e) {
    if (e.banner) return '<img src="' + U(e.banner) + '" alt="" loading="lazy">';
    var c = coverBig(e);
    return ui.cover(e.type || 'session', 'NISC · ' + (N.TYPE_LABELS[e.type] || 'Event'), c.big, c.text);
  };
  ui.dateBadge = function (e) {
    var s = N.parseDate(e.start);
    return s ? '<span class="date-badge"><span class="date-badge__m">' + N.fmtMonth(s) + '</span><span class="date-badge__d">' + N.fmtDay(s) + '</span></span>' : '';
  };
  ui.regLine = function (e) {
    var st = N.eventStatus(e);
    if (e.cancelled) return '<span class="pill pill--closed">Event cancelled</span>';
    if (st === 'completed') return '<span class="cluster cluster--sm">' + I('archive') + (e.live ? 'Completed' : 'In the archive · see highlights') + '</span>';
    if (N.regOpen(e)) return '<span class="pill pill--open"><span class="pill__dot"></span>Registration open' + (e.live && e.registration.spotsLeft != null && e.registration.spotsLeft <= 10 ? ' · ' + e.registration.spotsLeft + ' left' : '') + '</span>';
    if (st === 'ongoing') return '<span class="pill pill--ongoing"><span class="pill__dot"></span>Happening now</span>';
    if (e.registration && e.registration.full) return '<span class="pill pill--closed">Fully booked</span>';
    return '<span class="pill pill--closed">' + (e.live ? 'Registration closed' : 'Registration not open yet') + '</span>';
  };
  /** "Session · Session 02" → "Session 02" (no repeated type). */
  ui.eventKicker = function (e) {
    var t = N.TYPE_LABELS[e.type] || 'Event', l = String(e.label || '').trim();
    if (!l) return t;
    return l.toLowerCase().indexOf(t.toLowerCase()) === 0 ? l : t + ' · ' + l;
  };
  ui.eventCard = function (e) {
    var st = N.eventStatus(e);
    return '<article class="card card--link event-card' + (e.template ? ' card--template' : '') + '" data-reveal>' +
      '<div class="card__media">' + ui.eventMedia(e) +
        '<div class="card__badges"><span class="cluster cluster--sm">' + ui.pill(st, true) + (e.template ? ui.templatePill : '') + '</span>' + ui.dateBadge(e) + '</div></div>' +
      '<div class="card__body">' +
        '<p class="card__kicker">' + E(ui.eventKicker(e)) + '</p>' +
        '<h3 class="card__title"><a class="card__link" href="' + N.eventUrl(e) + '">' + F(e.title) + '</a></h3>' +
        ui.metaList([['calendar', F(N.eventDate(e))], ['map-pin', V(e.venue, 'N/A')]]) +
      '</div>' +
      '<div class="card__foot">' + ui.regLine(e) + I('arrow-right', 'i--arrow') + '</div></article>';
  };
  ui.featureEvent = function (e, eyebrow) {
    var st = N.eventStatus(e);
    var actions = '<a class="btn btn--primary" href="' + N.eventUrl(e) + '">View event ' + I('arrow-right', 'i--arrow') + '</a>' +
      (N.regOpen(e) ? '<a class="btn btn--secondary" href="' + U('events/register.html?event=' + e.id) + '">' + I('ticket') + 'Register now</a>' : '');
    return '<article class="feature-event' + (e.template ? ' card--template' : '') + '" data-reveal>' +
      '<div class="feature-event__media">' + ui.eventMedia(e) + '<div class="card__badges"><span class="cluster cluster--sm">' + ui.pill(st, true) + (e.template ? ui.templatePill : '') + '</span>' + ui.dateBadge(e) + '</div></div>' +
      '<div class="feature-event__body"><span class="eyebrow">' + E(eyebrow || 'Featured event') + '</span>' +
        '<h2><a href="' + N.eventUrl(e) + '">' + F(e.title) + '</a></h2>' +
        '<p>' + F(e.summary) + '</p>' +
        ui.metaList([['calendar', F(N.eventDate(e))], ['clock', F(N.eventTime(e))], ['map-pin', V(e.venue, 'N/A')]]) +
        '<div class="cluster">' + actions + '</div></div></article>';
  };

  /* ---------- Projects ---------- */
  ui.PROJECT_STATUS = { idea: ['Idea', 'closed'], 'in-progress': ['In progress', 'upcoming'], completed: ['Completed', 'open'], maintained: ['Maintained', 'open'] };
  ui.projectStatus = function (s) {
    var d = ui.PROJECT_STATUS[s] || [s, 'closed'];
    return '<span class="pill pill--' + d[1] + '"><span class="pill__dot"></span>' + E(d[0]) + '</span>';
  };
  ui.projectCard = function (p) {
    var media = p.cover ? '<img src="' + U(p.cover) + '" alt="" loading="lazy">' : ui.cover('project', p.category || 'Project', P(p.title) || 'Your project here', true);
    return '<article class="card card--link' + (p.template ? ' card--template' : '') + '" data-reveal>' +
      '<div class="card__media">' + media + '<div class="card__badges"><span class="cluster cluster--sm">' + ui.projectStatus(p.status).replace('pill ', 'pill pill--glass ') + (p.template ? ui.templatePill : '') + '</span></div></div>' +
      '<div class="card__body"><p class="card__kicker">' + E(p.category || 'Project') + '</p>' +
        '<h3 class="card__title"><a class="card__link" href="' + U('projects/project.html?id=' + p.id) + '">' + F(p.title) + '</a></h3>' +
        '<p class="card__text">' + F(p.tagline) + '</p>' + ui.tags(p.tech) + '</div>' +
      '<div class="card__foot"><span class="contributors">' + (p.contributors || []).slice(0, 4).map(function (c) { return ui.avatar(c.name); }).join('') + '</span>' + I('arrow-right', 'i--arrow') + '</div></article>';
  };

  /* ---------- Resources ---------- */
  ui.category = function (id) { return ui.byId(N.resourceCategories, id) || { name: id, icon: 'book' }; };
  ui.resourceCard = function (r) {
    var c = ui.category(r.category);
    return '<article class="card card--link" data-reveal><div class="card__body">' +
      '<div class="cluster" style="justify-content:space-between"><span class="icon-tile">' + I(c.icon) + '</span>' + (r.starter ? '<span class="tag tag--accent">NISC starter path</span>' : '<span class="tag">' + E(r.type) + '</span>') + '</div>' +
      '<p class="card__kicker">' + E(c.name) + '</p>' +
      '<h3 class="card__title"><a class="card__link" href="' + U('resources/resource.html?id=' + r.id) + '">' + E(r.title) + '</a></h3>' +
      '<p class="muted" style="font-size:.88rem">' + E(r.source) + '</p>' +
      '<p class="card__text">' + E(r.summary) + '</p></div>' +
      '<div class="card__foot">' + ui.difficulty(r.level) + '<span class="cluster cluster--sm"><span class="tag">' + E(r.cost) + '</span>' + I('arrow-right', 'i--arrow') + '</span></div></article>';
  };

  /* ---------- Opportunities ---------- */
  ui.OPP_TYPES = {
    internship: ['Internship', 'briefcase'], job: ['Job', 'building'], hackathon: ['Hackathon', 'code'],
    scholarship: ['Scholarship', 'grad'], competition: ['Competition', 'trophy'], workshop: ['Workshop', 'wrench'],
    bootcamp: ['Bootcamp', 'rocket'], volunteer: ['Volunteer', 'heart'], fellowship: ['Fellowship', 'award'], other: ['Other', 'sparkles']
  };
  ui.deadline = function (o) {
    var d = o.deadline ? N.parseDate(o.deadline + 'T23:59:59+05:45') : null;
    if (!d) return { text: V(o.deadlineText, 'N/A'), note: '', state: 'unknown' };
    var days = Math.ceil((d.getTime() - Date.now()) / 86400000);
    if (days < 0) return { text: N.fmtShort(d), note: 'Closed', state: 'closed' };
    return { text: N.fmtShort(d), note: days === 0 ? 'Closes today' : days + (days === 1 ? ' day left' : ' days left'), state: days <= 7 ? 'soon' : 'open' };
  };
  ui.oppCard = function (o) {
    var t = ui.OPP_TYPES[o.type] || ui.OPP_TYPES.other;
    var dl = ui.deadline(o);
    return '<article class="card card--link opp-card' + (o.template ? ' card--template' : '') + '" data-reveal>' +
      '<span class="icon-tile">' + I(t[1]) + '</span>' +
      '<div class="stack stack--sm" style="min-width:0"><div class="cluster cluster--sm"><span class="tag tag--accent">' + t[0] + '</span>' + (o.template ? ui.templatePill : '') + (dl.state === 'closed' ? '<span class="pill pill--closed">Closed</span>' : '') + '</div>' +
        '<h3 class="card__title"><a class="card__link" href="' + U('opportunities/opportunity.html?id=' + o.id) + '">' + F(o.title) + '</a></h3>' +
        ui.metaList([['building', F(o.organization)], ['map-pin', F(o.location)], ['users', F((o.eligibility || [])[0] || '')]], 'meta-list--inline') + '</div>' +
      '<div class="opp-card__deadline"><span class="muted mono" style="font-size:.7rem;letter-spacing:.1em;text-transform:uppercase">Deadline</span><strong>' + dl.text + '</strong>' +
        (dl.note ? '<span class="pill pill--' + (dl.state === 'soon' ? 'soon' : dl.state === 'closed' ? 'closed' : 'open') + '">' + dl.note + '</span>' : '') + '</div></article>';
  };

  /* ---------- Updates ---------- */
  ui.updateDate = function (u) { var d = N.parseDate(u.date); return d ? N.fmtShort(d) : V(u.dateText, 'N/A'); };
  ui.updateRow = function (u) {
    return '<article class="update-row" data-reveal><span class="update-row__date">' + ui.updateDate(u) + '</span>' +
      '<div><span class="tag tag--accent">' + E(u.category) + '</span>' +
      '<h3 class="update-row__title" style="margin-top:8px"><a class="card__link" href="' + U('updates/update.html?id=' + u.id) + '">' + F(u.title) + '</a></h3>' +
      '<p class="update-row__excerpt">' + F(u.excerpt) + '</p></div>' + I('arrow-right', 'i--arrow') + '</article>';
  };

  /* ---------- Stories ---------- */
  ui.storyCard = function (s) {
    return '<article class="card card--link card--pad story-card' + (s.template ? ' card--template' : '') + '" data-reveal>' +
      '<div class="cluster cluster--sm"><span class="tag tag--accent">' + E(s.theme) + '</span>' + (s.template ? ui.templatePill : '') + '</div>' +
      '<blockquote>' + F(s.quote) + '</blockquote>' +
      '<div class="cluster" style="margin-top:auto">' + ui.avatar(s.name, s.photo) + '<div><strong><a class="card__link" href="' + U('community/story.html?id=' + s.id) + '" style="color:inherit;text-decoration:none">' + F(s.name) + '</a></strong><p class="muted" style="font-size:.88rem">' + F(s.detail) + '</p></div></div></article>';
  };

  /* ---------- Team ---------- */
  ui.role = function (id) { return ui.byId(N.team && N.team.roles, id) || { title: id || '', icon: 'user' }; };
  ui.memberCard = function (m) {
    var role = ui.role(m.role);
    var media = m.photo ? '<img src="' + U(m.photo) + '" alt="' + E(m.photoAlt || 'Portrait of ' + (P(m.name) || role.title)) + '" loading="lazy">' : '<img src="' + U('assets/img/illustrations/avatar.svg') + '" alt="" loading="lazy">';
    var social = N.socialLinks(m.links || {});
    return '<article class="card card--link member-card" data-reveal><div class="card__media">' + media + '</div>' +
      '<div class="card__body"><span class="member-card__role">' + E(role.title || m.roleTitle) + '</span>' +
        '<h3 class="card__title"><a class="card__link" href="' + U('team/member.html?id=' + m.id) + '">' + F(m.name) + '</a></h3>' +
        '<p class="card__text">' + F(m.intro) + '</p>' + ui.tags(m.skills) + '</div>' +
      '<div class="card__foot">' + (social ? '<span class="member-card__social">' + social + '</span>' : '<span class="muted" style="font-size:.85rem">View profile</span>') + I('arrow-right', 'i--arrow') + '</div></article>';
  };

  /* ---------- Chips + filterable list controller ---------- */
  ui.chips = function (el, options, current) {
    el.innerHTML = options.map(function (o) {
      return '<button type="button" class="chip" data-value="' + E(o.value) + '" aria-pressed="' + (o.value === current ? 'true' : 'false') + '">' +
        (o.icon ? I(o.icon) : '') + E(o.label) + (o.count != null ? '<span class="chip__count">' + o.count + '</span>' : '') + '</button>';
    }).join('');
  };

  /**
   * o = { items, grid, count, search, noun:['event','events'], text(item), render(item), empty(state),
   *       groups:[{ name, el, options, match(item, value), hash:true }], sort(a,b), onUpdate(list,state) }
   */
  ui.filterList = function (o) {
    var state = { q: '', sel: {} };
    var groups = o.groups || [];
    groups.forEach(function (g) {
      state.sel[g.name] = g.initial || 'all';
      if (g.hash && location.hash.length > 1) {
        var h = decodeURIComponent(location.hash.slice(1));
        if (g.options.some(function (op) { return op.value === h; })) state.sel[g.name] = h;
      }
      if (g.el) ui.chips(g.el, g.options, state.sel[g.name]);
    });
    function matches(item) {
      if (state.q) {
        var hay = o.text(item).toLowerCase();
        if (!state.q.split(/\s+/).every(function (t) { return hay.indexOf(t) > -1; })) return false;
      }
      return groups.every(function (g) { return state.sel[g.name] === 'all' || g.match(item, state.sel[g.name]); });
    }
    var first = true;
    function update() {
      var list = o.items.filter(matches);
      if (o.sort) list.sort(o.sort);
      o.grid.innerHTML = list.length ? list.map(o.render).join('') : o.empty(state);
      if (!first) {
        N.qsa('[data-reveal]', o.grid).forEach(function (el) { el.classList.add('is-in'); });
        o.grid.classList.remove('is-filtering');
        void o.grid.offsetWidth;
        o.grid.classList.add('is-filtering');
      }
      first = false;
      if (o.count) o.count.textContent = list.length + ' ' + (list.length === 1 ? o.noun[0] : o.noun[1]);
      N.enhance(o.grid);
      if (o.onUpdate) o.onUpdate(list, state);
    }
    function set(name, value, fromHash) {
      state.sel[name] = value;
      var g = groups.filter(function (x) { return x.name === name; })[0];
      if (g && g.el) N.qsa('.chip', g.el).forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-value') === value ? 'true' : 'false'); });
      if (g && g.hash && !fromHash && history.replaceState) {
        history.replaceState(null, '', value === 'all' ? location.pathname + location.search : '#' + value);
      }
      update();
    }
    groups.forEach(function (g) {
      if (!g.el) return;
      g.el.addEventListener('click', function (e) {
        var c = e.target.closest('.chip');
        if (c) set(g.name, c.getAttribute('data-value'));
      });
    });
    window.addEventListener('hashchange', function () {
      var h = decodeURIComponent(location.hash.slice(1));
      groups.forEach(function (g) {
        if (g.hash && g.options.some(function (op) { return op.value === h; })) set(g.name, h, true);
      });
    });
    if (o.search) {
      o.search.addEventListener('input', N.debounce(function () { state.q = o.search.value.trim().toLowerCase(); update(); }, 120));
    }
    update();
    return { update: update, set: set, state: state };
  };

  /* ---------- Discover sidebar + prev/next (Discover pages) ---------- */
  ui.discoverNav = function () {
    var host = N.qs('[data-discover-nav]');
    var pager = N.qs('[data-discover-pager]');
    var list = N.discover || [];
    var id = document.body.getAttribute('data-page');
    var idx = -1;
    list.forEach(function (d, i) { if (d.id === id) idx = i; });
    if (host) {
      host.innerHTML = '<p class="discover-nav__title"><span>Discover NISC</span>' + (idx > -1 ? '<span>' + (idx + 1) + ' / ' + list.length + '</span>' : '') + '</p>' +
        '<ol class="discover-nav__list" role="list">' + list.map(function (d, i) {
          return '<li><a class="discover-nav__link' + (i < idx ? ' is-done' : '') + '" href="' + U(d.href) + '"' + (i === idx ? ' aria-current="page"' : '') + '><span class="discover-nav__num" aria-hidden="true"></span>' + E(d.title) + '</a></li>';
        }).join('') + '</ol>';
      var active = N.qs('[aria-current="page"]', host);
      if (active && window.innerWidth < 960) {
        var ol = N.qs('ol', host);
        ol.scrollLeft = active.parentNode.offsetLeft - 16;
      }
    }
    if (pager && idx > -1) {
      var prev = list[idx - 1], next = list[idx + 1];
      pager.innerHTML =
        (prev ? '<a class="pager__link pager__link--prev" href="' + U(prev.href) + '"><span class="pager__label">' + I('arrow-left') + 'Previous</span><span class="pager__title">' + E(prev.title) + '</span></a>' : '<a class="pager__link pager__link--prev" href="' + U('discover/index.html') + '"><span class="pager__label">' + I('arrow-left') + 'Overview</span><span class="pager__title">Discover NISC</span></a>') +
        (next ? '<a class="pager__link pager__link--next" href="' + U(next.href) + '"><span class="pager__label">Continue' + I('arrow-right') + '</span><span class="pager__title">' + E(next.title) + '</span></a>' : '<a class="pager__link pager__link--next" href="' + U('join.html') + '"><span class="pager__label">Next step' + I('arrow-right') + '</span><span class="pager__title">Join NISC</span></a>');
    }
  };
  if (document.querySelector('[data-discover-nav]')) ui.discoverNav();
})();
