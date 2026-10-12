/* NISC — event.js : complete event profile page (events/event.html?id=…). */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, I = N.icon, E = N.esc, F = N.fmt, V = N.val, P = N.plain, U = N.url;
  var root = document.getElementById('event-root');
  var id = N.param('id');
  var e = ui.byId(N.visible(N.events || []), id);
  if (!e) {
    ui.notFound(root, { title: 'Event not found', text: 'This event may have been renamed or removed. Browse all NISC events instead.', backHref: 'events/index.html', backLabel: 'All events' });
    return;
  }
  var name = N.eventName(e);
  N.setTitle(name, P(e.summary));
  var st = N.eventStatus(e);
  var open = N.regOpen(e);
  var start = N.parseDate(e.start);
  var regUrl = U('events/register.html?event=' + encodeURIComponent(e.id));

  var photos = [];
  if (N.gallery) {
    var albums = N.gallery.albums.filter(function (a) { return a.event === e.id; }).map(function (a) { return a.id; });
    photos = N.gallery.photos.filter(function (p) { return albums.indexOf(p.album) > -1; });
  }
  var milestone = e.milestone && N.timeline ? ui.byId(N.timeline.milestones, e.milestone) : null;
  var isPast = st === 'completed';
  var live = !!e.live;

  /* ---------- Hero ---------- */
  var heroActions = [];
  if (e.cancelled) heroActions.push('<span class="pill pill--closed">This event has been cancelled</span>');
  if (open) heroActions.push('<a class="btn btn--primary btn--lg" href="' + regUrl + '">' + I('ticket') + 'Register now</a>');
  if (e.website && e.website.href) heroActions.push('<a class="btn btn--' + (open ? 'secondary' : 'primary') + '" href="' + E(e.website.href) + '" target="_blank" rel="noopener noreferrer">' + I('globe') + 'Official website</a>');
  heroActions.push('<button class="btn btn--ghost" type="button" data-share>' + I('share') + 'Share</button>');
  var hasAgenda = (e.agenda || []).length > 0;
  var hasSpeakers = (e.speakers || []).length > 0;
  var hasHighlights = isPast && (e.highlights || []).length > 0;
  var hasPhotos = isPast && photos.length > 0;
  var hasFeedback = isPast && (e.feedback || []).length > 0;
  if (hasHighlights || hasPhotos) heroActions.splice(heroActions.length - 1, 0, '<a class="btn btn--primary" href="#' + (hasHighlights ? 'highlights' : 'photos') + '">' + I('sparkles') + 'See highlights</a>');
  if (start && !isPast && !e.cancelled) heroActions.splice(heroActions.length - 1, 0, '<button class="btn btn--secondary" type="button" data-ics>' + I('calendar-plus') + 'Add to calendar</button>');
  var sections = [['about', 'About']];
  if (hasAgenda) sections.push(['agenda', 'Agenda']);
  if (hasSpeakers) sections.push(['speakers', e.speakers.length > 1 ? 'Speakers' : 'Speaker']);
  if (hasHighlights) sections.push(['highlights', 'Highlights']);
  if (hasPhotos) sections.push(['photos', 'Pictures']);
  if (hasFeedback) sections.push(['feedback', 'Feedback']);
  sections.push(['faq', 'FAQ'], ['related', 'Related']);

  var html = '';
  html += '<section class="event-hero"><div class="container">' +
    '<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="' + U('index.html') + '">Home</a></li><li><a href="' + U('events/index.html') + '">Events</a></li><li aria-current="page">' + E(name) + '</li></ol></nav>' +
    '<div class="event-hero__grid" style="margin-top:22px">' +
      '<div class="event-hero__copy">' +
        '<div class="cluster cluster--sm">' + ui.pill(st) + '<span class="tag">' + E(N.TYPE_LABELS[e.type] || 'Event') + '</span>' + (e.label ? '<span class="tag tag--accent">' + E(e.label) + '</span>' : '') + '</div>' +
        '<h1>' + F(e.title) + '</h1>' +
        (e.topic ? '<p class="event-hero__topic"><strong>Topic:</strong> ' + F(e.topic) + '</p>' : '') +
        ui.metaList([['calendar', F(N.eventDate(e))], ['clock', F(N.eventTime(e))], ['map-pin', V(e.venue, 'N/A')]], 'meta-list--inline') +
        '<div class="cluster" style="margin-top:6px">' + heroActions.join('') + '</div>' +
      '</div>' +
      '<div class="event-hero__media">' + ui.eventMedia(e) + '</div>' +
    '</div></div></section>';

  html += '<nav class="anchor-nav" aria-label="On this page"><div class="container"><ul>' +
    sections.map(function (s) { return '<li><a href="#' + s[0] + '">' + s[1] + '</a></li>'; }).join('') + '</ul></div></nav>';

  /* ---------- Main column ---------- */
  var cards = '';
  if (e.purpose) cards += '<div class="card card--flat card--pad"><h3>' + I('target') + ' Purpose</h3><p class="text-2">' + F(e.purpose) + '</p></div>';
  if ((e.audience || []).length) cards += '<div class="card card--flat card--pad"><h3>' + I('users') + ' Who it’s for</h3>' + ui.tags(e.audience) + '</div>';
  var main = '<section class="detail-section" id="about"><h2>' + I('info') + 'About this event</h2><div class="prose">' +
    ((e.description || []).length ? ui.paragraphs(e.description) : '<p>' + F(e.summary || 'More details will be shared soon.') + '</p>') + '</div>' +
    (cards ? '<div class="grid grid--2 mt-md">' + cards + '</div>' : '') +
    (e.poster ? '<figure class="event-poster"><a href="' + U(e.poster) + '" target="_blank" rel="noopener"><img src="' + U(e.poster) + '" alt="' + E(e.posterAlt || 'Poster for ' + name) + '" loading="lazy"></a><figcaption>Official poster' + (e.website && e.website.label ? ' · ' + E(e.website.label) : '') + '</figcaption></figure>' : '') +
    ((e.outcomes || []).length ? '<h3 class="mt-lg" style="margin-bottom:14px">What ' + (isPast ? 'participants learned' : 'you’ll learn') + '</h3>' + ui.list(e.outcomes) : '') +
  '</section>';

  if (hasAgenda) main += '<section class="detail-section" id="agenda"><h2>' + I('list') + 'Agenda</h2><ol class="agenda">' + e.agenda.map(function (a) {
      return '<li><span class="agenda__time">' + F(a.time) + '</span><span class="agenda__dot" aria-hidden="true"></span><div><p class="agenda__title">' + F(a.title) + '</p>' + (a.detail ? '<p class="agenda__detail">' + F(a.detail) + '</p>' : '') + '</div></li>';
    }).join('') + '</ol></section>';

  if (hasSpeakers) main += '<section class="detail-section" id="speakers"><h2>' + I('mic') + (e.speakers.length > 1 ? 'Speakers' : 'Speaker') + '</h2><div class="grid grid--2">' +
    e.speakers.map(function (s) {
      var links = N.socialLinks(s.links || {}, 'icon-btn');
      return '<div class="speaker-card">' + ui.avatar(s.name, s.photo) + '<div><h3>' + F(s.name) + '</h3>' + (s.role ? '<p class="role">' + F(s.role) + '</p>' : '') + (s.bio ? '<p>' + F(s.bio) + '</p>' : '') + (links ? '<div class="cluster cluster--sm" style="margin-top:8px">' + links + '</div>' : '') + '</div></div>';
    }).join('') + '</div></section>';

  if (hasHighlights) main += '<section class="detail-section" id="highlights"><h2>' + I('sparkles') + 'Event highlights</h2>' + ui.list(e.highlights, 'star') + '</section>';
  if (hasPhotos) {
    var album = (N.gallery.albums.filter(function (a) { return a.event === e.id; })[0] || {});
    main += '<section class="detail-section" id="photos"><h2>' + I('camera') + 'Pictures</h2>' +
      '<div class="photo-grid">' + photos.map(function (p, i) {
        return '<button type="button" data-photo="' + i + '" aria-label="Open picture ' + (i + 1) + ' of ' + photos.length + '"><img src="' + U(p.src) + '" alt="' + E(P(p.alt)) + '" loading="lazy"></button>';
      }).join('') + '</div>' + (album.note ? '<p class="muted mt-sm" style="font-size:.88rem">' + I('info') + ' ' + E(album.note) + '</p>' : '') +
      '<p class="mt-sm"><a class="link-arrow" href="' + U('gallery/index.html#' + album.id) + '">Open the full album ' + I('arrow-right') + '</a></p></section>';
  }
  if (hasFeedback) main += '<section class="detail-section" id="feedback"><h2>' + I('message') + 'Participant feedback</h2><div class="grid grid--2">' +
      e.feedback.map(function (f) {
        return '<figure class="quote-card"><blockquote>' + F(f.quote) + '</blockquote><figcaption>' + ui.avatar(f.name) + '<span><strong>' + F(f.name) + '</strong>' + F(f.detail) + '</span></figcaption></figure>';
      }).join('') + '</div></section>';

  var faqs = (e.faqs || []).slice();
  faqs.push({ q: 'Is NISC free to join?', a: 'Yes. Joining the NISC community is free. <a href="' + U('join.html') + '">Here’s how to join</a>.', html: true });
  faqs.push({ q: 'Do I need to be an expert or an IT student?', a: 'No. NISC welcomes beginners and non-IT students who are interested in technology. You just need the willingness to learn.' });
  main += '<section class="detail-section" id="faq"><h2>' + I('help') + 'Frequently asked questions</h2><div class="accordion">' +
    faqs.map(function (f) {
      return '<details class="acc-item"><summary>' + F(f.q) + '<span class="acc-icon" aria-hidden="true"></span></summary><div class="acc-body"><p>' + (f.html ? f.a : F(f.a)) + '</p></div></details>';
    }).join('') + '</div></section>';

  /* ---------- Aside ---------- */
  var seats = e.registration && e.registration.seats;
  if (live && seats && e.registration.spotsLeft != null) seats = e.registration.spotsLeft + ' of ' + seats + ' left';
  var reg = '';
  if (e.cancelled) {
    reg = '<div class="reg-state"><div class="reg-state__row"><strong>Registration</strong><span class="pill pill--closed">Event cancelled</span></div><p class="muted" style="font-size:.88rem">This event has been cancelled. Follow NISC Updates for news about the next one.</p></div>';
  } else if (open) {
    reg = '<div class="reg-state"><div class="reg-state__row"><strong>Registration</strong><span class="pill pill--open"><span class="pill__dot"></span>Open</span></div>' +
      (e.registration.deadlineText ? '<div class="reg-state__row"><span class="muted">Closes</span><span>' + F(e.registration.deadlineText) + '</span></div>' : '') +
      (seats ? '<div class="reg-state__row"><span class="muted">Seats</span><span>' + E(seats) + '</span></div>' : '') +
      (e.registration.note ? '<p class="muted" style="font-size:.85rem">' + F(e.registration.note) + '</p>' : '') + '</div>' +
      '<a class="btn btn--primary btn--block btn--lg" href="' + regUrl + '">' + I('ticket') + 'Register now</a>';
  } else if (isPast) {
    reg = '<div class="reg-state"><div class="reg-state__row"><strong>Registration</strong><span class="pill pill--closed">Closed</span></div><p class="muted" style="font-size:.88rem">This event is part of the NISC archive. Join the community to hear about the next one.</p></div>' +
      '<a class="btn btn--secondary btn--block" href="' + U('join.html') + '">' + I('user-plus') + 'Join NISC</a>';
  } else if (live) {
    var full = e.registration && e.registration.full;
    reg = '<div class="reg-state"><div class="reg-state__row"><strong>Registration</strong><span class="pill pill--closed">' + (full ? 'Fully booked' : 'Closed') + '</span></div><p class="muted" style="font-size:.88rem">' + (full ? 'All seats have been taken. Follow NISC Updates for the next event.' : 'Registration isn’t open for this event right now. Follow NISC Updates for news.') + '</p></div>';
  } else {
    reg = '<div class="reg-state"><div class="reg-state__row"><strong>Registration</strong><span class="pill pill--closed">Not open yet</span></div><p class="muted" style="font-size:.88rem">' + F((e.registration && e.registration.note) || 'Registration details will be announced in NISC Updates.') + '</p></div>' +
      (e.website && e.website.href ? '<a class="btn btn--primary btn--block" href="' + E(e.website.href) + '" target="_blank" rel="noopener noreferrer">' + I('globe') + 'Visit the official website</a>' : '');
  }
  var countdown = (start && st === 'upcoming' && !e.cancelled) ? '<div><p class="mono muted" style="font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Starts in</p><div class="countdown" data-countdown="' + start.getTime() + '"><div><strong data-u="d">0</strong><span>Days</span></div><div><strong data-u="h">0</strong><span>Hours</span></div><div><strong data-u="m">0</strong><span>Min</span></div><div><strong data-u="s">0</strong><span>Sec</span></div></div></div>' : '';
  var aside = '<div class="side-card"><h2>Event details</h2>' + countdown +
    '<dl class="dl-grid"><dt>Status</dt><dd>' + E(N.STATUS_LABELS[st]) + '</dd><dt>Date</dt><dd>' + F(N.eventDate(e)) + '</dd><dt>Time</dt><dd>' + F(N.eventTime(e)) + '</dd>' +
    '<dt>Venue</dt><dd>' + V(e.venue, 'N/A') + (e.venueMapUrl ? ' <a href="' + E(e.venueMapUrl) + '">Map ↗</a>' : '') + '</dd><dt>Organizer</dt><dd>' + F(e.organizer) + '</dd><dt>Type</dt><dd>' + E(N.TYPE_LABELS[e.type] || 'Event') + '</dd>' +
    (e.website && e.website.href ? '<dt>Website</dt><dd><a href="' + E(e.website.href) + '" target="_blank" rel="noopener noreferrer">Official site ↗</a></dd>' : '') + '</dl>' + reg + '</div>';
  if (milestone) {
    aside += '<div class="side-card side-card--plain"><span class="eyebrow">Part of our journey</span><h3>' + F(milestone.title) + '</h3><p class="text-2" style="font-size:.93rem">' + F(milestone.summary) + '</p><a class="link-arrow" href="' + U('discover/milestone.html?id=' + milestone.id) + '">Read the milestone story ' + I('arrow-right') + '</a></div>';
  }
  aside += '<div class="side-card side-card--plain"><h3>Share this event</h3><div class="share-row"><button class="btn btn--secondary btn--sm" type="button" data-share>' + I('share') + 'Share</button><button class="btn btn--secondary btn--sm" type="button" data-copy="' + E(location.href) + '">' + I('copy') + 'Copy link</button></div></div>';

  html += '<section class="section section--tight"><div class="container split"><div>' + main + '</div><aside class="sticky-aside" aria-label="Event summary">' + aside + '</aside></div></section>';

  /* ---------- Related ---------- */
  var related = N.visible(N.events).filter(function (x) { return x.id !== e.id; })
    .sort(function (a, b) { return (a.type === e.type ? 0 : 1) - (b.type === e.type ? 0 : 1); }).slice(0, 3);
  html += '<section class="section section--alt section--grid" id="related"><div class="container"><div class="section-head"><div class="section-head__text"><span class="eyebrow">Keep exploring</span><h2>Related events</h2></div><a class="btn btn--secondary" href="' + U('events/index.html') + '">All events ' + I('arrow-right', 'i--arrow') + '</a></div>' +
    '<div class="grid grid--3" data-reveal-stagger>' + (related.map(ui.eventCard).join('') || ui.empty({ icon: 'calendar', title: 'More events coming soon' })) + '</div></div></section>';

  root.innerHTML = html;
  N.enhance(root);

  /* Photos → lightbox */
  N.qsa('[data-photo]', root).forEach(function (btn) {
    btn.addEventListener('click', function () {
      N.lightbox.open(photos.map(function (p) {
        return { src: U(p.src), alt: P(p.alt), title: name, caption: p.caption, meta: [F(N.eventDate(e))] };
      }), +btn.getAttribute('data-photo'));
    });
  });

  /* Countdown */
  var cd = N.qs('[data-countdown]', root);
  if (cd) {
    var target = +cd.getAttribute('data-countdown');
    var tick = function () {
      var diff = Math.max(0, target - Date.now());
      var d = Math.floor(diff / 86400000), h = Math.floor(diff / 3600000) % 24, m = Math.floor(diff / 60000) % 60, s = Math.floor(diff / 1000) % 60;
      N.qs('[data-u="d"]', cd).textContent = d;
      N.qs('[data-u="h"]', cd).textContent = h;
      N.qs('[data-u="m"]', cd).textContent = m;
      N.qs('[data-u="s"]', cd).textContent = s;
    };
    tick();
    setInterval(tick, 1000);
  }

  /* Add to calendar (.ics) */
  var icsBtn = N.qs('[data-ics]', root);
  if (icsBtn) icsBtn.addEventListener('click', function () {
    var s = start, en = N.parseDate(e.end) || new Date(s.getTime() + 2 * 3600000);
    var f = function (d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); };
    var esc = function (t) { return String(t).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n'); };
    var day = function (d, add) { var x = new Date(d.getTime() + 5.75 * 3600000 + (add || 0) * 86400000); return x.toISOString().slice(0, 10).replace(/-/g, ''); };
    var when = e.allDay ? ['DTSTART;VALUE=DATE:' + day(s), 'DTEND;VALUE=DATE:' + day(en, 1)] : ['DTSTART:' + f(s), 'DTEND:' + f(en)];
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//NISC//Events//EN', 'BEGIN:VEVENT', 'UID:' + e.id + '@nisc',
      'DTSTAMP:' + f(new Date())].concat(when, ['SUMMARY:' + esc(name), 'LOCATION:' + esc(P(e.venue)),
      'DESCRIPTION:' + esc(P(e.summary) + ' ' + location.href), 'END:VEVENT', 'END:VCALENDAR']).join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = e.id + '.ics';
    document.body.appendChild(a); a.click(); a.remove();
    N.toast('Calendar file downloaded');
  });

  /* Anchor nav highlight */
  var links = N.qsa('.anchor-nav a', root);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(function (s) { var el = document.getElementById(s[0]); if (el) io.observe(el); });
  }
})();
