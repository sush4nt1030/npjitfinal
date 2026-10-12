/* ==========================================================================
   NISC — network.js
   Lightweight animated "connection network" drawn on a <canvas>.
   Usage: <canvas data-network data-density="1"></canvas>
   Respects reduced motion and pauses when off-screen or tab is hidden.
   ========================================================================== */
(function () {
  'use strict';
  var N = window.NISC = window.NISC || {};
  var debounce = N.debounce || function (fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function hexToRgb(c) {
    c = (c || '').trim();
    var m = /^#([0-9a-f]{6})$/i.exec(c);
    if (!m) return [30, 95, 216];
    var n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function Network(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var density = parseFloat(canvas.getAttribute('data-density') || '1');
    var light = canvas.getAttribute('data-tone') === 'light';
    var nodes = [], w = 0, h = 0, raf = null, visible = true, mouse = { x: -9999, y: -9999 };
    var rgb = [30, 95, 216], rgb2 = [56, 182, 242];

    function colors() {
      var cs = getComputedStyle(document.documentElement);
      rgb = light ? [127, 208, 248] : hexToRgb(cs.getPropertyValue('--accent'));
      rgb2 = hexToRgb(cs.getPropertyValue('--sky'));
    }
    function size() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(80, Math.round((w * h) / 16000 * density));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28, r: Math.random() * 1.6 + 1.2, hub: Math.random() < 0.12 });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      var maxD = 130, i, j, a, b, dx, dy, d;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        for (j = i + 1; j < nodes.length; j++) {
          b = nodes[j];
          dx = a.x - b.x; dy = a.y - b.y;
          d = dx * dx + dy * dy;
          if (d < maxD * maxD) {
            var o = (1 - Math.sqrt(d) / maxD) * (light ? 0.35 : 0.22);
            ctx.strokeStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + o.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        dx = a.x - mouse.x; dy = a.y - mouse.y;
        d = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) {
          ctx.strokeStyle = 'rgba(' + rgb2[0] + ',' + rgb2[1] + ',' + rgb2[2] + ',' + ((1 - d / 160) * 0.5).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        var c = a.hub ? rgb2 : rgb;
        ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (a.hub ? 0.85 : (light ? 0.7 : 0.5)) + ')';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.hub ? a.r + 1.4 : a.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    function step() {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < -10) n.x = w + 10; else if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10; else if (n.y > h + 10) n.y = -10;
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    function start() { if (!raf && !reduce && visible && !document.hidden) raf = requestAnimationFrame(step); }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = null; }

    colors(); size(); draw();
    start();
    window.addEventListener('resize', debounce(function () { size(); draw(); }, 200));
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start(); else stop(); }).observe(canvas);
    }
    var host = canvas.parentElement;
    host.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      if (reduce) draw();
    });
    host.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; if (reduce) draw(); });
    new MutationObserver(function () { colors(); draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  Array.prototype.forEach.call(document.querySelectorAll('canvas[data-network]'), function (c) { Network(c); });
})();
