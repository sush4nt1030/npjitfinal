/* NISC — faq.js : instant filtering of FAQ questions. */
(function () {
  'use strict';
  var N = window.NISC;
  var input = document.getElementById('faq-filter');
  var empty = document.getElementById('faq-empty');
  if (!input) return;
  var groups = N.qsa('[data-faq-group]');
  input.addEventListener('input', N.debounce(function () {
    var q = input.value.trim().toLowerCase();
    var any = false;
    groups.forEach(function (g) {
      var shown = 0;
      N.qsa('.acc-item', g).forEach(function (item) {
        var hit = !q || item.textContent.toLowerCase().indexOf(q) > -1;
        item.hidden = !hit;
        if (hit) shown++;
        if (q && hit && q.length > 2) item.open = true;
        if (!q) item.open = false;
      });
      g.hidden = shown === 0;
      if (shown) any = true;
    });
    empty.hidden = any;
  }, 120));
})();
