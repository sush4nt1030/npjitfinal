/* NISC — opportunity.js : opportunity detail (opportunities/opportunity.html?id=…). */
(function () {
  'use strict';
  var N = window.NISC, ui = N.ui, I = N.icon, E = N.esc, F = N.fmt, V = N.val, P = N.plain, U = N.url;
  var root = document.getElementById('opp-root');
  var o = ui.byId(N.visible(N.opportunities || []), N.param('id'));
  if (!o) {
    ui.notFound(root, { title: 'Opportunity not found', text: 'It may have expired or been removed.', backHref: 'opportunities/index.html', backLabel: 'All opportunities' });
    return;
  }
  var t = ui.OPP_TYPES[o.type] || ui.OPP_TYPES.other;
  var title = P(o.title) || 'Opportunity';
  N.setTitle(title, P(o.description));
  var dl = ui.deadline(o);
  var apply = o.applyUrl && dl.state !== 'closed' ? '<a class="btn btn--primary btn--lg" href="' + E(o.applyUrl) + '">Apply on the official site ' + I('external') + '</a>' : '';

  var html = '<section class="page-hero"><div class="container"><div class="page-hero__inner">' +
    '<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="' + U('index.html') + '">Home</a></li><li><a href="' + U('opportunities/index.html') + '">Opportunities</a></li><li aria-current="page">' + E(title) + '</li></ol></nav>' +
    '<div class="cluster cluster--sm"><span class="tag tag--accent">' + I(t[1]) + t[0] + '</span>' + (o.template ? ui.templatePill : '') + (dl.state === 'closed' ? '<span class="pill pill--closed">Closed</span>' : '') + '</div>' +
    '<h1 class="page-hero__title">' + F(o.title) + '</h1>' +
    '<div class="page-hero__meta"><span>' + I('building') + F(o.organization) + '</span><span>' + I('map-pin') + F(o.location) + '</span><span>' + I('clock') + 'Deadline: ' + dl.text + '</span></div>' +
    (apply ? '<div class="page-hero__actions">' + apply + '</div>' : '') + '</div></div></section>';

  var main = '<section class="detail-section"><h2>' + I('info') + 'About this opportunity</h2><div class="prose">' + (o.live && (o.descriptionParas || []).length ? ui.paragraphs(o.descriptionParas) : '<p>' + V(o.description, 'N/A') + '</p>') + '</div></section>' +
    '<section class="detail-section"><h2>' + I('users') + 'Who can apply</h2>' + (ui.list(o.eligibility, 'check') || '<p class="text-2">N/A</p>') + '</section>' +
    ((o.benefits || []).length ? '<section class="detail-section"><h2>' + I('award') + 'What’s offered</h2>' + ui.list(o.benefits, 'star') + '</section>' : '') +
    '<section class="detail-section"><h2>' + I('send') + 'How to apply</h2><div class="prose"><p>' + V(o.howToApply, 'N/A') + '</p></div>' + (apply ? '<div class="mt-md">' + apply + '</div>' : '') + '</section>';

  var aside = '<div class="side-card"><h2>At a glance</h2><dl class="dl-grid"><dt>Type</dt><dd>' + t[0] + '</dd><dt>Organisation</dt><dd>' + F(o.organization) + '</dd><dt>Location</dt><dd>' + F(o.location) + '</dd><dt>Deadline</dt><dd>' + dl.text + (dl.note ? '<br><span class="pill pill--' + (dl.state === 'soon' ? 'soon' : dl.state === 'closed' ? 'closed' : 'open') + '" style="margin-top:6px">' + dl.note + '</span>' : '') + '</dd><dt>Posted</dt><dd>' + V(o.postedText, 'N/A') + '</dd></dl>' +
    (apply ? apply.replace('btn--lg', 'btn--block') : '<p class="muted" style="font-size:.88rem">' + I('info') + ' The application link appears here when verified.</p>') + '</div>' +
    '<div class="notice notice--success">' + I('shield') + '<div><strong>Verified by NISC</strong><p>Checked by ' + F(o.verifiedBy) + ' on ' + F(o.verifiedOn) + '. Always confirm details on the organiser’s official page' + (o.sourceUrl ? ' (<a href="' + E(o.sourceUrl) + '">source</a>)' : '') + ' before applying.</p></div></div>';

  html += '<section class="section section--tight"><div class="container split"><div>' + main + '</div><aside class="sticky-aside stack" aria-label="Opportunity summary">' + aside + '</aside></div></section>';
  root.innerHTML = html;
  N.enhance(root);
})();
