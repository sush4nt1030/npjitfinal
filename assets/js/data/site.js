/* ==========================================================================
   NISC — site.js  (EDIT ME FIRST)
   Global settings, contact details, social links, form connections,
   navigation, and the list of static pages used by search.

   AUTHENTICITY RULE: only publish verified information. Leave a value
   empty ('') or null when you don't have it yet; the site hides it or
   shows N/A instead of inventing anything.
   ========================================================================== */
window.NISC = window.NISC || {};

NISC.site = {
  name: 'Nepalgunj IT Students Community',
  short: 'NISC',
  tagline: 'Learn. Connect. Build. Grow.',
  location: 'Nepalgunj, Banke, Lumbini Province, Nepal',
  founded: '18 November 2023',
  founders: 'Sushant Budha and Bharat Rawal',
  website: 'https://www.nepalgunjitcommunity.com',
  // Name of the NISC page on Facebook and Instagram (as printed on NISC posters).
  socialName: 'Nepalgunj IT student’s community',

  // Public contact details — leave '' until verified.
  email: '',            // e.g. 'hello@your-domain.org'
  phone: '',            // e.g. '+977 98XXXXXXXX'
  whatsappCommunity: '',// invite link to the official NISC WhatsApp community/group
  meetingPlace: '',     // regular meeting venue, if NISC has one

  // Verified social profiles only. Empty values are hidden automatically.
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
    github: '',
    youtube: '',
    tiktok: ''
  },

  // Verified community numbers. Use null for anything not yet counted.
  // sessionsCompleted is verified: NISC has successfully completed two sessions.
  stats: {
    sessionsCompleted: 2,
    members: null,
    studentsReached: null,
    projects: null,
    volunteers: null,
    collaborations: null
  },

  // Template entries are hidden on the live site.
  showTemplates: false,

  /* ------------------------------------------------------------------------
     FORM CONNECTIONS
     The Join, Contact and Registration forms need a free form service to
     deliver submissions. Until one is connected, each form shows a notice
     and tells visitors that nothing was sent.
       provider: 'none'        → not connected (current setting)
                 'formspree'   → endpoint: 'https://formspree.io/f/xxxxxxx'
                                 (free; submissions arrive by email)
                 'apps-script' → endpoint: a Google Apps Script web-app URL
                                 (saves to a Google Sheet)
                 'google-form' → externalUrl: a Google Form link; the page
                                 shows a button that opens the form
     ------------------------------------------------------------------------ */
  forms: {
    registration: { provider: 'none', endpoint: '', externalUrl: '' },
    join:         { provider: 'none', endpoint: '', externalUrl: '' },
    contact:      { provider: 'none', endpoint: '', externalUrl: '' }
  }
};

/* ---------------- Primary navigation ---------------- */
NISC.nav = [
  { label: 'Home', href: 'index.html', section: 'home' },
  {
    label: 'Discover', section: 'discover', href: 'discover/index.html', mega: true,
    menu: [
      { label: 'What is NISC', href: 'discover/what-is-nisc.html', icon: 'compass', desc: 'The community in one read' },
      { label: 'Why NISC Exists', href: 'discover/why-nisc-exists.html', icon: 'lightbulb', desc: 'The gap we want to close' },
      { label: 'Who NISC Is For', href: 'discover/who-its-for.html', icon: 'users', desc: '+2, Bachelor, IT and non-IT' },
      { label: 'Our Story', href: 'discover/our-story.html', icon: 'book', desc: 'How NISC began' },
      { label: 'Our Journey', href: 'discover/our-journey.html', icon: 'route', desc: 'The living timeline' },
      { label: 'Mission & Vision', href: 'discover/mission-vision.html', icon: 'target', desc: 'Where we are heading' },
      { label: 'What We Do', href: 'discover/what-we-do.html', icon: 'layers', desc: 'Sessions, projects and more' },
      { label: 'Our Values', href: 'discover/values.html', icon: 'heart', desc: 'How we work together' },
      { label: 'Our Impact', href: 'discover/impact.html', icon: 'trending', desc: 'Verified outcomes only' }
    ],
    feature: {
      href: 'discover/our-journey.html',
      eyebrow: 'Living archive',
      title: 'Walk through the NISC journey',
      text: 'Every milestone, session and turning point in one timeline.'
    }
  },
  {
    label: 'Events', section: 'events', href: 'events/index.html',
    menu: [
      { label: 'All events', href: 'events/index.html', icon: 'calendar', desc: 'Discover every NISC activity' },
      { label: 'Upcoming', href: 'events/index.html#upcoming', icon: 'clock', desc: 'What’s next' },
      { label: 'Completed archive', href: 'events/index.html#completed', icon: 'archive', desc: 'Everything we’ve run' },
      { label: 'Register', href: 'events/register.html', icon: 'ticket', desc: 'Save your seat' }
    ]
  },
  {
    label: 'Community', section: 'community', href: 'community/index.html',
    menu: [
      { label: 'Community hub', href: 'community/index.html', icon: 'network', desc: 'People, projects, moments' },
      { label: 'Student stories', href: 'community/stories.html', icon: 'quote', desc: 'In members’ own words' },
      { label: 'Projects', href: 'projects/index.html', icon: 'rocket', desc: 'What members build' },
      { label: 'NISC Updates', href: 'updates/index.html', icon: 'megaphone', desc: 'News and announcements' }
    ]
  },
  { label: 'Opportunities', href: 'opportunities/index.html', section: 'opportunities' },
  { label: 'Resources', href: 'resources/index.html', section: 'resources' },
  { label: 'Team', href: 'team/index.html', section: 'team' },
  { label: 'Gallery', href: 'gallery/index.html', section: 'gallery' }
];

/* ---------------- Discover reading path (sidebar + prev/next) ---------------- */
NISC.discover = [
  { id: 'what-is-nisc', title: 'What is NISC', href: 'discover/what-is-nisc.html', icon: 'compass', desc: 'A plain-language introduction to the Nepalgunj IT Students Community.' },
  { id: 'why-nisc-exists', title: 'Why NISC Exists', href: 'discover/why-nisc-exists.html', icon: 'lightbulb', desc: 'The problems students face and how a community helps.' },
  { id: 'who-its-for', title: 'Who NISC Is For', href: 'discover/who-its-for.html', icon: 'users', desc: 'From +2 students to Bachelor students, beginners to builders.' },
  { id: 'our-story', title: 'Our Story', href: 'discover/our-story.html', icon: 'book', desc: 'How NISC began, who started it, and where it stands today.' },
  { id: 'our-journey', title: 'Our Journey', href: 'discover/our-journey.html', icon: 'route', desc: 'An interactive timeline of every NISC milestone.' },
  { id: 'mission-vision', title: 'Mission & Vision', href: 'discover/mission-vision.html', icon: 'target', desc: 'What NISC is working towards.' },
  { id: 'what-we-do', title: 'What We Do', href: 'discover/what-we-do.html', icon: 'layers', desc: 'Twelve ways students take part, and what they gain.' },
  { id: 'values', title: 'Our Values', href: 'discover/values.html', icon: 'heart', desc: 'The principles behind every NISC activity.' },
  { id: 'impact', title: 'Our Impact', href: 'discover/impact.html', icon: 'trending', desc: 'What NISC has achieved, counted honestly.' }
];

/* ---------------- What We Do: activity areas ---------------- */
NISC.activities = [
  { id: 'learning-sessions', name: 'Learning Sessions', icon: 'book',
    summary: 'Focused sessions where students explore one technology topic together, from the basics to practical examples.',
    gains: ['A guided start on a topic before you study it alone', 'Answers to the questions you would otherwise search for hours', 'Notes and resources to keep learning afterwards'],
    links: [{ label: 'Completed sessions', href: 'events/index.html#completed' }, { label: 'Learning Hub', href: 'resources/index.html' }] },
  { id: 'workshops', name: 'Workshops', icon: 'wrench',
    summary: 'Hands-on workshops where you follow along on your own laptop and leave with something that works.',
    gains: ['Practical skills you can use the same day', 'Experience with real tools, not just slides', 'A small finished piece of work'],
    links: [{ label: 'Workshops', href: 'events/index.html#workshop' }] },
  { id: 'meetups', name: 'Meetups', icon: 'coffee',
    summary: 'Relaxed meetups to meet other students in Nepalgunj who care about technology.',
    gains: ['Friends who share your interests', 'Study partners and teammates', 'A sense of what others are learning'],
    links: [{ label: 'Meetups', href: 'events/index.html#meetup' }] },
  { id: 'project-building', name: 'Project Building', icon: 'rocket',
    summary: 'Small teams turning ideas into websites, apps, tools and experiments.',
    gains: ['Portfolio work you can show', 'Teamwork and Git experience', 'The confidence of shipping something real'],
    links: [{ label: 'Projects showcase', href: 'projects/index.html' }] },
  { id: 'peer-learning', name: 'Peer Learning', icon: 'users',
    summary: 'Students helping students: study circles, doubt sessions and friendly code reviews.',
    gains: ['Faster progress when you are stuck', 'Deeper understanding by explaining to others', 'Accountability to keep going'],
    links: [{ label: 'Join NISC', href: 'join.html' }] },
  { id: 'networking', name: 'Networking', icon: 'network',
    summary: 'Connections with seniors, alumni and people already working in technology.',
    gains: ['People who can guide your next step', 'A clearer picture of the tech field', 'Introductions you would not get alone'],
    links: [{ label: 'Community hub', href: 'community/index.html' }] },
  { id: 'career-opportunities', name: 'Career Opportunities', icon: 'briefcase',
    summary: 'Verified internships, jobs, scholarships and programmes collected in one place.',
    gains: ['Opportunities you might otherwise miss', 'Clear eligibility and deadlines', 'Encouragement to actually apply'],
    links: [{ label: 'Opportunities hub', href: 'opportunities/index.html' }] },
  { id: 'competitions', name: 'Competitions', icon: 'trophy',
    summary: 'Hackathons, coding contests and challenges, with help finding a team.',
    gains: ['Skills tested under real pressure', 'Teammates and new friends', 'Experience worth putting on a CV'],
    links: [{ label: 'Hackathons & competitions', href: 'opportunities/index.html#hackathon' }] },
  { id: 'community-discussions', name: 'Community Discussions', icon: 'message',
    summary: 'Open conversations about tools, trends, careers and the questions students actually have.',
    gains: ['Different perspectives on the same problem', 'Practice explaining your ideas', 'Awareness of what is changing in tech'],
    links: [{ label: 'NISC Updates', href: 'updates/index.html' }] },
  { id: 'mentorship', name: 'Mentorship', icon: 'compass',
    summary: 'Guidance on learning paths, projects and careers from people a few steps ahead.',
    gains: ['A learning plan that fits you', 'Honest feedback on your work', 'Someone to ask when you are unsure'],
    links: [{ label: 'Learning Hub', href: 'resources/index.html' }] },
  { id: 'volunteering', name: 'Volunteering', icon: 'heart',
    summary: 'Help run NISC: events, content, design, outreach and tech.',
    gains: ['Leadership and event experience', 'Skills beyond coding', 'A bigger role in the community'],
    links: [{ label: 'Ways to contribute', href: 'join.html#contribute' }, { label: 'Meet the team', href: 'team/index.html' }] },
  { id: 'student-collaboration', name: 'Student Collaboration', icon: 'handshake',
    summary: 'Working across colleges, faculties and skills: developers, designers and future founders together.',
    gains: ['Teams with complementary skills', 'Friends beyond your own college', 'Ideas that grow bigger together'],
    links: [{ label: 'Community hub', href: 'community/index.html' }, { label: 'Projects', href: 'projects/index.html' }] }
];

/* ---------------- Static pages for global search ---------------- */
NISC.pages = [
  { title: 'Home', url: 'index.html', desc: 'Why NISC matters to students in Nepalgunj.', keywords: 'home nisc nepalgunj it students community learn connect build grow' },
  { title: 'Discover NISC', url: 'discover/index.html', desc: 'Everything about NISC, from story to values.', keywords: 'about discover' },
  { title: 'What is NISC', url: 'discover/what-is-nisc.html', desc: 'A plain-language introduction to NISC.', keywords: 'about introduction community' },
  { title: 'Why NISC Exists', url: 'discover/why-nisc-exists.html', desc: 'The gap NISC wants to close.', keywords: 'why purpose problem' },
  { title: 'Who NISC Is For', url: 'discover/who-its-for.html', desc: '+2 students, Bachelor students, IT and non-IT learners.', keywords: 'eligibility audience plus two bachelor beginner designer developer' },
  { title: 'Our Story', url: 'discover/our-story.html', desc: 'How NISC began.', keywords: 'history founders beginning' },
  { title: 'Our Journey', url: 'discover/our-journey.html', desc: 'The interactive NISC timeline.', keywords: 'timeline milestones history archive' },
  { title: 'Mission & Vision', url: 'discover/mission-vision.html', desc: 'What NISC is working towards.', keywords: 'mission vision goals' },
  { title: 'What We Do', url: 'discover/what-we-do.html', desc: 'Sessions, workshops, projects, mentorship and more.', keywords: 'activities programs workshops meetups mentorship volunteering' },
  { title: 'Our Values', url: 'discover/values.html', desc: 'How NISC members work together.', keywords: 'values principles culture' },
  { title: 'Our Impact', url: 'discover/impact.html', desc: 'Verified outcomes and numbers.', keywords: 'impact statistics numbers' },
  { title: 'Events', url: 'events/index.html', desc: 'Upcoming and completed NISC events.', keywords: 'events sessions workshops meetups competitions' },
  { title: 'Event registration', url: 'events/register.html', desc: 'Register for a NISC event.', keywords: 'register registration form seat' },
  { title: 'Community hub', url: 'community/index.html', desc: 'People, projects and moments of NISC.', keywords: 'community members collaborations' },
  { title: 'Student Stories', url: 'community/stories.html', desc: 'Experiences shared by NISC participants.', keywords: 'stories testimonials experience' },
  { title: 'Projects', url: 'projects/index.html', desc: 'Projects built by NISC members.', keywords: 'projects showcase github' },
  { title: 'Opportunities', url: 'opportunities/index.html', desc: 'Internships, jobs, scholarships and hackathons.', keywords: 'opportunities internship job scholarship hackathon fellowship volunteer' },
  { title: 'Learning Hub', url: 'resources/index.html', desc: 'Curated resources and starter paths.', keywords: 'resources learning courses roadmap' },
  { title: 'NISC Updates', url: 'updates/index.html', desc: 'Announcements and news.', keywords: 'updates news announcements notices' },
  { title: 'Team', url: 'team/index.html', desc: 'The people who run NISC.', keywords: 'team leads organisers' },
  { title: 'Gallery', url: 'gallery/index.html', desc: 'The NISC memory wall.', keywords: 'gallery photos memories' },
  { title: 'Join NISC', url: 'join.html', desc: 'Free to join. Here is how.', keywords: 'join membership free sign up' },
  { title: 'Contact', url: 'contact.html', desc: 'Get in touch with NISC.', keywords: 'contact email message' },
  { title: 'FAQ', url: 'faq.html', desc: 'Answers to common questions.', keywords: 'faq questions help' },
  { title: 'Code of Conduct', url: 'code-of-conduct.html', desc: 'How we keep NISC welcoming.', keywords: 'conduct rules behaviour safety' },
  { title: 'Privacy Policy', url: 'privacy-policy.html', desc: 'How NISC handles your information.', keywords: 'privacy data policy' }
];
