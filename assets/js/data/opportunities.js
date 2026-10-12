/* ==========================================================================
   NISC — opportunities.js
   Internships, jobs, scholarships, hackathons and more — VERIFIED ONLY.
   Before adding, confirm every detail on the organiser's official page
   and record who verified it. Each gets a page at
   opportunities/opportunity.html?id=<id>.

   type: 'internship' | 'job' | 'hackathon' | 'scholarship' | 'competition'
         | 'workshop' | 'bootcamp' | 'volunteer' | 'fellowship' | 'other'
   deadline: ISO date 'YYYY-MM-DD' (expired items are marked automatically)
   ========================================================================== */
window.NISC = window.NISC || {};

NISC.opportunities = [
  {
    id: 'wordcamp-nepal-2027-volunteer-speak',
    title: 'Volunteer or speak at WordCamp Nepal 2027',
    type: 'volunteer',
    organization: 'WordCamp Nepal',
    location: 'Nepalgunj, Banke',
    deadline: null,
    deadlineText: 'Not announced yet',
    postedText: '12 October 2026',
    description: 'WordCamp Nepal 2027 comes to Nepalgunj on 29–30 January 2027 at Siddharth Cottage Restaurant. The organisers have separate contacts for volunteers and speakers. Volunteering is a great way for students to meet the WordPress community, learn how a big tech event is run and help bring it to our city.',
    eligibility: ['Students and anyone interested in WordPress', 'Volunteers who can help in Nepalgunj on 29–30 January 2027', 'Speakers with a WordPress or web topic to share'],
    benefits: ['Experience helping run Nepal’s biggest open-source gathering', 'Connections with developers, designers and creators', 'A chance to share your knowledge on stage (speakers)'],
    howToApply: 'Volunteers: email wcnp.volunteers@gmail.com. Speakers: email wcnp.speakers@gmail.com. Check the official contact page for updates.',
    applyUrl: 'https://nepal.wordcamp.org/2027/contact/',
    sourceUrl: 'https://nepal.wordcamp.org/2027/contact/',
    verifiedBy: 'NISC Team',
    verifiedOn: '12 October 2026'
  },
  {
    id: 'github-student-developer-pack',
    title: 'GitHub Student Developer Pack',
    type: 'other',
    organization: 'GitHub Education',
    location: 'Online',
    deadline: null,
    deadlineText: 'Open all year',
    postedText: '12 October 2026',
    description: 'Free developer tools for students, including GitHub Copilot for verified students and offers from many partner companies. It is one of the most useful free benefits for any IT student.',
    eligibility: ['Students enrolled in a degree- or diploma-granting programme (high school, +2, college or university)', 'At least 13 years old', 'A GitHub personal account and proof of current student status'],
    benefits: ['GitHub Copilot for verified students', 'Free or discounted tools from GitHub’s partners', 'Access to GitHub Education resources'],
    howToApply: 'Open your GitHub settings → Education benefits, click “Start an application”, and upload proof of your student status, such as a photo of your college ID showing a current date, a class schedule or an enrolment letter.',
    applyUrl: 'https://education.github.com/pack',
    sourceUrl: 'https://docs.github.com/en/education/about-github-education/github-education-for-students/apply-to-github-education-as-a-student',
    verifiedBy: 'NISC Team',
    verifiedOn: '12 October 2026'
  }
];
