/* ==========================================================================
   NISC — forms.js
   Accessible validation + submission for the Registration, Join and
   Contact forms. Where a form sends its data is configured in
   assets/js/data/site.js → NISC.site.forms.

   Honesty rule: when no submission service is connected, the visitor is
   told clearly that nothing was sent. The site never pretends.
   ========================================================================== */
(function () {
  'use strict';
  var N = window.NISC;
  var I = N.icon, E = N.esc;

  var RULES = {
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); },
    phone: function (v) { var d = v.replace(/\D/g, ''); return /^\+?[0-9][0-9\s-]*$/.test(v) && d.length >= 7 && d.length <= 15; },
    url: function (v) { return /^(https?:\/\/)?[^\s.]+\.[^\s]{2,}/i.test(v); },
    github: function (v) { return /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9-]{1,39}\/?$/i.test(v) || /^@?[A-Za-z0-9-]{1,39}$/.test(v); },
    linkedin: function (v) { return /^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/.+/i.test(v); }
  };
  var MESSAGES = {
    email: 'Enter a valid email address, like name@example.com.',
    phone: 'Enter a valid phone number, like 98XXXXXXXX or +977 98XXXXXXXX.',
    url: 'Enter a valid link, like https://example.com.',
    github: 'Enter a GitHub username or a link like https://github.com/username.',
    linkedin: 'Enter a LinkedIn profile link, like https://linkedin.com/in/your-name.'
  };

  function controls(form) {
    return N.qsa('input, select, textarea', form).filter(function (el) {
      return el.type !== 'hidden' && el.type !== 'submit' && !el.closest('.hp-field') && !el.hasAttribute('data-copy-from');
    });
  }

  function validate(el) {
    var isCheck = el.type === 'checkbox' || el.type === 'radio';
    var v = isCheck ? el.checked : el.value.trim();
    var ok = true, msg = '';
    if (el.required && !v) {
      ok = false;
      msg = el.getAttribute('data-msg-required') || (isCheck ? 'Please confirm to continue.' : 'This field is required.');
    } else if (!isCheck && v) {
      var rule = el.getAttribute('data-validate');
      if (rule && RULES[rule] && !RULES[rule](v)) { ok = false; msg = el.getAttribute('data-msg') || MESSAGES[rule]; }
      else if (el.minLength > 0 && v.length < el.minLength) { ok = false; msg = 'Please write at least ' + el.minLength + ' characters (' + v.length + ' so far).'; }
    }
    var field = el.closest('.field') || el.closest('.check-field');
    if (field) {
      field.classList.toggle('is-invalid', !ok);
      field.classList.toggle('is-valid', ok && !!v && !isCheck);
      var err = N.qs('.field__error span', field);
      if (err) err.textContent = msg;
    }
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    return ok;
  }

  function send(cfg, data, kind) {
    var provider = cfg && cfg.provider;
    if (!provider || provider === 'none' || !cfg.endpoint) {
      return new Promise(function (res) { setTimeout(function () { res({ sent: false }); }, 650); });
    }
    if (provider === 'apps-script') {
      // Apps Script reads URL-encoded bodies most reliably (e.parameters).
      return fetch(cfg.endpoint, { method: 'POST', body: new URLSearchParams(data), mode: 'no-cors' }).then(function () { return { sent: true }; });
    }
    return fetch(cfg.endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } }).then(function (r) {
      if (!r.ok) throw new Error('Server responded with ' + r.status);
      return { sent: true };
    });
  }

  function summary(form) {
    var rows = N.qsa('[data-summary]', form).map(function (el) {
      var v = el.type === 'checkbox' ? '' : el.value.trim();
      if (el.tagName === 'SELECT' && el.selectedIndex > -1) v = el.options[el.selectedIndex].text;
      return v ? '<dt>' + E(el.getAttribute('data-summary')) + '</dt><dd>' + E(v) + '</dd>' : '';
    }).join('');
    return rows ? '<div class="confirm-summary"><dl class="dl-grid">' + rows + '</dl></div>' : '';
  }

  var SOCIAL = E((N.site && N.site.socialName) || 'Nepalgunj IT Students Community');
  var COPY = {
    registration: {
      sentTitle: 'Registration received',
      sentText: function (d) { return d.already ? 'Thank you, ' + E(d.first) + '. You’re already registered' + (d.event ? ' for <strong>' + E(d.event) + '</strong>' : '') + ' with this email, so your seat is saved. The NISC team will share updates on WhatsApp and by email.' : 'Thank you, ' + E(d.first) + '. Your registration' + (d.event ? ' for <strong>' + E(d.event) + '</strong>' : '') + ' has been received. The NISC team will share updates on WhatsApp and by email.'; },
      previewTitle: 'Online registration opens soon',
      previewText: 'Your details have <strong>not</strong> been sent, because online registration isn’t switched on yet. Please message NISC on Facebook or Instagram (<strong>' + SOCIAL + '</strong>) to save your seat.'
    },
    join: {
      sentTitle: 'Welcome to NISC!',
      sentText: function (d) { return 'Thank you, ' + E(d.first) + '. Your request to join has been received. The NISC team will contact you on WhatsApp or by email with the next steps.'; },
      previewTitle: 'Online sign-up opens soon',
      previewText: 'Your details have <strong>not</strong> been sent, because online sign-up isn’t switched on yet. To join now, message NISC on Facebook or Instagram: <strong>' + SOCIAL + '</strong>.'
    },
    contact: {
      sentTitle: 'Message sent',
      sentText: function (d) { return 'Thank you, ' + E(d.first) + '. Your message has been sent to the NISC team.'; },
      previewTitle: 'The contact form opens soon',
      previewText: 'Your message has <strong>not</strong> been sent, because the online form isn’t switched on yet. Please message NISC on Facebook or Instagram: <strong>' + SOCIAL + '</strong>.'
    }
  };

  function confirmView(form, kind, result) {
    var host = form.closest('[data-form-host]') || form.parentNode;
    var c = COPY[kind] || COPY.contact;
    var nameEl = N.qs('[name="full_name"]', form);
    var d = {
      first: nameEl ? nameEl.value.trim().split(/\s+/)[0] : 'there',
      event: (N.qs('[name="event_name"]', form) || {}).value || '',
      already: !!(result.data && result.data.already)
    };
    var actions = (form.getAttribute('data-confirm-actions') || '').split('|').filter(Boolean).map(function (pair, i) {
      var p = pair.split('::');
      return '<a class="btn ' + (i === 0 ? 'btn--primary' : 'btn--secondary') + '" href="' + N.url(p[1]) + '">' + E(p[0]) + '</a>';
    }).join('');
    var panel;
    if (result.sent) {
      panel = '<div class="confirm-panel" tabindex="-1">' +
        '<span class="confirm-panel__icon">' + I('check') + '</span>' +
        '<h2>' + c.sentTitle + '</h2><p>' + c.sentText(d) + '</p>' + summary(form) +
        '<div class="cluster" style="justify-content:center">' + actions + '</div></div>';
    } else {
      panel = '<div class="confirm-panel" tabindex="-1">' +
        '<span class="confirm-panel__icon confirm-panel__icon--preview">' + I('clipboard') + '</span>' +
        '<h2>' + c.previewTitle + '</h2><p>' + c.previewText + '</p>' + summary(form) +
        '<div class="cluster" style="justify-content:center">' + actions + '</div></div>';
    }
    host.innerHTML = panel;
    var p = N.qs('.confirm-panel', host);
    p.focus({ preventScroll: true });
    var top = host.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  function init(form) {
    if (form._niscInit) return;
    form._niscInit = true;
    form.noValidate = true;
    var kind = form.getAttribute('data-form');
    var cfg = (N.site && N.site.forms && N.site.forms[kind]) || { provider: 'none' };

    // External Google Form mode
    if (cfg.provider === 'google-form' && cfg.externalUrl) {
      var host = form.closest('[data-form-host]') || form.parentNode;
      host.innerHTML = '<div class="confirm-panel"><span class="confirm-panel__icon">' + I('external') + '</span><h2>Continue on the official form</h2>' +
        '<p>This form is handled by Google Forms. It opens in a new tab.</p><a class="btn btn--primary btn--lg" href="' + E(cfg.externalUrl) + '" target="_blank" rel="noopener noreferrer">Open the form ' + I('external') + '</a></div>';
      return;
    }

    if (!cfg.provider || cfg.provider === 'none' || !cfg.endpoint) {
      var note = document.createElement('div');
      note.className = 'form-notice';
      note.setAttribute('role', 'note');
      note.innerHTML = I('info') + '<p><strong>Online forms open soon.</strong> This form doesn’t send anything yet. To reach NISC now, message us on Facebook or Instagram: <strong>' + SOCIAL + '</strong>.</p>';
      form.insertBefore(note, form.firstChild);
    }

    var els = controls(form);
    els.forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value || el.required) validate(el); });
      el.addEventListener('input', function () {
        var f = el.closest('.field');
        if (f && f.classList.contains('is-invalid')) validate(el);
      });
      el.addEventListener('change', function () { if (el.type === 'checkbox' || el.tagName === 'SELECT') validate(el); });
    });

    // Character counters
    N.qsa('textarea[maxlength]', form).forEach(function (ta) {
      var counter = N.qs('.char-count', ta.closest('.field'));
      if (!counter) return;
      var upd = function () { counter.textContent = ta.value.length + ' / ' + ta.maxLength; };
      ta.addEventListener('input', upd);
      upd();
    });

    // "Same as WhatsApp" helper
    N.qsa('[data-copy-from]', form).forEach(function (box) {
      var from = N.qs('#' + box.getAttribute('data-copy-from'), form);
      var to = N.qs('#' + box.getAttribute('data-copy-to'), form);
      if (!from || !to) return;
      var sync = function () { if (box.checked) { to.value = from.value; to.readOnly = true; validate(to); } else { to.readOnly = false; } };
      box.addEventListener('change', sync);
      from.addEventListener('input', function () { if (box.checked) to.value = from.value; });
    });

    // Preselect from URL (?topic=…)
    N.qsa('[data-from-param]', form).forEach(function (sel) {
      var v = N.param(sel.getAttribute('data-from-param'));
      if (v && N.qsa('option', sel).some(function (o) { return o.value === v; })) sel.value = v;
    });

    var errorBox = N.qs('.form-errors', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = N.qs('.hp-field input', form);
      if (hp && hp.value) return; // bot
      var invalid = els.filter(function (el) { return !validate(el); });
      if (invalid.length) {
        if (errorBox) {
          errorBox.classList.add('is-visible');
          N.qs('[data-error-count]', errorBox).textContent = invalid.length === 1 ? '1 field needs attention.' : invalid.length + ' fields need attention.';
        }
        invalid[0].focus();
        return;
      }
      if (errorBox) errorBox.classList.remove('is-visible');
      var btn = N.qs('[type="submit"]', form);
      btn.classList.add('is-loading');
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
      var data = new FormData(form);
      data.append('submitted_at', new Date().toISOString());
      data.append('form', kind);
      var fail = N.qs('.form-fail', form);
      if (fail) {
        if (!fail._orig) fail._orig = fail.innerHTML;
        fail.innerHTML = fail._orig;
        fail.hidden = true;
      }
      send(cfg, data, kind).then(function (result) {
        confirmView(form, kind, result);
      }).catch(function (err) {
        btn.classList.remove('is-loading');
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
        // Field-level problems reported by the form service
        var first = null;
        Object.keys((err && err.fields) || {}).forEach(function (name) {
          var el = N.qs('[name="' + name + '"]', form);
          if (!el) return;
          var field = el.closest('.field') || el.closest('.check-field') || el.closest('fieldset');
          if (field) {
            field.classList.add('is-invalid');
            var span = N.qs('.field__error span', field);
            if (span) span.textContent = err.fields[name];
          }
          el.setAttribute('aria-invalid', 'true');
          if (!first) first = el;
        });
        if (first) {
          if (errorBox) {
            errorBox.classList.add('is-visible');
            N.qs('[data-error-count]', errorBox).textContent = 'Please check the highlighted fields.';
          }
          first.focus();
          return;
        }
        if (fail) {
          if (err && err.server && err.message) {
            var p = N.qs('p', fail);
            if (p) p.textContent = err.message;
          }
          fail.hidden = false;
          fail.focus();
        }
      });
    });
  }

  N.forms = { init: init, validate: validate };
  document.addEventListener('DOMContentLoaded', function () {
    N.qsa('form[data-form]:not([data-manual])').forEach(init);
  });
})();
