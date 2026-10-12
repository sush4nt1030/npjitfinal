/* ==========================================================================
   NISC — gallery.js  (Memory Wall)
   Albums are grouped by event. Put photos in assets/img/gallery/<album>/
   and list them below (paths relative to the site root).

   Tip: export photos at ~1600px on the long side, JPG or WebP, under
   400 KB each. Always add meaningful alt text.
   Session albums show labelled illustrations until event photos are
   added (illustration: true). Add real photos the same way.
   ========================================================================== */
window.NISC = window.NISC || {};

NISC.gallery = {
  albums: [
    { id: 'wordcamp-nepal-2027', title: 'WordCamp Nepal 2027', event: 'wordcamp-nepal-2027', dateText: '29–30 January 2027',
      description: 'WordCamp Nepal 2027 is coming to Nepalgunj. Save the dates!' },
    { id: 'team-nisc-2026', title: 'Team NISC 2026', event: null, dateText: '2026',
      description: 'The newest members of Team NISC: two admins and five leads.' },
    { id: 'session-02', title: 'Session 02', event: 'session-02', dateText: 'N/A',
      description: 'NISC’s second successfully completed session.',
      note: 'These are illustrations of the session. Real event photos will be added here.' },
    { id: 'session-01', title: 'Session 01', event: 'session-01', dateText: '31 August 2025',
      description: 'NISC’s first session, held on 31 August 2025, introducing the community and its goals.',
      note: 'These are illustrations of the session. Real event photos will be added here.' }
  ],
  photos: [
    { album: 'wordcamp-nepal-2027', src: 'assets/img/events/wordcamp-nepal-2027-poster.jpg', w: 1200, h: 1200, alt: 'WordCamp Nepal 2027 Nepalgunj poster: 29th and 30th January 2027 at Siddharth Cottage Restaurant, Nepalgunj', caption: 'Official poster: WordCamp Nepal 2027, Nepalgunj' },
    { album: 'team-nisc-2026', src: 'assets/img/team/sushant-budha.jpg', w: 720, h: 900, alt: 'Sushant Budha', caption: 'Sushant Budha · Admin' },
    { album: 'team-nisc-2026', src: 'assets/img/team/bharat-rawal.jpg', w: 720, h: 900, alt: 'Bharat Rawal', caption: 'Bharat Rawal · Admin' },
    { album: 'team-nisc-2026', src: 'assets/img/team/dinesh-sharma.jpg', w: 720, h: 900, alt: 'Dinesh Sharma', caption: 'Dinesh Sharma · Tech Lead' },
    { album: 'team-nisc-2026', src: 'assets/img/team/shristy-soni.jpg', w: 720, h: 900, alt: 'Shristy Soni', caption: 'Shristy Soni · Community Lead' },
    { album: 'team-nisc-2026', src: 'assets/img/team/sushil-rawot.jpg', w: 720, h: 900, alt: 'Sushil Rawot', caption: 'Sushil Rawot · Content / Design Lead' },
    { album: 'team-nisc-2026', src: 'assets/img/team/nischal-koirala.jpg', w: 720, h: 900, alt: 'Nischal Koirala', caption: 'Nischal Koirala · Operations / Events Lead' },
    { album: 'team-nisc-2026', src: 'assets/img/team/bishal-banjara.jpg', w: 720, h: 900, alt: 'Bishal Banjara', caption: 'Bishal Banjara · Content Lead / Editor' },
    { album: 'session-02', src: 'assets/img/illustrations/coding-together.svg', w: 1600, h: 900, alt: 'Illustration of students coding together on laptops', caption: 'Learning by doing: students working on laptops together', illustration: true },
    { album: 'session-02', src: 'assets/img/illustrations/group-discussion.svg', w: 900, h: 1200, alt: 'Illustration of a small group discussing ideas', caption: 'Sharing ideas in small groups', illustration: true },
    { album: 'session-02', src: 'assets/img/illustrations/whiteboard.svg', w: 1000, h: 1000, alt: 'Illustration of a speaker explaining a diagram on a whiteboard', caption: 'Explaining a concept step by step', illustration: true },
    { album: 'session-02', src: 'assets/img/illustrations/networking.svg', w: 1200, h: 900, alt: 'Illustration of students meeting and connecting', caption: 'Meeting other students who love technology', illustration: true },
    { album: 'session-01', src: 'assets/img/illustrations/learning-together.svg', w: 1200, h: 900, alt: 'Illustration of a speaker presenting to students', caption: 'The first NISC session', illustration: true },
    { album: 'session-01', src: 'assets/img/illustrations/qa-session.svg', w: 1000, h: 1000, alt: 'Illustration of a student asking a question', caption: 'Questions are always welcome', illustration: true },
    { album: 'session-01', src: 'assets/img/illustrations/team-planning.svg', w: 900, h: 1200, alt: 'Illustration of a team planning around a table', caption: 'Planning together as a community', illustration: true },
    { album: 'session-01', src: 'assets/img/illustrations/community-network.svg', w: 1600, h: 900, alt: 'Illustration of students connected in a network', caption: 'Learn. Connect. Build. Grow.', illustration: true }
  ]
};
