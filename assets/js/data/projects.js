/* ==========================================================================
   NISC — projects.js
   Real projects built by NISC members. Each gets a page at
   projects/project.html?id=<id>.

   status:   'idea' | 'in-progress' | 'completed' | 'maintained'
   category: 'Web' | 'Mobile' | 'AI / Data' | 'Security' | 'Design' | 'Tool' | 'Other'
   screenshots: paths relative to the site root.
   github / demo: leave '' if not public.
   ========================================================================== */
window.NISC = window.NISC || {};

NISC.projects = [
  {
    id: 'nisc-website',
    title: 'NISC Website',
    tagline: 'The official digital home of NISC: events, team, journey, updates and learning resources in one place.',
    category: 'Web',
    status: 'maintained',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Cloudflare Pages', 'GitHub'],
    contributors: [{ name: 'NISC Team', member: '' }],
    problem: 'NISC’s activities, team and news were spread across social media posts. New students had no single place to understand the community, see what is coming up or look back at what NISC has already done.',
    solution: 'A fast, accessible website that documents every event and milestone, introduces the team, shares NISC Updates and collects free learning resources, so anyone can understand NISC in a few minutes.',
    features: [
      'Event pages with dates, venues, agendas and posters',
      'Our Journey: a living timeline of NISC’s milestones',
      'Team profiles with photos and roles',
      'Learning Hub with free, trusted resources',
      'Light and dark themes, mobile-friendly and accessible'
    ],
    learned: [],
    screenshots: ['assets/img/projects/nisc-website.png', 'assets/img/projects/nisc-website-team.png'],
    cover: 'assets/img/projects/nisc-website.png',
    github: '',
    demo: 'https://www.nepalgunjitcommunity.com',
    startedText: '2026',
    event: null
  }
];
