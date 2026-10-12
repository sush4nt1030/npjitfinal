/* NISC — gallery.js : the NISC Memory Wall (albums by event + lightbox). */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, I = N.icon, E = N.esc, F = N.fmt, P = N.plain, U = N.url;
  var G = N.gallery || { albums: [], photos: [] };
  var host = document.getElementById('gallery-wall');
  var chips = document.getElementById('gallery-albums');
  var current = 'all';
  if (location.hash.length > 1) {
    var h = decodeURIComponent(location.hash.slice(1));
    if (G.albums.some(function (a) { return a.id === h; })) current = h;
  }

  function albumInfo(a) {
    var ev = a.event && N.events ? ui.byId(N.events, a.event) : null;
    return { ev: ev, date: ev ? N.eventDate(ev) : a.dateText, name: ev ? N.eventName(ev) : P(a.title) };
  }
  var shown = [];
  function tile(p) {
    var a = ui.byId(G.albums, p.album) || {};
    var info = albumInfo(a);
    var i = shown.length;
    shown.push({
      src: U(p.src), alt: P(p.alt), title: info.name, caption: p.caption,
      meta: p.illustration ? ['Illustration'] : [F(info.date)], link: info.ev ? { href: N.eventUrl(info.ev), label: 'Go to the event page' } : null
    });
    return '<button type="button" class="masonry__item" data-i="' + i + '" aria-label="Open photo: ' + E(P(p.alt) || info.name) + '">' +
      '<img src="' + U(p.src) + '" alt="' + E(P(p.alt)) + '" loading="lazy"' + (p.w ? ' width="' + p.w + '" height="' + p.h + '"' : '') + '>' +
      '<span class="masonry__cap"><strong>' + E(p.caption || info.name) + '</strong><span>' + E(info.name) + (p.illustration ? ' · Illustration' : (P(info.date) && info.date !== 'N/A' ? ' · ' + P(info.date) : '')) + '</span></span></button>';
  }
  function render(animate) {
    shown = [];
    var albums = current === 'all' ? G.albums : G.albums.filter(function (a) { return a.id === current; });
    var out = albums.map(function (a) {
      var photos = G.photos.filter(function (p) { return p.album === a.id; });
      if (!photos.length) return '';
      var info = albumInfo(a);
      var ill = photos.every(function (p) { return p.illustration; });
      return '<div class="album-head" id="album-' + a.id + '"><div><h2>' + E(info.name) + '</h2><p class="text-2" style="margin-top:6px">' + F(a.description) + '</p>' + (a.note ? '<p class="muted" style="margin-top:4px;font-size:.85rem">' + I('info') + ' ' + E(a.note) + '</p>' : '') + '</div>' +
        ui.metaList([['calendar', F(info.date)], ['image', photos.length + (ill ? (photos.length === 1 ? ' illustration' : ' illustrations') : (photos.length === 1 ? ' photo' : ' photos'))], info.ev ? ['link', '<a href="' + N.eventUrl(info.ev) + '">Event page</a>'] : null], 'meta-list--inline') + '</div>' +
        '<div class="masonry' + (animate ? ' is-filtering' : '') + '">' + photos.map(tile).join('') + '</div>';
    }).join('');
    host.innerHTML = out || ui.empty({ icon: 'camera', title: 'No photos yet', text: 'Photos from NISC events will appear here.' });
    N.enhance(host);
  }
  if (chips) {
    ui.chips(chips, [{ value: 'all', label: 'All memories', count: G.photos.length }].concat(G.albums.map(function (a) {
      return { value: a.id, label: albumInfo(a).name, count: G.photos.filter(function (p) { return p.album === a.id; }).length };
    })), current);
    chips.addEventListener('click', function (e) {
      var c = e.target.closest('.chip');
      if (!c) return;
      current = c.getAttribute('data-value');
      N.qsa('.chip', chips).forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
      if (history.replaceState) history.replaceState(null, '', current === 'all' ? location.pathname : '#' + current);
      render(true);
    });
  }
  host.addEventListener('click', function (e) {
    var b = e.target.closest('.masonry__item');
    if (b) N.lightbox.open(shown, +b.getAttribute('data-i'));
  });
  var total = document.querySelector('[data-gallery-total]');
  if (total) total.textContent = G.photos.length;
  var unit = document.querySelector('[data-gallery-unit]');
  if (unit && G.photos.length) {
    var nIll = G.photos.filter(function (p) { return p.illustration; }).length;
    if (nIll === G.photos.length) unit.textContent = G.photos.length === 1 ? 'illustration' : 'illustrations';
    else if (nIll) unit.textContent = 'pictures';
  }
  render(false);
})();
