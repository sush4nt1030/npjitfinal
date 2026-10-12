/* ==========================================================================
   NISC — team.js
   The people behind NISC. Each member gets a profile page at
   team/member.html?id=<id>.

   • group: 'admin' shows the person in the "Admins" row at the top.
   • photo: path relative to the site root, e.g. 'assets/img/team/name.jpg'
     (4:5 portrait works best). Leave '' to show a default avatar.
   • links: verified profiles only. Supported keys:
     linkedin, github, facebook, instagram, website, email
   • When the team changes, move people to `alumni` (keep their term)
     so the history of NISC stays intact.
   ========================================================================== */
window.NISC = window.NISC || {};

NISC.team = {
  term: '2026',

  roles: [
    { id: 'admin', title: 'Admin', icon: 'shield',
      about: 'The co-founders. They guide NISC, manage the team and keep the community’s website and groups running.',
      responsibilities: ['Set NISC’s direction and priorities', 'Manage the team and new members', 'Run the website and community groups', 'Represent NISC with colleges and partners'] },
    { id: 'tech-lead', title: 'Tech Lead', icon: 'code',
      about: 'Leads technical content, member projects and NISC’s digital tools.',
      responsibilities: ['Shape session and workshop content', 'Guide member projects and code quality', 'Maintain the NISC website', 'Curate the Learning Hub'] },
    { id: 'community-lead', title: 'Community Lead', icon: 'compass',
      about: 'Keeps members connected and makes every new student feel welcome.',
      responsibilities: ['Welcome and onboard new members', 'Look after the community groups and channels', 'Bring students from different colleges together', 'Protect the Code of Conduct'] },
    { id: 'content-design-lead', title: 'Content / Design Lead', icon: 'palette',
      about: 'Owns how NISC looks: posters, social graphics and the visual identity.',
      responsibilities: ['Design event posters and social graphics', 'Keep the NISC brand consistent', 'Document events with photos', 'Create visuals for the website'] },
    { id: 'operations-events-lead', title: 'Operations / Events Lead', icon: 'calendar',
      about: 'Plans and runs sessions, workshops and meetups from start to finish.',
      responsibilities: ['Plan event calendars and logistics', 'Book venues and coordinate speakers', 'Manage registrations and attendance', 'Collect feedback after every event'] },
    { id: 'content-editor', title: 'Content Lead / Editor', icon: 'edit',
      about: 'Writes and edits what NISC publishes, so every message is clear and accurate.',
      responsibilities: ['Write announcements and NISC Updates', 'Edit event recaps and stories', 'Check facts before anything is published', 'Keep the website content up to date'] }
  ],

  // Admins first, then the core team in order.
  current: [
    { id: 'sushant-budha', group: 'admin', role: 'admin', name: 'Sushant Budha',
      photo: 'assets/img/team/sushant-budha.jpg', photoAlt: 'Portrait of Sushant Budha',
      intro: 'Co-founder of NISC. Started the community with Bharat Rawal in November 2023 and looks after community building and coordination.',
      college: '',
      skills: ['Community building', 'Coordination', 'Cybersecurity'],
      links: { website: 'https://budhasushant.com.np', linkedin: 'https://www.linkedin.com/in/sushant-budha-chhetri-25a792282', instagram: 'https://www.instagram.com/sushant_budha10' },
      involvement: ['nisc-formed', 'first-team'] },
    { id: 'bharat-rawal', group: 'admin', role: 'admin', name: 'Bharat Rawal',
      photo: 'assets/img/team/bharat-rawal.jpg', photoAlt: 'Portrait of Bharat Rawal',
      intro: 'Co-founder of NISC. Started the community with Sushant Budha in November 2023 and handles its technical and development side.',
      college: '',
      skills: ['Development', 'Technical planning', 'Community building'],
      links: {},
      involvement: ['nisc-formed', 'first-team'] },
    { id: 'dinesh-sharma', role: 'tech-lead', name: 'Dinesh Sharma',
      photo: 'assets/img/team/dinesh-sharma.jpg', photoAlt: 'Portrait of Dinesh Sharma',
      intro: 'Leads the technical side of NISC: session content, member projects and the NISC website.',
      college: '',
      skills: ['Web development', 'Mentoring', 'Technical sessions'],
      links: {}, involvement: ['first-team'] },
    { id: 'shristy-soni', role: 'community-lead', name: 'Shristy Soni',
      photo: 'assets/img/team/shristy-soni.jpg', photoAlt: 'Portrait of Shristy Soni',
      intro: 'Welcomes new members, looks after the community groups and keeps students from different colleges connected.',
      college: '',
      skills: ['Community building', 'Communication', 'Member support'],
      links: {}, involvement: ['first-team'] },
    { id: 'sushil-rawot', role: 'content-design-lead', name: 'Sushil Rawot',
      photo: 'assets/img/team/sushil-rawot.jpg', photoAlt: 'Portrait of Sushil Rawot',
      intro: 'Shapes how NISC looks, from event posters and social graphics to the community’s visual identity.',
      college: '',
      skills: ['Graphic design', 'Branding', 'Social media'],
      links: {}, involvement: ['first-team'] },
    { id: 'nischal-koirala', role: 'operations-events-lead', name: 'Nischal Koirala',
      photo: 'assets/img/team/nischal-koirala.jpg', photoAlt: 'Portrait of Nischal Koirala',
      intro: 'Plans and runs NISC sessions, workshops and meetups, from venue and logistics to registrations.',
      college: '',
      skills: ['Event planning', 'Coordination', 'Logistics'],
      links: {}, involvement: ['first-team'] },
    { id: 'bishal-banjara', role: 'content-editor', name: 'Bishal Banjara',
      photo: 'assets/img/team/bishal-banjara.jpg', photoAlt: 'Portrait of Bishal Banjara',
      intro: 'Writes and edits NISC’s announcements, updates and event recaps so every story is clear and accurate.',
      college: '',
      skills: ['Writing', 'Editing', 'Storytelling'],
      links: {}, involvement: ['first-team'] }
  ],

  // Past team members, e.g.
  // { id: 'name-2025', name: 'Full Name', roleTitle: 'Tech Lead', term: '2025–2026', photo: '', links: {} }
  alumni: []
};
