# NISC — Nepalgunj IT Students Community website

The official website of NISC: a fast, static website (HTML, CSS and JavaScript only).
There is **no login system, no database and no server code**, so it runs on any free static host
(GitHub Pages or Cloudflare Pages) and opens directly with VS Code Live Server.

---

## 1. Folder structure

```
nisc-website/
├── index.html                 Homepage (the NISC story in five chapters)
├── discover/                  What is NISC, Our Story, Our Journey, Mission, Values, Impact…
├── events/                    Events list, event page (event.html?id=…), registration page
├── team/                      Team page and member profiles (member.html?id=…)
├── community/ projects/ opportunities/ resources/ updates/ gallery/
├── join.html contact.html faq.html search.html code-of-conduct.html privacy-policy.html 404.html
├── assets/
│   ├── css/                   base, layout, components, pages
│   ├── js/core.js ui.js forms.js icons.js network.js
│   ├── js/pages/              one small script per page
│   ├── js/data/               ← ALL the content lives here (edit these)
│   └── img/                   brand, team photos, event posters, illustrations, project screenshots
├── _headers                   security headers (used by Cloudflare Pages)
├── robots.txt  site.webmanifest  favicon.ico
```

---

## 2. Open it on your computer

Open the folder in VS Code and click **Go Live** (Live Server), or open `index.html` through any
local web server. Everything works locally.

---

## 3. Put it online for free

**Option A — GitHub Pages**
1. Create a GitHub repository and upload everything inside `nisc-website/` (so `index.html` is at the top).
2. Repository → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
3. Under **Custom domain**, enter your domain and follow the DNS instructions.

**Option B — Cloudflare Pages**
1. Put the files on GitHub as above.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → choose the repository.
3. Build command: *(leave empty)* · Build output directory: `/` → **Save and Deploy**.
4. Project → **Custom domains** → add your domain (for example `nepalgunjitcommunity.com`).

Every time you edit a file on GitHub, the site updates automatically within about a minute.

---

## 4. Editing content (no coding needed)

All content is in plain data files in `assets/js/data/`. Open them in any text editor, or edit them
directly on GitHub (open the file → pencil icon → Commit).

| File | What it controls |
|---|---|
| `site.js` | Name, founding details, contact details, social links, statistics, form connections, navigation |
| `events.js` | Every event (each gets its own page and registration page) |
| `timeline.js` | Our Journey chapters and milestones |
| `team.js` | Roles, current team (with photos), past members |
| `updates.js` | NISC Updates / announcements |
| `gallery.js` | Gallery albums and photos |
| `projects.js` | Projects showcase |
| `opportunities.js` | Verified opportunities |
| `resources.js` | Learning Hub resources and starter paths |
| `stories.js` | Student stories |

**Adding an event:** copy an event block in `events.js`, give it a new `id` (for example `session-03`),
and fill in the details. Set `start`/`end` (for example `'2026-11-14T13:00:00+05:45'`) and the status
(upcoming / ongoing / completed), countdown and "Add to calendar" work automatically. If you only know
the date, add `allDay: true` with `dateText` and `timeText`. Add a poster with `banner` / `poster`, and an
official link with `website: { href, label }`.

**Adding photos:** put images in `assets/img/gallery/<album>/` (about 1600 px wide, JPG, under 400 KB)
and list them in `gallery.js` with a caption and `alt` text. The Session 01 and Session 02 albums use
illustrations marked `illustration: true`; replace them with real photos when you have them.

**Team photos:** `assets/img/team/<name>.jpg` (4:5 portrait, about 720×900) and set `photo` in `team.js`.
Admins have `group: 'admin'` and appear first.

**Social links:** add the real Facebook / Instagram page URLs in `site.js → social`; the footer and
contact page show them automatically.

---

## 5. Forms (Join, Contact, Event registration)

Without a server, the forms need a free form service. Until one is connected, each form shows a notice
("Online forms open soon") and tells visitors to message NISC on Facebook or Instagram. Nothing is
pretended to be sent.

To switch them on, edit `site.js → forms`:

- **Formspree (easiest, free):** create a form at formspree.io, then set
  `join: { provider: 'formspree', endpoint: 'https://formspree.io/f/xxxxxxx' }`. Submissions arrive by email.
- **Google Form:** set `join: { provider: 'google-form', externalUrl: 'https://forms.gle/…' }`; the page
  shows a button that opens your Google Form.
- **Google Sheet:** `provider: 'apps-script'` with a Google Apps Script web-app URL.

Do the same for `contact` and `registration`, then update the privacy policy to name the service.

---

## 6. The authenticity rule

The website never invents NISC information. Unknown details show **N/A** or are hidden.

Facts on the site: NISC officially started on **18 November 2023**, founded by **Sushant Budha** and
**Bharat Rawal**, and the first group grew to around **291 members**; **Session 01** was held on
**31 August 2025**, followed by **Session 02**; the **2026 core team** (Sushant Budha and Bharat Rawal as
Admins, Dinesh Sharma, Shristy Soni, Sushil Rawot, Nischal Koirala and Bishal Banjara);
**WordCamp Nepal 2027** in Nepalgunj on 29–30 January 2027 at Siddharth Cottage Restaurant.

Still unknown (shown as N/A): Session 02 date, time and venue; Session 01 time and venue.

---

## 7. After deploying

- In each page's `<head>`, change `og:image` to the absolute URL
  (`https://your-domain/assets/img/brand/og-image.jpg`) so link previews work on Facebook and WhatsApp.
- Add a `sitemap.xml` and reference it in `robots.txt`.

---

## 8. Brand

- Logo: `assets/img/brand/nisc-logo-1200.png` and `nisc-mark-512.png`
- Colours: Navy `#0A1B3F`, Logo blue `#0B47B1`, Blue `#1E5FD8`, Sky `#38B6F2`, Ice `#EAF3FF`, White
- Type: Bricolage Grotesque (display), Figtree (body), JetBrains Mono (labels) via Google Fonts
- All colours are tokens in `assets/css/base.css`.
