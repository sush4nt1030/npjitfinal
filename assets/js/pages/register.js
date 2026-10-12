/* NISC — register.js : event registration page (events/register.html?event=…). */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, I = N.icon, E = N.esc, F = N.fmt, V = N.val, U = N.url;
  var state = document.getElementById('reg-state');
  var layout = document.getElementById('reg-layout');
  var form = document.getElementById('registration-form');
  var events = N.visible(N.events || []);
  var id = N.param('event');

  function show(html) { state.innerHTML = html; N.enhance(state); }

  if (!id) {
    var open = events.filter(N.regOpen);
    show(open.length
      ? '<div class="section-head"><div class="section-head__text"><span class="eyebrow">Step 1</span><h2>Choose an event</h2><p class="lead">These events are accepting registrations right now.</p></div></div><div class="grid grid--3">' + open.map(ui.eventCard).join('') + '</div>'
      : ui.empty({ icon: 'ticket', title: 'No registrations are open right now', text: 'When the next NISC event opens for registration, it will appear here and in NISC Updates.', actions: [{ label: 'Join NISC to hear first', href: 'join.html', primary: true }, { label: 'Browse events', href: 'events/index.html' }] }));
    return;
  }

  var e = ui.byId(events, id);
  if (!e) {
    show(ui.empty({ icon: 'alert', title: 'We couldn’t find that event', text: 'The registration link may be outdated.', actions: [{ label: 'Browse events', href: 'events/index.html', primary: true }] }));
    return;
  }
  var name = N.eventName(e);
  var st = N.eventStatus(e);
  if (!N.regOpen(e) || e.cancelled) {
    N.setTitle('Register: ' + name);
    show(ui.empty(st === 'completed'
      ? { icon: 'archive', title: name + ' has already taken place', text: 'Registration is closed. You can still read about the event and see its highlights.', actions: [{ label: 'View the event', href: 'events/event.html?id=' + e.id, primary: true }, { label: 'Upcoming events', href: 'events/index.html#upcoming' }] }
      : e.cancelled ? { icon: 'alert', title: name + ' has been cancelled', text: 'This event won’t take place. Follow NISC Updates for news about the next one.', actions: [{ label: 'Upcoming events', href: 'events/index.html#upcoming', primary: true }, { label: 'NISC Updates', href: 'updates/index.html' }] }
      : e.live && e.registration && e.registration.full ? { icon: 'users', title: name + ' is fully booked', text: 'All seats have been taken. Join NISC to hear about the next event first.', actions: [{ label: 'View the event', href: 'events/event.html?id=' + e.id, primary: true }, { label: 'Join NISC', href: 'join.html' }] }
      : e.live ? { icon: 'clock', title: 'Registration is closed', text: 'Registration for ' + E(name) + ' isn’t open right now. Check NISC Updates for news.', actions: [{ label: 'View the event', href: 'events/event.html?id=' + e.id, primary: true }, { label: 'NISC Updates', href: 'updates/index.html' }] }
      : { icon: 'clock', title: 'Registration isn’t open yet', text: 'Registration for ' + E(name) + ' will open soon. Check NISC Updates for the announcement.', actions: [{ label: 'View the event', href: 'events/event.html?id=' + e.id, primary: true }, { label: 'NISC Updates', href: 'updates/index.html' }] }));
    return;
  }

  /* Registration is open */
  N.setTitle('Register: ' + name, 'Register for ' + name + ', a NISC event in Nepalgunj.');
  var h1 = document.querySelector('.page-hero__title');
  if (h1) h1.innerHTML = 'Register for <span class="gradient-text">' + F(e.title) + '</span>';
  var crumbEvent = document.querySelector('[data-crumb-event]');
  if (crumbEvent) { crumbEvent.href = N.eventUrl(e); crumbEvent.textContent = name; crumbEvent.parentNode.hidden = false; }

  var r = e.registration || {};
  document.getElementById('reg-summary').innerHTML =
    '<div class="side-card event-summary"><div class="event-summary__media">' + ui.eventMedia(e) + '</div><div class="event-summary__body">' +
      '<div class="cluster cluster--sm">' + ui.pill(st) + (e.template ? ui.templatePill : '') + '</div>' +
      '<h2>' + F(e.title) + '</h2>' +
      ui.metaList([['calendar', F(N.eventDate(e))], ['clock', F(N.eventTime(e))], ['map-pin', V(e.venue, 'N/A')], r.deadlineText ? ['alert', 'Register by ' + F(r.deadlineText)] : null, r.seats ? ['users', e.live && r.spotsLeft != null ? E(r.spotsLeft) + ' of ' + E(r.seats) + ' seats left' : E(r.seats) + ' seats'] : null]) +
      '<a class="link-arrow" href="' + N.eventUrl(e) + '">Event details ' + I('arrow-right') + '</a></div></div>' +
    '<div class="side-card side-card--plain"><h3>What happens next</h3><ol class="steps-mini"><li><span><strong>Submit this form.</strong> It takes about two minutes.</span></li><li><span><strong>Watch WhatsApp.</strong> Event updates are shared there.</span></li><li><span><strong>Show up and take part.</strong> Bring your curiosity.</span></li></ol></div>';

  form.querySelector('[name="event_id"]').value = e.id;
  form.querySelector('[name="event_name"]').value = name;
  var profiles = document.getElementById('reg-profiles');
  if (profiles) {
    profiles.hidden = !r.askProfiles;
    if (!r.askProfiles) N.qsa('input', profiles).forEach(function (i) { i.disabled = true; });
  }
  form.setAttribute('data-confirm-actions', 'View the event::events/event.html?id=' + e.id + '|All events::events/index.html');
  layout.hidden = false;
  N.enhance(layout);
  N.forms.init(form);
})();
