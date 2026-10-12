/* ==========================================================================
   NISC — core.js
   Shared layout (header, mobile navigation, footer), utilities, theme,
   scroll progress, back-to-top, reveal animations, counters, global
   search, lightbox, toast, share/copy. Loaded on every page.
   ========================================================================== */
(function () {
  'use strict';

  var N = window.NISC = window.NISC || {};
  var doc = document;
  var html = doc.documentElement;
  var body = doc.body;
  var ROOT = html.getAttribute('data-root') || '';
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  N.root = ROOT;

  /* ======================================================================
     Utilities
     ====================================================================== */
  N.url = function (p) {
    if (!p) return '';
    if (/^(https?:|mailto:|tel:|#|data:|\/\/)/i.test(p)) return p;
    return ROOT + p;
  };
  N.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var PH_G = /\[(?:ADD|UPDATE|CONFIRM|VERIFY)[^\]]*\]/g;
  N.isPh = function (s) { return typeof s === 'string' && /^\s*\[(?:ADD|UPDATE|CONFIRM|VERIFY)[^\]]*\]\s*$/.test(s); };
  N.hasPh = function (s) { return typeof s === 'string' && /\[(?:ADD|UPDATE|CONFIRM|VERIFY)[^\]]*\]/.test(s); };
  /** Escape text (any leftover placeholder tokens show as N/A). */
  N.fmt = function (s) {
    if (s == null) return '';
    return N.esc(s).replace(PH_G, 'N/A');
  };
  /** Like fmt, but shows "N/A" when the value is empty and a fallback is given. */
  N.val = function (s, fallback) {
    if (s == null || s === '') return fallback ? '<span class="na">N/A</span>' : '';
    return N.fmt(s);
  };
  /** Remove placeholders (for alt text, titles, search). */
  N.plain = function (s) { return String(s == null ? '' : s).replace(PH_G, '').replace(/\s+/g, ' ').replace(/^[\s—–:-]+|[\s—–:-]+$/g, '').trim(); };
  N.qs = function (sel, scope) { return (scope || doc).querySelector(sel); };
  N.qsa = function (sel, scope) { return Array.prototype.slice.call((scope || doc).querySelectorAll(sel)); };
  N.param = function (name) {
    var v = null;
    try { v = new URLSearchParams(location.search).get(name); } catch (e) { /* old browsers */ }
    if (!v && name === 'id' && location.hash.length > 1) v = decodeURIComponent(location.hash.slice(1));
    return v;
  };
  N.debounce = function (fn, ms) {
    var t;
    return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms || 150); };
  };
  N.visible = function (list) {
    list = list || [];
    return (N.site && N.site.showTemplates === false) ? list.filter(function (x) { return !x.template; }) : list.slice();
  };
  N.initials = function (name) {
    var p = N.plain(name).replace(/\([^)]*\)/g, ' ').split(/\s+/).filter(function (w) { return /^[\p{L}\p{N}]/u.test(w); });
    if (!p.length) return '';
    return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
  };
  N.setTitle = function (title, desc) {
    doc.title = title + ' · NISC';
    if (desc) {
      var m = N.qs('meta[name="description"]');
      if (m) m.setAttribute('content', desc);
    }
    var crumb = N.qs('[data-crumb-current]');
    if (crumb) crumb.textContent = title;
  };

  /* ---------- Dates (always shown in Nepal Time) ---------- */
  var TZ = 'Asia/Kathmandu';
  N.parseDate = function (v) {
    if (!v) return null;
    var d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  };
  function df(d, o) {
    try { return new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: TZ }, o)).format(d); }
    catch (e) { return d.toDateString(); }
  }
  N.fmtDate = function (d) { return df(d, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }); };
  N.fmtDateLong = function (d) { return df(d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); };
  N.fmtShort = function (d) { return df(d, { day: 'numeric', month: 'short', year: 'numeric' }); };
  N.fmtTime = function (d) { return df(d, { hour: 'numeric', minute: '2-digit', hour12: true }).replace(/\s?([ap])m/i, function (m, x) { return ' ' + x.toUpperCase() + 'M'; }); };
  N.fmtMonth = function (d) { return df(d, { month: 'short' }); };
  N.fmtDay = function (d) { return df(d, { day: 'numeric' }); };

  /* ---------- Events ---------- */
  N.TYPE_LABELS = { session: 'Session', workshop: 'Workshop', meetup: 'Meetup', competition: 'Competition', community: 'Community activity' };
  N.STATUS_LABELS = { upcoming: 'Upcoming', ongoing: 'Happening now', completed: 'Completed' };
  N.eventStatus = function (e) {
    var s = N.parseDate(e.start);
    if (s) {
      var en = N.parseDate(e.end);
      var now = Date.now();
      var end = en ? en.getTime() : s.getTime() + 3 * 3600 * 1000;
      if (now < s.getTime()) return 'upcoming';
      if (now <= end) return 'ongoing';
      return 'completed';
    }
    return e.status || 'upcoming';
  };
  N.eventName = function (e) { return N.isPh(e.title) || !N.plain(e.title) ? (e.label || 'NISC event') : N.plain(e.title); };
  N.eventDate = function (e) {
    var s = N.parseDate(e.start);
    if (e.allDay && e.dateText) return e.dateText;
    return s ? N.fmtDate(s) : (e.dateText || 'N/A');
  };
  N.eventTime = function (e) {
    var s = N.parseDate(e.start), en = N.parseDate(e.end);
    if (!s || e.allDay) return e.timeText || 'N/A';
    return N.fmtTime(s) + (en ? ' – ' + N.fmtTime(en) : '') + ' NPT';
  };
  N.regOpen = function (e) { return !!(e.registration && e.registration.open) && N.eventStatus(e) !== 'completed'; };
  N.eventUrl = function (e) { return N.url('events/event.html?id=' + encodeURIComponent(e.id)); };
  N.findEvent = function (id) { return (N.events || []).filter(function (e) { return e.id === id; })[0]; };

  /* ---------- Load data files on demand (search, cross-links) ---------- */
  N.loadData = function (names) {
    return Promise.all(names.map(function (n) {
      if (N[n]) return Promise.resolve();
      return new Promise(function (resolve) {
        var s = doc.createElement('script');
        s.src = ROOT + 'assets/js/data/' + n + '.js';
        s.onload = s.onerror = function () { resolve(); };
        doc.head.appendChild(s);
      });
    }));
  };

  /* ======================================================================
     Theme
     ====================================================================== */
  function effectiveTheme() {
    var t = html.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function syncThemeMeta() {
    var m = N.qs('meta[name="theme-color"]');
    if (m) m.setAttribute('content', effectiveTheme() === 'dark' ? '#06112B' : '#F5F9FF');
    N.qsa('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-label', effectiveTheme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }
  N.toggleTheme = function () {
    var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    try { localStorage.setItem('nisc-theme', next); } catch (e) { /* storage unavailable */ }
    syncThemeMeta();
  };

  /* ======================================================================
     Header, mobile navigation, footer
     ====================================================================== */
  var currentPath = body.getAttribute('data-path') || '';
  function isCurrent(href) { return href && href.indexOf('#') === -1 && href === currentPath; }
  function cur(href) { return isCurrent(href) ? ' aria-current="page"' : ''; }
  var LOGO = function (cls, eager) {
    return '<img class="' + cls + '" src="' + ROOT + 'assets/img/brand/nisc-logo-480.png" alt="NISC — Nepalgunj IT Students Community" width="480" height="253"' + (eager ? ' fetchpriority="high"' : ' loading="lazy"') + '>';
  };

  function menuItems(item) {
    var list = item.menu.slice();
    var hasHub = list.some(function (m) { return m.href === item.href; });
    if (item.mega && !hasHub) list.unshift({ label: item.label + ' overview', href: item.href, icon: 'grid', desc: 'Start here' });
    return list;
  }

  function renderHeader() {
    var host = doc.getElementById('site-header');
    if (!host) return;
    var sec = body.getAttribute('data-section') || '';
    var items = (N.nav || []).map(function (item, i) {
      var active = item.section === sec;
      if (!item.menu) {
        return '<li class="nav-item"><a class="nav-link' + (active ? ' is-active' : '') + '" href="' + N.url(item.href) + '"' + cur(item.href) + '>' + N.esc(item.label) + '</a></li>';
      }
      var pid = 'nav-panel-' + i;
      var links = menuItems(item).map(function (m) {
        return '<li><a class="nav-panel__link" href="' + N.url(m.href) + '"' + cur(m.href) + '>' +
          '<span class="nav-panel__icon">' + N.icon(m.icon) + '</span>' +
          '<span><span class="nav-panel__title">' + N.esc(m.label) + '</span><span class="nav-panel__desc">' + N.esc(m.desc || '') + '</span></span></a></li>';
      }).join('');
      var f = item.feature;
      var feature = f ? '<a class="nav-panel__feature" href="' + N.url(f.href) + '"><span class="eyebrow">' + N.esc(f.eyebrow) + '</span><strong>' + N.esc(f.title) + '</strong><span>' + N.esc(f.text) + '</span><span class="link-arrow" style="color:#7FD0F8">Open the timeline ' + N.icon('arrow-right') + '</span></a>' : '';
      return '<li class="nav-item' + (item.mega ? ' nav-item--mega' : '') + '" data-dropdown>' +
        '<button class="nav-link' + (active ? ' is-active' : '') + '" type="button" aria-expanded="false" aria-controls="' + pid + '">' + N.esc(item.label) + N.icon('chevron-down', 'i--chev') + '</button>' +
        '<div class="nav-panel" id="' + pid + '"><ul class="nav-panel__grid" role="list">' + links + '</ul>' + feature + '</div></li>';
    }).join('');

    host.innerHTML =
      '<div class="container container--wide nav-bar">' +
        '<a class="brand" href="' + ROOT + 'index.html" aria-label="NISC home">' + LOGO('brand__logo', true) +
          '<span class="brand__text" aria-hidden="true"><span>Nepalgunj IT</span><span>Students Community</span></span></a>' +
        '<nav class="primary-nav" aria-label="Primary"><ul class="nav-list">' + items + '</ul></nav>' +
        '<div class="nav-actions">' +
          '<button class="search-trigger" type="button" data-search-open aria-label="Search NISC">' + N.icon('search') + '<span class="search-trigger__label">Search</span><span class="kbd" aria-hidden="true">/</span></button>' +
          '<button class="icon-btn theme-toggle" type="button" data-theme-toggle aria-label="Switch theme">' + N.icon('sun', 'i--sun') + N.icon('moon', 'i--moon') + '</button>' +
          '<a class="btn btn--primary btn--sm nav-join" href="' + ROOT + 'join.html"' + cur('join.html') + '>Join NISC</a>' +
          '<button class="icon-btn nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">' + N.icon('menu') + '</button>' +
        '</div>' +
      '</div>';

    // Mobile navigation lives outside the header (fixed positioning).
    var sub = (N.nav || []).map(function (item) {
      var active = item.section === sec;
      if (!item.menu) {
        return '<li><a class="m-link' + (active ? ' is-active' : '') + '" href="' + N.url(item.href) + '"' + cur(item.href) + '>' + N.esc(item.label) + N.icon('arrow-right') + '</a></li>';
      }
      var links = menuItems(item).map(function (m) {
        return '<li><a href="' + N.url(m.href) + '"' + cur(m.href) + '>' + N.icon(m.icon) + N.esc(m.label) + '</a></li>';
      }).join('');
      return '<li><details class="m-group' + (active ? ' is-active' : '') + '"' + (active ? ' open' : '') + '><summary>' + N.esc(item.label) + N.icon('chevron-down') + '</summary><ul class="m-sub">' + links + '</ul></details></li>';
    }).join('');
    var mobile = doc.createElement('div');
    mobile.className = 'mobile-nav';
    mobile.id = 'mobile-nav';
    mobile.hidden = true;
    mobile.innerHTML =
      '<div class="mobile-nav__backdrop" data-close-mobile></div>' +
      '<div class="mobile-nav__panel" role="dialog" aria-modal="true" aria-label="Site menu">' +
        '<div class="mobile-nav__head"><a class="brand" href="' + ROOT + 'index.html" aria-label="NISC home">' + LOGO('brand__logo') + '</a>' +
        '<button class="icon-btn" type="button" data-close-mobile aria-label="Close menu">' + N.icon('x') + '</button></div>' +
        '<div class="mobile-nav__body">' +
          '<button class="mobile-nav__search" type="button" data-search-open>' + N.icon('search') + 'Search events, projects, resources…</button>' +
          '<ul class="m-list">' + sub + '</ul>' +
        '</div>' +
        '<div class="mobile-nav__foot">' +
          '<a class="btn btn--primary btn--block" href="' + ROOT + 'join.html">' + N.icon('user-plus') + 'Join NISC — it’s free</a>' +
          '<button class="btn btn--secondary btn--block theme-toggle" type="button" data-theme-toggle>' + N.icon('sun', 'i--sun') + N.icon('moon', 'i--moon') + 'Switch light / dark</button>' +
        '</div>' +
      '</div>';
    body.appendChild(mobile);
  }

  function socialLinks(links, cls) {
    var labels = { facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn', github: 'GitHub', youtube: 'YouTube', tiktok: 'TikTok', website: 'Website', email: 'Email' };
    var icons = { website: 'globe', email: 'mail' };
    return Object.keys(links || {}).filter(function (k) { return links[k]; }).map(function (k) {
      var href = k === 'email' ? 'mailto:' + links[k] : links[k];
      return '<a class="' + (cls || '') + '" href="' + N.esc(href) + '" target="_blank" rel="noopener noreferrer" aria-label="' + labels[k] + ' (opens in a new tab)">' + N.icon(icons[k] || k) + '</a>';
    }).join('');
  }
  N.socialLinks = socialLinks;

  function renderFooter() {
    var host = doc.getElementById('site-footer');
    if (!host) return;
    var s = N.site || {};
    var social = socialLinks(s.social || {});
    var col = function (title, links) {
      return '<div class="footer-col"><h2>' + title + '</h2><ul>' + links.map(function (l) {
        return '<li><a href="' + N.url(l[1]) + '">' + l[0] + '</a></li>';
      }).join('') + '</ul></div>';
    };
    host.innerHTML =
      '<div class="container container--wide">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<img class="footer-brand__logo" src="' + ROOT + 'assets/img/brand/nisc-logo-480.png" alt="NISC logo" width="480" height="253" loading="lazy">' +
            '<p class="footer-tagline">' + N.esc(s.tagline || 'Learn. Connect. Build. Grow.') + '</p>' +
            '<p>A digital home for the Nepalgunj IT student community. Free to join, open to every curious student.</p>' +
            '<p>' + N.icon('map-pin') + ' ' + N.esc(s.location || 'Nepalgunj, Nepal') + '</p>' +
            (social ? '<div class="footer-social">' + social + '</div>' : '') +
          '</div>' +
          col('Discover', [['What is NISC', 'discover/what-is-nisc.html'], ['Our Story', 'discover/our-story.html'], ['Our Journey', 'discover/our-journey.html'], ['Mission &amp; Vision', 'discover/mission-vision.html'], ['Our Values', 'discover/values.html'], ['Our Impact', 'discover/impact.html']]) +
          col('Take part', [['Events', 'events/index.html'], ['Register for an event', 'events/register.html'], ['Join NISC', 'join.html'], ['Volunteer', 'join.html#contribute'], ['Share a project', 'contact.html?topic=project'], ['Share an opportunity', 'contact.html?topic=opportunity']]) +
          col('Explore', [['Community', 'community/index.html'], ['Projects', 'projects/index.html'], ['Opportunities', 'opportunities/index.html'], ['Learning Hub', 'resources/index.html'], ['Student Stories', 'community/stories.html'], ['NISC Updates', 'updates/index.html'], ['Gallery', 'gallery/index.html'], ['Team', 'team/index.html']]) +
          col('Help', [['FAQ', 'faq.html'], ['Contact', 'contact.html'], ['Search', 'search.html'], ['Code of Conduct', 'code-of-conduct.html'], ['Privacy Policy', 'privacy-policy.html']]) +
        '</div>' +
        '<p class="footer-word" aria-hidden="true">NISC</p>' +
        '<div class="footer-bottom">' +
          '<span>© ' + new Date().getFullYear() + ' Nepalgunj IT Students Community (NISC)</span>' +
          '<span>Built for the Nepalgunj IT student community · <a href="' + ROOT + 'privacy-policy.html">Privacy</a> · <a href="' + ROOT + 'code-of-conduct.html">Code of Conduct</a></span>' +
        '</div>' +
      '</div>';
  }

  /* ---------- Dropdowns ---------- */
  function initDropdowns() {
    var items = N.qsa('[data-dropdown]');
    var canHover = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
    function setOpen(li, open) {
      li.classList.toggle('is-open', open);
      li.querySelector('button').setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    function closeAll(except) { items.forEach(function (li) { if (li !== except) setOpen(li, false); }); }
    items.forEach(function (li) {
      var btn = li.querySelector('button');
      var timer;
      btn.addEventListener('click', function () {
        if (li.getAttribute('data-hover-open') === '1') { li.removeAttribute('data-hover-open'); setOpen(li, true); return; }
        var open = !li.classList.contains('is-open');
        closeAll(li);
        setOpen(li, open);
      });
      if (canHover) {
        li.addEventListener('mouseenter', function () {
          clearTimeout(timer);
          if (!li.classList.contains('is-open')) li.setAttribute('data-hover-open', '1');
          closeAll(li);
          setOpen(li, true);
        });
        li.addEventListener('mouseleave', function () {
          timer = setTimeout(function () { li.removeAttribute('data-hover-open'); setOpen(li, false); }, 180);
        });
      }
      li.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && li.classList.contains('is-open')) { setOpen(li, false); btn.focus(); }
      });
      li.addEventListener('focusout', function (e) {
        if (e.relatedTarget && !li.contains(e.relatedTarget)) setOpen(li, false);
      });
    });
    doc.addEventListener('click', function (e) { if (!e.target.closest('[data-dropdown]')) closeAll(); });
  }

  /* ---------- Focus trap helper ---------- */
  N.trapFocus = function (container, e) {
    if (e.key !== 'Tab') return;
    var f = N.qsa('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', container)
      .filter(function (el) { return el.offsetParent !== null || el === doc.activeElement; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  /* ---------- Mobile navigation ---------- */
  function initMobileNav() {
    var nav = doc.getElementById('mobile-nav');
    var toggle = N.qs('.nav-toggle');
    if (!nav || !toggle) return;
    var panel = N.qs('.mobile-nav__panel', nav);
    function open() {
      nav.hidden = false;
      void nav.offsetWidth;
      nav.classList.add('is-open');
      body.classList.add('is-locked');
      toggle.setAttribute('aria-expanded', 'true');
      setTimeout(function () { var c = N.qs('[data-close-mobile].icon-btn', nav); if (c) c.focus(); }, 60);
    }
    function close(restore) {
      nav.classList.remove('is-open');
      body.classList.remove('is-locked');
      toggle.setAttribute('aria-expanded', 'false');
      setTimeout(function () { nav.hidden = true; }, reduceMotion ? 0 : 320);
      if (restore !== false) toggle.focus();
    }
    N.closeMobileNav = function () { if (!nav.hidden) close(false); };
    toggle.addEventListener('click', open);
    nav.addEventListener('click', function (e) {
      if (e.target.closest('[data-close-mobile]')) close();
      else if (e.target.closest('a[href]')) close(false);
    });
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      N.trapFocus(panel, e);
    });
    window.addEventListener('resize', N.debounce(function () { if (innerWidth > 1320 && !nav.hidden) close(false); }, 200));
  }

  /* ---------- Scroll progress, header state, back to top ---------- */
  function initScroll() {
    var header = doc.getElementById('site-header');
    var bar = doc.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    body.appendChild(bar);
    var top = doc.createElement('button');
    top.type = 'button';
    top.className = 'to-top';
    top.setAttribute('aria-label', 'Back to top');
    top.innerHTML = '<svg class="ring" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="26"></circle></svg>' + N.icon('arrow-up');
    body.appendChild(top);
    top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      var skip = N.qs('.skip-link');
      if (skip) skip.focus({ preventScroll: true });
    });
    var ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      var h = doc.documentElement.scrollHeight - innerHeight;
      var p = h > 0 ? Math.min(1, Math.max(0, y / h)) : 0;
      bar.style.setProperty('--progress', p.toFixed(4));
      top.style.setProperty('--progress', p.toFixed(4));
      if (header) header.classList.toggle('is-scrolled', y > 8);
      top.classList.toggle('is-visible', y > 700);
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', N.debounce(update, 150));
    update();
  }

  /* ---------- Reveal on scroll ---------- */
  var revealObserver = null;
  N.reveal = function (scope) {
    var els = N.qsa('[data-reveal]:not(.is-in)', scope);
    if (!els.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    N.qsa('[data-reveal-stagger]', scope).forEach(function (group) {
      N.qsa(':scope > [data-reveal]', group).forEach(function (el, i) { el.style.setProperty('--reveal-delay', Math.min(i, 8) * 70 + 'ms'); });
    });
    var vh = innerHeight;
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add('is-in');
    });
    html.classList.add('js-reveal');
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); revealObserver.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });
    }
    els.forEach(function (el) { if (!el.classList.contains('is-in')) revealObserver.observe(el); });
  };

  /* ---------- Animated counters ---------- */
  N.counters = function (scope) {
    var els = N.qsa('[data-count]', scope).filter(function (el) { return !el._counted; });
    if (!els.length || reduceMotion || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var el = en.target, target = parseFloat(el.getAttribute('data-count'));
        if (isNaN(target)) return;
        var start = performance.now(), dur = 1300, suffix = el.getAttribute('data-suffix') || '';
        (function step(t) {
          var p = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * e).toLocaleString('en-US') + suffix;
          if (p < 1) requestAnimationFrame(step);
        })(start);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { el._counted = true; io.observe(el); });
  };

  /* ---------- External links open safely in a new tab ---------- */
  N.externalize = function (scope) {
    N.qsa('a[href^="http"]', scope).forEach(function (a) {
      if (a.host && a.host !== location.host) {
        a.target = '_blank';
        var rel = (a.getAttribute('rel') || '').split(' ');
        if (rel.indexOf('noopener') < 0) rel.push('noopener');
        if (rel.indexOf('noreferrer') < 0) rel.push('noreferrer');
        a.setAttribute('rel', rel.join(' ').trim());
      }
    });
  };

  /** Run after rendering dynamic content. */
  N.enhance = function (scope) {
    N.reveal(scope);
    N.counters(scope);
    N.externalize(scope);
  };

  /* ======================================================================
     Toast, copy, share
     ====================================================================== */
  N.toast = function (msg, icon) {
    var region = N.qs('.toast-region');
    if (!region) {
      region = doc.createElement('div');
      region.className = 'toast-region';
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      body.appendChild(region);
    }
    var t = doc.createElement('div');
    t.className = 'toast';
    t.innerHTML = N.icon(icon || 'check-circle') + '<span>' + N.esc(msg) + '</span>';
    region.appendChild(t);
    setTimeout(function () { t.classList.add('is-leaving'); setTimeout(function () { t.remove(); }, 240); }, 2800);
  };
  function copyFallback(text) {
    var ta = doc.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = doc.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }
  N.copy = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return copyFallback(text); });
    }
    return Promise.resolve(copyFallback(text));
  };
  N.share = function (data) {
    data = data || { title: doc.title, url: location.href };
    if (navigator.share) { navigator.share(data).catch(function () { /* cancelled */ }); return; }
    N.copy(data.url).then(function (ok) { N.toast(ok ? 'Link copied to clipboard' : 'Copy the link from your address bar', ok ? 'check-circle' : 'info'); });
  };

  /* ======================================================================
     Lightbox
     ====================================================================== */
  N.lightbox = (function () {
    var root, items = [], idx = 0, lastFocus, img, count, cap, prev, next, closeBtn, touchX = null;
    function build() {
      root = doc.createElement('div');
      root.className = 'lightbox';
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-modal', 'true');
      root.setAttribute('aria-label', 'Photo viewer');
      root.innerHTML =
        '<div class="lightbox__top"><span class="lightbox__count" aria-live="polite"></span>' +
        '<button class="lightbox__btn" type="button" data-lb-close aria-label="Close photo viewer">' + N.icon('x') + '</button></div>' +
        '<div class="lightbox__stage"><img alt="">' +
        '<button class="lightbox__btn lightbox__prev" type="button" aria-label="Previous photo">' + N.icon('chevron-left') + '</button>' +
        '<button class="lightbox__btn lightbox__next" type="button" aria-label="Next photo">' + N.icon('chevron-right') + '</button></div>' +
        '<div class="lightbox__caption"></div>';
      img = N.qs('img', root);
      count = N.qs('.lightbox__count', root);
      cap = N.qs('.lightbox__caption', root);
      prev = N.qs('.lightbox__prev', root);
      next = N.qs('.lightbox__next', root);
      closeBtn = N.qs('[data-lb-close]', root);
      closeBtn.addEventListener('click', close);
      prev.addEventListener('click', function () { go(-1); });
      next.addEventListener('click', function () { go(1); });
      root.addEventListener('click', function (e) { if (e.target === root || e.target.classList.contains('lightbox__stage')) close(); });
      root.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') go(-1);
        else if (e.key === 'ArrowRight') go(1);
        N.trapFocus(root, e);
      });
      root.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
      root.addEventListener('touchend', function (e) {
        if (touchX == null) return;
        var dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX = null;
      });
    }
    function render() {
      var it = items[idx];
      img.src = it.src;
      img.alt = it.alt || '';
      count.textContent = (idx + 1) + ' / ' + items.length;
      var multi = items.length > 1;
      prev.hidden = next.hidden = !multi;
      cap.innerHTML =
        (it.title ? '<h2>' + N.fmt(it.title) + '</h2>' : '') +
        (it.meta && it.meta.length ? '<div class="meta">' + it.meta.map(function (m) { return '<span>' + m + '</span>'; }).join('') + '</div>' : '') +
        (it.caption ? '<p>' + N.fmt(it.caption) + '</p>' : '') +
        (it.link ? '<p><a href="' + it.link.href + '">' + N.esc(it.link.label) + ' →</a></p>' : '');
    }
    function go(d) { if (items.length < 2) return; idx = (idx + d + items.length) % items.length; render(); }
    function open(list, i) {
      items = list; idx = i || 0;
      lastFocus = doc.activeElement;
      if (!root) build();
      render();
      body.appendChild(root);
      body.classList.add('is-locked');
      closeBtn.focus();
    }
    function close() {
      if (!root || !root.parentNode) return;
      root.remove();
      body.classList.remove('is-locked');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    return { open: open, close: close };
  })();

  /* ======================================================================
     Global search
     ====================================================================== */
  N.SEARCH_TYPES = {
    page: { label: 'Pages', icon: 'file' },
    event: { label: 'Events', icon: 'calendar' },
    milestone: { label: 'Our Journey', icon: 'route' },
    project: { label: 'Projects', icon: 'rocket' },
    opportunity: { label: 'Opportunities', icon: 'briefcase' },
    resource: { label: 'Learning Hub', icon: 'book' },
    update: { label: 'Updates', icon: 'megaphone' },
    story: { label: 'Student Stories', icon: 'quote' },
    member: { label: 'Team', icon: 'user' }
  };
  N.SEARCH_DATA = ['events', 'timeline', 'team', 'projects', 'opportunities', 'resources', 'updates', 'stories'];

  N.buildIndex = function () {
    var out = [];
    function add(type, title, sub, url, text) {
      out.push({ type: type, title: title, sub: sub || '', url: url, hay: (title + ' ' + (sub || '') + ' ' + (text || '')).toLowerCase() });
    }
    var P = N.plain;
    (N.pages || []).forEach(function (p) { add('page', p.title, p.desc, p.url, p.keywords); });
    N.visible(N.events).forEach(function (e) {
      add('event', N.eventName(e), [N.TYPE_LABELS[e.type], N.STATUS_LABELS[N.eventStatus(e)], P(N.eventDate(e))].filter(Boolean).join(' · '),
        'events/event.html?id=' + e.id, [e.label, P(e.topic), P(e.summary), P(e.venue), (e.tags || []).join(' '), e.type, 'event'].join(' '));
    });
    if (N.timeline) {
      var phases = {};
      N.timeline.phases.forEach(function (p) { phases[p.id] = p.label; });
      N.timeline.milestones.forEach(function (m) {
        add('milestone', P(m.title) || 'Upcoming milestone', phases[m.phase] || '', 'discover/milestone.html?id=' + m.id, P(m.summary) + ' timeline milestone history');
      });
    }
    if (N.team) {
      var roles = {};
      (N.team.roles || []).forEach(function (r) { roles[r.id] = r.title; });
      (N.team.current || []).forEach(function (m) {
        var role = roles[m.role] || m.roleTitle || '';
        add('member', P(m.name) || role, role, 'team/member.html?id=' + m.id, (m.skills || []).map(P).join(' ') + ' team lead');
      });
      (N.team.alumni || []).forEach(function (m) { add('member', P(m.name), (m.roleTitle || '') + ' · ' + (m.term || ''), 'team/member.html?id=' + m.id, 'alumni past team'); });
    }
    N.visible(N.projects).forEach(function (p) {
      add('project', P(p.title) || 'Project template', [p.category, (p.tech || []).map(P).filter(Boolean).join(', ')].filter(Boolean).join(' · '), 'projects/project.html?id=' + p.id, P(p.tagline) + ' ' + P(p.problem) + ' project');
    });
    N.visible(N.opportunities).forEach(function (o) {
      add('opportunity', P(o.title) || 'Opportunity template', [o.type, P(o.organization)].filter(Boolean).join(' · '), 'opportunities/opportunity.html?id=' + o.id, P(o.description) + ' ' + o.type + ' opportunity');
    });
    if (N.resources) {
      var cats = {};
      (N.resourceCategories || []).forEach(function (c) { cats[c.id] = c.name; });
      N.resources.forEach(function (r) {
        add('resource', r.title, [cats[r.category], r.source].filter(Boolean).join(' · '), 'resources/resource.html?id=' + r.id, r.summary + ' ' + (r.learn || []).join(' ') + ' ' + r.type + ' learning resource');
      });
    }
    (N.updates || []).forEach(function (u) { add('update', P(u.title), u.category, 'updates/update.html?id=' + u.id, P(u.excerpt) + ' news announcement'); });
    N.visible(N.stories).forEach(function (s) { add('story', P(s.title) || 'Student story template', P(s.name) || s.theme, 'community/story.html?id=' + s.id, P(s.quote) + ' ' + s.theme + ' story'); });
    return out;
  };

  N.search = function (q, index) {
    var terms = String(q || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    var res = [];
    index.forEach(function (item) {
      var score = 0, t = item.title.toLowerCase();
      for (var i = 0; i < terms.length; i++) {
        var term = terms[i];
        if (item.hay.indexOf(term) === -1) return;
        if (t.indexOf(term) === 0) score += 8;
        else if (t.indexOf(term) > -1) score += 5;
        else if (item.sub.toLowerCase().indexOf(term) > -1) score += 2;
        else score += 1;
      }
      if (item.type === 'page') score += 0.5;
      res.push(Object.assign({ score: score }, item));
    });
    return res.sort(function (a, b) { return b.score - a.score; });
  };
  N.highlight = function (text, q) {
    var out = N.esc(text);
    String(q || '').trim().split(/\s+/).filter(function (t) { return t.length > 1; }).forEach(function (t) {
      var re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
      out = out.replace(re, '<mark>$1</mark>');
    });
    return out;
  };

  var searchIndex = null;
  N.getIndex = function () {
    if (searchIndex) return Promise.resolve(searchIndex);
    return N.loadData(N.SEARCH_DATA).then(function () { searchIndex = N.buildIndex(); return searchIndex; });
  };

  function initSearchOverlay() {
    var overlay, input, results, lastFocus, active = -1, flat = [];
    var SUGGEST = [['Events', 'events/index.html'], ['Join NISC', 'join.html'], ['Our Journey', 'discover/our-journey.html'], ['Learning Hub', 'resources/index.html'], ['Opportunities', 'opportunities/index.html'], ['Team', 'team/index.html']];
    function build() {
      overlay = doc.createElement('div');
      overlay.className = 'search-overlay';
      overlay.innerHTML =
        '<div class="search-overlay__backdrop" data-search-close></div>' +
        '<div class="search-overlay__panel" role="dialog" aria-modal="true" aria-label="Search NISC">' +
          '<div class="search-overlay__bar">' + N.icon('search') +
            '<input class="search-overlay__input" id="global-search-input" type="search" placeholder="Search events, projects, resources, people…" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="global-search-results" aria-autocomplete="list" aria-label="Search NISC">' +
            '<button class="icon-btn" type="button" data-search-close aria-label="Close search">' + N.icon('x') + '</button>' +
          '</div>' +
          '<div class="search-overlay__body" id="global-search-results" role="listbox" aria-label="Search results"></div>' +
          '<div class="search-overlay__foot"><span><span class="kbd">↑</span><span class="kbd">↓</span> navigate <span class="kbd">↵</span> open <span class="kbd">esc</span> close</span><a href="' + ROOT + 'search.html" data-all-results>See all results →</a></div>' +
        '</div>';
      input = N.qs('input', overlay);
      results = N.qs('.search-overlay__body', overlay);
      overlay.addEventListener('click', function (e) { if (e.target.closest('[data-search-close]')) close(); });
      input.addEventListener('input', N.debounce(run, 90));
      overlay.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { e.preventDefault(); close(); return; }
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          if (!flat.length) return;
          e.preventDefault();
          active = (active + (e.key === 'ArrowDown' ? 1 : -1) + flat.length) % flat.length;
          mark();
        } else if (e.key === 'Enter' && doc.activeElement === input) {
          e.preventDefault();
          if (active > -1 && flat[active]) location.href = flat[active].href;
          else if (input.value.trim()) location.href = ROOT + 'search.html?q=' + encodeURIComponent(input.value.trim());
        }
        N.trapFocus(N.qs('.search-overlay__panel', overlay), e);
      });
    }
    function mark() {
      flat.forEach(function (a, i) {
        a.setAttribute('aria-selected', i === active ? 'true' : 'false');
        if (i === active) { input.setAttribute('aria-activedescendant', a.id); a.scrollIntoView({ block: 'nearest' }); }
      });
      if (active < 0) input.removeAttribute('aria-activedescendant');
    }
    function suggestions() {
      results.innerHTML = '<div class="sr-suggest"><p class="sr-group__title">Popular</p><div class="chip-group">' +
        SUGGEST.map(function (s) { return '<a class="chip" href="' + ROOT + s[1] + '">' + s[0] + '</a>'; }).join('') +
        '</div></div>';
      flat = []; active = -1; mark();
    }
    function run() {
      var q = input.value.trim();
      N.qs('[data-all-results]', overlay).href = ROOT + 'search.html' + (q ? '?q=' + encodeURIComponent(q) : '');
      if (!q) { suggestions(); return; }
      N.getIndex().then(function (index) {
        var res = N.search(q, index).slice(0, 14);
        if (!res.length) {
          results.innerHTML = '<div class="sr-empty"><p><strong>No results for “' + N.esc(q) + '”.</strong></p><p class="muted">Try a broader word like “events”, “web” or “join”.</p></div>';
          flat = []; active = -1; mark();
          return;
        }
        var groups = {};
        res.forEach(function (r) { (groups[r.type] = groups[r.type] || []).push(r); });
        var n = 0;
        results.innerHTML = Object.keys(groups).map(function (type) {
          var T = N.SEARCH_TYPES[type];
          return '<div class="sr-group"><p class="sr-group__title">' + T.label + '</p><ul class="sr-list" role="presentation">' +
            groups[type].slice(0, 5).map(function (r) {
              var id = 'sr-opt-' + (n++);
              return '<li role="presentation"><a class="sr-item" id="' + id + '" role="option" aria-selected="false" href="' + N.url(r.url) + '">' +
                '<span class="sr-item__icon">' + N.icon(T.icon) + '</span>' +
                '<span class="sr-item__text"><span class="sr-item__title">' + N.highlight(r.title, q) + '</span><span class="sr-item__sub">' + N.esc(r.sub) + '</span></span>' +
                N.icon('arrow-right', 'sr-item__go') + '</a></li>';
            }).join('') + '</ul></div>';
        }).join('');
        flat = N.qsa('.sr-item', results);
        active = 0;
        mark();
      });
    }
    function open() {
      if (N.closeMobileNav) N.closeMobileNav();
      lastFocus = doc.activeElement;
      if (!overlay) build();
      body.appendChild(overlay);
      body.classList.add('is-locked');
      input.value = '';
      suggestions();
      setTimeout(function () { input.focus(); }, 20);
      N.getIndex();
    }
    function close() {
      if (!overlay || !overlay.parentNode) return;
      overlay.remove();
      body.classList.remove('is-locked');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    N.openSearch = open;
    doc.addEventListener('click', function (e) {
      var t = e.target.closest('[data-search-open]');
      if (t) { e.preventDefault(); open(); }
    });
    doc.addEventListener('keydown', function (e) {
      var tag = (e.target.tagName || '').toLowerCase();
      var typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
      if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        if (overlay && overlay.parentNode) return;
        e.preventDefault();
        open();
      }
    });
  }

  /* ======================================================================
     Fill site-wide values from site.js ([data-site], [data-site-stat])
     ====================================================================== */
  function fillSiteValues() {
    var s = N.site || {};
    N.qsa('[data-site-stat]').forEach(function (el) {
      var v = (s.stats || {})[el.getAttribute('data-site-stat')];
      if (v != null) { el.textContent = v; if (el.hasAttribute('data-count')) el.setAttribute('data-count', v); }
    });
    N.qsa('[data-site]').forEach(function (el) {
      var k = el.getAttribute('data-site');
      var v = s[k];
      // Missing value: hide its block ([data-site-block]) or show the element's data-empty text (default "N/A").
      function empty() {
        var block = el.closest('[data-site-block]');
        if (block) { block.hidden = true; return; }
        el.textContent = el.getAttribute('data-empty') || 'N/A';
      }
      if (k === 'social') {
        var links = socialLinks(v || {}, 'icon-btn');
        if (links) el.innerHTML = '<span class="cluster cluster--sm">' + links + '</span>'; else empty();
        return;
      }
      if (!v) { empty(); return; }
      if (k === 'email') el.innerHTML = '<a href="mailto:' + N.esc(v) + '">' + N.esc(v) + '</a> <button class="btn btn--ghost btn--sm" type="button" data-copy="' + N.esc(v) + '" aria-label="Copy email address">' + N.icon('copy') + '</button>';
      else if (k === 'phone') el.innerHTML = '<a href="tel:' + N.esc(v.replace(/\s/g, '')) + '">' + N.esc(v) + '</a>';
      else if (k === 'whatsappCommunity') el.innerHTML = '<a href="' + N.esc(v) + '" target="_blank" rel="noopener noreferrer">Open the NISC WhatsApp community</a>';
      else el.textContent = v;
    });
  }

  /* ======================================================================
     Small declarative helpers
     ====================================================================== */
  function initHelpers() {
    doc.addEventListener('click', function (e) {
      var t = e.target.closest('[data-theme-toggle]');
      if (t) { N.toggleTheme(); return; }
      var c = e.target.closest('[data-copy]');
      if (c) {
        N.copy(c.getAttribute('data-copy')).then(function (ok) { N.toast(ok ? 'Copied to clipboard' : 'Select and copy the text manually', ok ? 'check-circle' : 'info'); });
        return;
      }
      var s = e.target.closest('[data-share]');
      if (s) { e.preventDefault(); N.share({ title: doc.title, url: location.href }); }
    });
  }

  /* ======================================================================
     Boot
     ====================================================================== */
  renderHeader();
  renderFooter();
  fillSiteValues();
  initDropdowns();
  initMobileNav();
  initScroll();
  initSearchOverlay();
  initHelpers();
  syncThemeMeta();
  if (window.matchMedia) {
    var mq = matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', syncThemeMeta);
  }
  doc.addEventListener('DOMContentLoaded', function () {
    N.enhance(doc);
    // Content rendered later (e.g. after a data file loads) must never stay hidden.
    if ('MutationObserver' in window) {
      var pending = false;
      new MutationObserver(function () {
        if (pending) return;
        pending = true;
        requestAnimationFrame(function () { pending = false; N.reveal(doc); });
      }).observe(body, { childList: true, subtree: true });
    }
  });
  // Safety net: if anything is still hidden once the page has loaded, show it.
  window.addEventListener('load', function () {
    setTimeout(function () {
      N.qsa('[data-reveal]:not(.is-in)').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in');
      });
    }, 1200);
  });
})();
