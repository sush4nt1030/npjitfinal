/* ==========================================================================
   NISC — updates.js  (Announcements / NISC Updates)
   Each update gets a page at updates/update.html?id=<id>.
   Newest first. `date` is ISO 'YYYY-MM-DD' when known.

   category: 'Announcement' | 'Registration' | 'Event update' | 'Team'
             | 'Opportunity' | 'Community'
   body: array of paragraphs. Use '## Heading' for a sub-heading.
   ========================================================================== */
window.NISC = window.NISC || {};

NISC.updates = [
  {
    id: 'wordcamp-nepal-2027',
    title: 'WordCamp Nepal 2027 is coming to Nepalgunj',
    category: 'Community',
    date: '2026-10-12',
    dateText: '',
    author: 'NISC Team',
    featured: true,
    excerpt: 'Nepalgunj, get ready to connect, learn and grow! WordCamp Nepal 2027 comes to our city on 29–30 January 2027 at Siddharth Cottage Restaurant.',
    body: [
      'Nepalgunj, get ready to connect, learn and grow!',
      'WordCamp Nepal 2027 is coming to our city, bringing the WordPress community together to share ideas, build connections and celebrate the web.',
      'Whether you are a student, developer, designer, content creator, or simply curious about WordPress, save the dates and stay connected for updates!',
      '## Save the dates',
      'Date: 29th and 30th January, 2027. Venue: Siddharth Cottage Restaurant, Nepalgunj. Day one is Contributor Day and day two is Conference Day.',
      'Let’s bring Nepalgunj’s IT community together and make meaningful connections! Explore more at nepal.wordcamp.org/2027. #WCNP2027'
    ],
    links: [
      { label: 'Event details', href: 'events/event.html?id=wordcamp-nepal-2027' },
      { label: 'Official website', href: 'https://nepal.wordcamp.org/2027/' }
    ]
  },
  {
    id: 'welcome-team-nisc',
    title: 'Welcome to the newest members of Team NISC',
    category: 'Team',
    date: '2026-10-12',
    dateText: '',
    author: 'NISC Team',
    featured: false,
    excerpt: 'Today we proudly welcome the newest members of Team NISC: two admins and five leads who will keep the community growing.',
    body: [
      'Today, we proudly welcome the newest members of Team NISC:',
      '## The team',
      'Sushant Budha (Admin), Bharat Rawal (Admin), Dinesh Sharma (Tech Lead), Shristy Soni (Community Lead), Sushil Rawot (Content / Design Lead), Nischal Koirala (Operations / Events Lead) and Bishal Banjara (Content Lead / Editor).',
      'Each of them looks after one part of NISC, from technology and events to design, content and the community itself. Say hello when you see them at the next NISC activity!'
    ],
    links: [
      { label: 'Meet the team', href: 'team/index.html' }
    ]
  },
  {
    id: 'new-website',
    title: 'Welcome to the new NISC website',
    category: 'Announcement',
    date: '2026-09-29',
    dateText: '',
    author: 'NISC Team',
    featured: false,
    excerpt: 'NISC now has a digital home: an archive of every event, a living timeline, the team, NISC Updates and a Learning Hub.',
    body: [
      'NISC now has its own digital home. The new website is built to help students understand NISC quickly and to keep a permanent record of everything the community does.',
      '## What you can do here',
      'Explore every NISC event, including the two sessions we have already completed. Follow our story on the Our Journey timeline. Register for upcoming events, join the community for free, and discover learning resources and opportunities.',
      '## Meet the team',
      'The Team page introduces the people who run NISC, from the two admins to every lead, with their roles and what they look after.',
      '## Help us fill the archive',
      'Were you at Session 01 or Session 02? Share your photos, feedback or story with the team so we can add them to the archive.'
    ],
    links: [
      { label: 'Explore events', href: 'events/index.html' },
      { label: 'Meet the team', href: 'team/index.html' },
      { label: 'Share your story', href: 'contact.html?topic=story' }
    ]
  },
  {
    id: 'session-02-completed',
    title: 'NISC successfully completes Session 02',
    category: 'Event update',
    date: null,
    dateText: 'N/A',
    author: 'NISC Team',
    featured: false,
    excerpt: 'Our second session is complete, and NISC keeps going: two sessions done, with more to come.',
    body: [
      'NISC has successfully completed its second session.',
      'A second session shows that NISC is more than a one-time event: it is a community that keeps learning together.',
      'Thank you to everyone who attended and helped organise it. Watch the Events page and NISC Updates for what comes next.'
    ],
    links: [
      { label: 'Session 02 event page', href: 'events/event.html?id=session-02' },
      { label: 'Upcoming events', href: 'events/index.html#upcoming' }
    ]
  },
  {
    id: 'session-01-completed',
    title: 'NISC successfully completes its first session',
    category: 'Event update',
    date: '2025-08-31',
    dateText: '',
    author: 'NISC Team',
    featured: false,
    excerpt: 'Session 01, held on 31 August 2025, is complete: the first NISC session introduced the community and its goals.',
    body: [
      'NISC has successfully completed its first session, held on 31 August 2025. It was a great success, with enthusiastic participation from the community members.',
      'The session introduced the community and its goals, and participants connected with each other and shared their experiences. It was the moment the NISC group became a real activity, and the starting point for everything that followed.',
      'Thank you to everyone who attended and helped make it happen.'
    ],
    links: [
      { label: 'Session 01 event page', href: 'events/event.html?id=session-01' },
      { label: 'Our Journey', href: 'discover/our-journey.html' }
    ]
  }
];
