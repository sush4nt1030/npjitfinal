/* ==========================================================================
   NISC — timeline.js
   The living history of NISC. Each milestone gets its own page at
   discover/milestone.html?id=<id> and appears on the Our Journey page.

   Phases (the five chapters of the journey):
     started → built → learned → now → next

   HOW TO ADD A MILESTONE
   • Copy any block, give it a unique id, choose its phase, and fill in
     verified information only.
   • date: ISO date (e.g. '2026-05-01') when known; otherwise leave null
     and set dateText (a year, or 'N/A').
   • event: link a milestone to an event id from events.js.
   • photos: paths relative to the site root.
   • future: true for planned milestones (drawn dashed).
   ========================================================================== */
window.NISC = window.NISC || {};

NISC.timeline = {
  phases: [
    { id: 'started', label: 'Where We Started', blurb: 'The idea, the first people, and the first conversations.' },
    { id: 'built', label: 'What We Built', blurb: 'A team, a community, and the first sessions.' },
    { id: 'learned', label: 'What We Learned', blurb: 'What running real activities taught us.' },
    { id: 'now', label: 'Where We Are', blurb: 'The community today.' },
    { id: 'next', label: 'What’s Next', blurb: 'The milestones we are working towards.' }
  ],

  milestones: [
    {
      id: 'nisc-formed',
      phase: 'started',
      kind: 'formation',
      date: '2023-11-18',
      dateText: '18 November 2023',
      title: 'NISC is formed',
      summary: 'Sushant Budha and Bharat Rawal start the Nepalgunj IT Students Community on 18 November 2023, a common platform for IT students in Nepalgunj.',
      story: [
        'The Nepalgunj IT Students Community (NISC) was formed in 2023 by Sushant Budha and Bharat Rawal, with the aim of bringing IT students in Nepalgunj together and creating a common platform for learning, networking, collaboration and opportunities. The community officially started on 18 November 2023.',
        'At that time, IT students in Nepalgunj were mostly connected through separate college and personal networks, with few chances to meet IT students from other colleges, share resources, take part in technical activities and learn from one another.',
        'The idea behind NISC was to bridge that gap and create a student-led IT community for Nepalgunj and the wider western Nepal region. The first NISC group quickly grew to around 291 members.'
      ],
      people: ['Sushant Budha (co-founder)', 'Bharat Rawal (co-founder)'],
      outcomes: ['The first NISC group is created in November 2023, where IT students from Nepalgunj can connect, share resources and discuss opportunities', 'The group grows to around 291 members, the starting point of the Nepalgunj IT Students Community'],
      photos: ['assets/img/illustrations/community-network.svg'],
      event: null,
      links: [{ label: 'Read Our Story', href: 'discover/our-story.html' }]
    },
    {
      id: 'session-01',
      phase: 'built',
      kind: 'session',
      date: '2025-08-31',
      dateText: '31 August 2025',
      title: 'Session 01 successfully completed',
      summary: 'The first NISC session is held on 31 August 2025, introducing the community and its goals.',
      story: [
        'The first session of NISC was held on 31 August 2025. It was a great success, with enthusiastic participation from the community members.',
        'The session focused on introducing the community and its goals, and participants were able to connect with each other and share their experiences. It moved NISC from an online group to a real activity.'
      ],
      people: [],
      outcomes: ['NISC’s first session completed successfully', 'Members meet in person and share their experiences', 'The community moves from an online group to real activities'],
      photos: ['assets/img/illustrations/learning-together.svg', 'assets/img/illustrations/qa-session.svg'],
      event: 'session-01',
      links: []
    },
    {
      id: 'session-02',
      phase: 'learned',
      kind: 'session',
      date: null,
      dateText: 'N/A',
      title: 'Session 02 successfully completed',
      summary: 'A second completed session shows NISC can keep going, and brings lessons from the first into practice.',
      story: [
        'With Session 02, NISC showed it could keep its activities going. Running a second session meant taking what worked the first time and doing it again, better.',
        'Two completed sessions turned NISC from a one-time event into a continuing community.'
      ],
      people: [],
      outcomes: ['NISC’s second session completed successfully', 'Proof that the community can keep going'],
      photos: ['assets/img/illustrations/coding-together.svg', 'assets/img/illustrations/group-discussion.svg'],
      event: 'session-02',
      links: []
    },
    {
      id: 'first-team',
      phase: 'now',
      kind: 'team',
      date: null,
      dateText: '2026',
      title: 'The first NISC core team is formed',
      summary: 'NISC welcomes the newest members of Team NISC: two admins and five leads, each looking after one part of the community.',
      story: [
        'The first NISC team was formed around the community’s need to divide responsibilities between the people building and managing it. Sushant Budha and Bharat Rawal were the core founding members, with Sushant focusing on community building and coordination while Bharat handled the technical and development side.',
        'As NISC grew, the team developed around community management, technology, events, content and design, and editing. In 2026 NISC proudly welcomed the newest members of Team NISC: Sushant Budha and Bharat Rawal as Admins, Dinesh Sharma as Tech Lead, Shristy Soni as Community Lead, Sushil Rawot as Content / Design Lead, Nischal Koirala as Operations / Events Lead and Bishal Banjara as Content Lead / Editor.',
        'This gave NISC a clear team structure and helped the community move from an online group towards organised activities and events.'
      ],
      people: ['Sushant Budha (Admin)', 'Bharat Rawal (Admin)', 'Dinesh Sharma (Tech Lead)', 'Shristy Soni (Community Lead)', 'Sushil Rawot (Content / Design Lead)', 'Nischal Koirala (Operations / Events Lead)', 'Bishal Banjara (Content Lead / Editor)'],
      outcomes: ['A core team of seven with clear responsibilities', 'Dedicated leads for tech, community, design, events and content'],
      photos: ['assets/img/team/sushant-budha.jpg', 'assets/img/team/bharat-rawal.jpg', 'assets/img/team/dinesh-sharma.jpg', 'assets/img/team/shristy-soni.jpg', 'assets/img/team/sushil-rawot.jpg', 'assets/img/team/nischal-koirala.jpg', 'assets/img/team/bishal-banjara.jpg'],
      event: null,
      links: [{ label: 'Meet the team', href: 'team/index.html' }, { label: 'Read the announcement', href: 'updates/update.html?id=welcome-team-nisc' }]
    },
    {
      id: 'digital-home',
      phase: 'now',
      kind: 'launch',
      date: null,
      dateText: '2026',
      title: 'NISC opens its digital home',
      summary: 'The new website gives NISC a public archive of events, a home for its team and updates, and a Learning Hub.',
      story: [
        'With two completed sessions behind it, NISC launches a website designed as a long-term home: every event keeps its own page, every milestone is documented here, and new students can understand the community in minutes.',
        'It also introduces the NISC team, shares NISC Updates and collects free learning resources in one place.'
      ],
      people: ['NISC Team'],
      outcomes: ['A permanent, public archive of NISC activities', 'One place for events, the team and updates', 'A Learning Hub with free resources'],
      photos: ['assets/img/projects/nisc-website.png'],
      event: null,
      links: [{ label: 'Read the announcement', href: 'updates/update.html?id=new-website' }, { label: 'See the project', href: 'projects/project.html?id=nisc-website' }]
    },
    {
      id: 'wordcamp-nepal-2027',
      phase: 'next',
      kind: 'event',
      future: true,
      date: '2027-01-29',
      dateText: '29–30 January 2027',
      title: 'WordCamp Nepal 2027 comes to Nepalgunj',
      summary: 'For the first time, WordCamp Nepal will be held in Nepalgunj, on 29–30 January 2027 at Siddharth Cottage Restaurant.',
      story: [
        'WordCamp Nepal 2027 is coming to Nepalgunj, bringing the WordPress community together to share ideas, build connections and celebrate the web. It is the first time WordCamp Nepal is being held in our city.',
        'For NISC, it is a chance to bring Nepalgunj’s IT community together: students, developers, designers and content creators learning side by side with the wider WordPress community.'
      ],
      people: [],
      outcomes: ['Contributor Day on 29 January 2027', 'Conference Day on 30 January 2027'],
      photos: ['assets/img/events/wordcamp-nepal-2027-poster.jpg'],
      event: 'wordcamp-nepal-2027',
      links: [{ label: 'Event details', href: 'events/event.html?id=wordcamp-nepal-2027' }, { label: 'Official website', href: 'https://nepal.wordcamp.org/2027/' }]
    }
  ]
};
