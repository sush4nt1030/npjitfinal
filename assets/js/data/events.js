/* ==========================================================================
   NISC — events.js
   Every NISC event lives here. Each entry automatically gets:
     • a card on the Events page and homepage
     • its own page at  events/event.html?id=<id>
     • a registration page at events/register.html?event=<id> (when open)
     • search results, gallery links and timeline links

   HOW TO ADD AN EVENT
   1. Copy the TEMPLATE entry at the bottom.
   2. Give it a unique, lowercase id (e.g. 'session-03').
   3. Fill only verified details. Leave unknown fields empty ('' or [])
      and the page simply hides them; unknown dates/times show "N/A".
   4. Dates: use ISO format with Nepal time offset, e.g.
      '2026-11-14T13:00:00+05:45'. When start/end are set, the status
      (upcoming / ongoing / completed) is calculated automatically.
      allDay: true  → the page shows dateText / timeText instead of a
      clock time (use it when only the date is known).
   5. Optional: website { href, label } for an official event site,
      poster for a full event poster, registration.note for details.

   type:   'session' | 'workshop' | 'meetup' | 'competition' | 'community'
   status: used only when no start date is set.
   ========================================================================== */
window.NISC = window.NISC || {};

NISC.events = [
  {
    id: 'wordcamp-nepal-2027',
    label: 'WordCamp',
    title: 'WordCamp Nepal 2027 in Nepalgunj',
    type: 'community',
    status: 'upcoming',
    start: '2027-01-29T00:00:00+05:45',
    end: '2027-01-30T23:59:00+05:45',
    allDay: true,
    dateText: '29–30 January 2027',
    timeText: 'Times will be announced',
    venue: 'Siddharth Cottage Restaurant, Nepalgunj',
    organizer: 'WordCamp Nepal (the WordPress community in Nepal)',
    topic: 'WordPress, open source and the web',
    banner: 'assets/img/events/wordcamp-nepal-2027-banner.jpg',
    poster: 'assets/img/events/wordcamp-nepal-2027-poster.jpg',
    posterAlt: 'WordCamp Nepal 2027 Nepalgunj poster: 29th and 30th January 2027 at Siddharth Cottage Restaurant, Nepalgunj. #WCNP2027',
    website: { href: 'https://nepal.wordcamp.org/2027/', label: 'nepal.wordcamp.org/2027' },
    summary: 'Nepalgunj, get ready to connect, learn and grow! WordCamp Nepal 2027 is coming to our city, bringing the WordPress community together to share ideas, build connections and celebrate the web.',
    description: [
      'Nepalgunj, get ready to connect, learn and grow! WordCamp Nepal 2027 is coming to our city, bringing the WordPress community together to share ideas, build connections and celebrate the web.',
      'Whether you are a student, developer, designer, content creator, or simply curious about WordPress, save the dates and stay connected for updates.',
      'The event runs over two days: a Contributor Day on 29 January, a hands-on day of contributing and skill-sharing, and a Conference Day on 30 January with talks, discussions and networking. It is the first time WordCamp Nepal is being held in Nepalgunj.',
      'Let’s bring Nepalgunj’s IT community together and make meaningful connections! Explore more on the official website: nepal.wordcamp.org/2027.'
    ],
    purpose: 'To bring the WordPress community to Nepalgunj, so students and professionals in western Nepal can learn, contribute and connect close to home.',
    audience: ['Students', 'Developers', 'Designers', 'Content creators', 'Anyone curious about WordPress'],
    outcomes: ['Ideas and experience shared by the WordPress community', 'How to start contributing to WordPress on Contributor Day', 'New connections with developers, designers and creators'],
    agenda: [
      { time: '29 Jan', title: 'Contributor Day', detail: 'A hands-on day of contributing to WordPress and sharing skills at contribution tables.' },
      { time: '30 Jan', title: 'Conference Day', detail: 'Talks, discussions and networking: multiple sessions, a networking village and an after-party celebration.' }
    ],
    speakers: [],
    registration: { open: false, note: 'Tickets and registration are handled by WordCamp Nepal. Ticket details will be published on the official website.' },
    highlights: [],
    feedback: [],
    faqs: [
      { q: 'Who can attend?', a: 'Anyone interested in WordPress: students, developers, designers, content creators, business owners, bloggers, or anyone who is simply curious.' },
      { q: 'Where do I get tickets?', a: 'Ticket details will be announced on the official WordCamp Nepal 2027 website, nepal.wordcamp.org/2027. NISC will share the news in NISC Updates too.' },
      { q: 'Is WordCamp a NISC event?', a: 'WordCamp Nepal is organised by the WordPress community in Nepal. NISC is supporting it in Nepalgunj and invites every member to be part of it.' },
      { q: 'Which hashtag should I use?', a: 'Use #WCNP2027 when you share the event.' }
    ],
    milestone: 'wordcamp-nepal-2027',
    tags: ['wordpress', 'wordcamp', 'open source', 'conference']
  },
  {
    id: 'session-02',
    label: 'Session 02',
    title: 'NISC Session 02',
    type: 'session',
    status: 'completed',
    start: null,
    end: null,
    dateText: 'N/A',
    timeText: 'N/A',
    venue: 'N/A',
    organizer: 'Nepalgunj IT Students Community (NISC)',
    topic: '',
    banner: 'assets/img/illustrations/session-02.svg',
    summary: 'The second session NISC has successfully completed, showing the community can keep learning together session after session.',
    description: [
      'Session 02 was the second session organised by the Nepalgunj IT Students Community. After the first session brought members together for the first time, the second one showed that NISC could keep going.',
      'Like every NISC activity, it was open to students who are curious about technology, whether they study IT or not.'
    ],
    purpose: 'To keep NISC’s learning going after the first session and bring students together again to learn, ask questions and connect.',
    audience: ['+2 students', 'Bachelor students', 'IT and non-IT students'],
    outcomes: [],
    agenda: [],
    speakers: [],
    registration: { open: false },
    highlights: ['NISC’s second successfully completed session', 'A step from a one-time activity to a continuing community'],
    feedback: [],
    faqs: [],
    milestone: 'session-02',
    tags: ['session']
  },
  {
    id: 'session-01',
    label: 'Session 01',
    title: 'NISC Session 01',
    type: 'session',
    status: 'completed',
    start: '2025-08-31T00:00:00+05:45',
    end: '2025-08-31T23:59:00+05:45',
    allDay: true,
    dateText: '31 August 2025',
    timeText: 'N/A',
    venue: 'N/A',
    organizer: 'Nepalgunj IT Students Community (NISC)',
    topic: 'Introducing NISC and its goals',
    banner: 'assets/img/illustrations/session-01.svg',
    summary: 'The first NISC session, held on 31 August 2025: the community and its goals were introduced, and members met and shared their experiences.',
    description: [
      'The first session of NISC was held on 31 August 2025. It was a great success, with enthusiastic participation from the community members.',
      'The session focused on introducing the community and its goals, and participants were able to connect with each other and share their experiences. It turned the online NISC group into a real activity and became the starting point for everything NISC has done since.'
    ],
    purpose: 'To introduce NISC and its goals, and to bring members of the online community together for the first time.',
    audience: ['+2 students', 'Bachelor students', 'IT and non-IT students'],
    outcomes: ['What NISC is and what it wants to achieve', 'How members can take part and grow with the community'],
    agenda: [],
    speakers: [],
    registration: { open: false },
    highlights: ['NISC’s first successfully completed session', 'Enthusiastic participation from community members', 'Members connected with each other and shared their experiences'],
    feedback: [],
    faqs: [],
    milestone: 'session-01',
    tags: ['session']
  }
];
