// Each entry collection edits the same JSON array that visitors read.
(() => {
  'use strict';
  const field = (name, label, widget = 'string', options = {}) => ({ name, label, widget, required: false, ...options });
  const required = (name, label) => field(name, label, 'string', { required: true });
  const text = (name, label) => field(name, label, 'text');
  const flag = (name, label) => field(name, label, 'boolean');
  const image = (name, label) => field(name, label, 'image');
  const number = (name, label, limits = {}) => field(name, label, 'number', { value_type: 'int', min: 0, ...limits });
  const choose = (name, label, options, initial) => field(name, label, 'select', { options, default: initial, required: true });
  const group = (name, label, fields) => field(name, label, 'object', { fields, collapsed: true });
  const rows = (name, label, fields) => field(name, label, 'list', { fields, collapsed: true });
  const lines = (name, label, widget = 'string') => field(name, label, 'list', { field: field('item', 'Item', widget, { required: true }) });
  const date = (name, label) => field(name, label, 'datetime', { type: 'date', format: 'YYYY-MM-DD', default: '' });
  const time = (name, label) => field(name, label, 'datetime', { input_timezone: 'Asia/Kathmandu', default: '', hint: 'Nepal time' });
  const url = (name, label) => field(name, label, 'string', { pattern: ['^https?://[^\\s<>"\u0027]+$', 'Enter a full http or https URL.'] });
  const path = (name, label) => field(name, label, 'string', {
    pattern: ['^(?:https?://[^\\s<>"\u0027]+|[a-zA-Z0-9_./#?&=%+~-]+)$', 'Enter a website path or a full http or https URL.']
  });
  const key = {
    ...required('id', 'Page ID'), unique: true,
    pattern: ['^[a-z0-9]+(?:-[a-z0-9]+)*$', 'Use lowercase letters, numbers and hyphens.'],
    hint: 'Used in links. Keep this ID when editing a published page.'
  };
  const title = required('title', 'Title');
  const name = required('name', 'Name');
  const links = rows('links', 'Links', [required('label', 'Link text'), { ...path('href', 'Destination'), required: true }]);
  const profiles = group('links', 'Profiles', [
    url('website', 'Website'), url('github', 'GitHub'), url('linkedin', 'LinkedIn'),
    url('facebook', 'Facebook'), url('instagram', 'Instagram'), field('email', 'Email', 'string', { type: 'email' })
  ]);
  function relation(name, label, collection, display = 'title', options = {}) {
    return field(name, label, 'relation', {
      collection, value_field: 'id', search_fields: [display, 'id'], display_fields: [display], ...options
    });
  }
  function collection(name, label, singular, icon, fields, options = {}) {
    return { name, label, label_singular: singular, file: 'content/' + name + '.json', format: 'json', create: true, icon, fields, ...options };
  }
  const eventRef = relation('event', 'Related event', 'events');
  const collections = [
    collection('events', 'Events & sessions', 'event or session', 'calendar_month', [
      title, key, choose('type', 'Event type', ['session', 'workshop', 'meetup', 'competition', 'community'], 'session'),
      field('label', 'Short label'), text('summary', 'Summary'), field('topic', 'Topic'),
      time('start', 'Starts'), time('end', 'Ends'), flag('allDay', 'All-day event'),
      field('dateText', 'Display date'), field('timeText', 'Display time'),
      choose('status', 'Status when the start date is unknown', ['upcoming', 'ongoing', 'completed'], 'upcoming'),
      field('venue', 'Venue'), url('venueMapUrl', 'Map link'), field('organizer', 'Organizer'),
      image('banner', 'Banner'), image('poster', 'Poster'), field('posterAlt', 'Poster description'),
      group('website', 'Official website', [url('href', 'Website address'), field('label', 'Link text')]),
      lines('description', 'Description paragraphs', 'text'), text('purpose', 'Purpose'),
      lines('audience', 'Who can attend'), lines('outcomes', 'Learning outcomes'),
      rows('agenda', 'Agenda', [field('time', 'Time'), title, text('detail', 'Details')]),
      rows('speakers', 'Speakers', [name, field('role', 'Role'), text('bio', 'Bio'), image('photo', 'Photo'), profiles]),
      group('registration', 'Registration', [flag('open', 'Accept registrations'), field('deadlineText', 'Closing date or time'),
        number('seats', 'Seats'), number('spotsLeft', 'Seats remaining'), flag('full', 'Fully booked'), text('note', 'Registration note')]),
      flag('live', 'Show current registration status'), flag('cancelled', 'Event cancelled'),
      lines('highlights', 'Highlights'), rows('feedback', 'Participant feedback', [name, field('detail', 'Affiliation'), text('quote', 'Quote')]),
      rows('faqs', 'Event questions', [required('q', 'Question'), text('a', 'Answer')]),
      relation('milestone', 'Journey milestone', 'milestones'), lines('tags', 'Search tags')
    ], { preview_path: 'events/event.html?id={{id}}' }),
    collection('updates', 'Updates', 'update', 'campaign', [
      title, key, choose('category', 'Category', ['Announcement', 'Registration', 'Event update', 'Team', 'Opportunity', 'Community'], 'Announcement'),
      date('date', 'Publication date'), field('dateText', 'Display date'), field('author', 'Author'),
      flag('featured', 'Feature this update'), text('excerpt', 'Summary'), lines('body', 'Body paragraphs', 'text'), links
    ], { preview_path: 'updates/update.html?id={{id}}' }),
    collection('projects', 'Projects', 'project', 'work', [
      title, key, text('tagline', 'Short description'), choose('category', 'Category', ['Web', 'Mobile', 'AI / Data', 'Security', 'Design', 'Tool', 'Other'], 'Web'),
      choose('status', 'Status', ['idea', 'in-progress', 'completed', 'maintained'], 'in-progress'),
      image('cover', 'Cover image'), lines('screenshots', 'Screenshots', 'image'), lines('tech', 'Technologies'),
      rows('contributors', 'Contributors', [name, relation('member', 'Team profile', 'members', 'name')]),
      text('problem', 'Problem'), text('solution', 'Solution'), lines('features', 'Features'), lines('learned', 'Lessons learned'),
      url('github', 'Repository'), url('demo', 'Live project'), field('startedText', 'Started'), eventRef
    ], { preview_path: 'projects/project.html?id={{id}}' }),
    collection('opportunities', 'Opportunities', 'opportunity', 'business_center', [
      title, key, choose('type', 'Type', ['internship', 'job', 'hackathon', 'scholarship', 'competition', 'workshop', 'bootcamp', 'volunteer', 'fellowship', 'other'], 'other'),
      field('organization', 'Organization'), field('location', 'Location'), date('deadline', 'Deadline'),
      field('deadlineText', 'Display deadline'), field('postedText', 'Posted on'), text('description', 'Description'),
      lines('eligibility', 'Eligibility'), lines('benefits', 'Benefits'), text('howToApply', 'How to apply'),
      url('applyUrl', 'Application link'), url('sourceUrl', 'Official source'), field('verifiedBy', 'Verified by'), field('verifiedOn', 'Verified on')
    ], { preview_path: 'opportunities/opportunity.html?id={{id}}' }),
    collection('resources', 'Learning resources', 'resource', 'school', [
      title, key, relation('category', 'Category', 'resource-categories', 'name', { required: true }),
      choose('type', 'Type', ['Course', 'Documentation', 'Book', 'Practice', 'Guide', 'Articles', 'Roadmap'], 'Guide'),
      number('level', 'Level (1 beginner, 2 intermediate, 3 advanced)', { min: 1, max: 3, default: 1, required: true }),
      field('source', 'Publisher'), url('url', 'Resource link'), field('cost', 'Cost'), text('summary', 'Summary'),
      lines('learn', 'Learning outcomes'), text('bestFor', 'Who it helps'), text('tip', 'Learning tip'), flag('starter', 'Starter path'),
      rows('steps', 'Path steps', [title, text('text', 'Instructions'), relation('resources', 'Resources', 'resources', 'title', { multiple: true })])
    ], { preview_path: 'resources/resource.html?id={{id}}' }),
    collection('stories', 'Student stories', 'story', 'forum', [
      title, key, name, field('detail', 'College or programme'), image('photo', 'Portrait'),
      choose('theme', 'Theme', ['First event', 'What I learned', 'Project', 'Confidence', 'Volunteering', 'Career'], 'First event'),
      text('quote', 'Student quote'), lines('body', 'Story paragraphs', 'text'), eventRef, field('dateText', 'Date')
    ], { preview_path: 'community/story.html?id={{id}}' }),
    collection('members', 'Team members', 'member', 'group', [
      name, key, relation('role', 'Role', 'roles', 'title', { required: true }),
      field('group', 'Team group', 'select', { options: [{ label: 'Core team', value: 'core' }, { label: 'Admins', value: 'admin' }], default: 'core' }),
      image('photo', 'Portrait'), field('photoAlt', 'Portrait description'), text('intro', 'Introduction'),
      field('college', 'College'), lines('skills', 'Skills'), profiles, relation('involvement', 'Milestones', 'milestones', 'title', { multiple: true })
    ], { identifier_field: 'name', preview_path: 'team/member.html?id={{id}}' }),
    collection('alumni', 'Team alumni', 'alumnus', 'groups', [
      name, key, field('roleTitle', 'Former role'), field('term', 'Term'), image('photo', 'Portrait'), text('intro', 'Introduction'), profiles
    ], { identifier_field: 'name', preview_path: 'team/member.html?id={{id}}' }),
    collection('albums', 'Gallery albums', 'album', 'photo_library', [
      title, key, eventRef, field('dateText', 'Date'), text('description', 'Description'), text('note', 'Album note')
    ], { preview_path: 'gallery/index.html#{{id}}' }),
    collection('photos', 'Gallery photos', 'photo', 'image', [
      relation('album', 'Album', 'albums', 'title', { required: true }), { ...image('src', 'Image'), required: true },
      required('alt', 'Image description'), field('caption', 'Caption'), number('w', 'Width in pixels'), number('h', 'Height in pixels'), flag('illustration', 'Illustration')
    ], { identifier_field: 'alt', thumbnail: 'src' }),
    collection('milestones', 'Journey milestones', 'milestone', 'timeline', [
      title, key, relation('phase', 'Phase', 'phases', 'label', { required: true }), field('kind', 'Kind'),
      date('date', 'Date'), field('dateText', 'Display date'), flag('future', 'Planned milestone'),
      text('summary', 'Summary'), lines('story', 'Story paragraphs', 'text'), lines('people', 'People'),
      lines('outcomes', 'Outcomes'), lines('photos', 'Photos', 'image'), eventRef, links
    ], { preview_path: 'discover/milestone.html?id={{id}}' }),
    collection('activities', 'Community activities', 'activity', 'local_activity', [
      name, key, field('icon', 'Icon name'), text('summary', 'Summary'), lines('gains', 'What students gain'), links
    ], { identifier_field: 'name' }),
    collection('roles', 'Team roles', 'role', 'badge', [title, key, field('icon', 'Icon name'), text('about', 'About the role'), lines('responsibilities', 'Responsibilities')]),
    collection('phases', 'Journey phases', 'phase', 'flag', [required('label', 'Phase name'), key, text('blurb', 'Introduction')], { identifier_field: 'label' }),
    collection('resource-categories', 'Resource categories', 'category', 'category', [name, key, field('icon', 'Icon name')], { identifier_field: 'name' })
  ];

  const formConnection = (name, label) => group(name, label, [
    choose('provider', 'Service', ['none', 'formspree', 'apps-script', 'google-form'], 'none'),
    url('endpoint', 'Submission endpoint'), url('externalUrl', 'Google Form link')
  ]);
  const settings = [
    name, field('short', 'Short name'), field('tagline', 'Tagline'), field('location', 'Location'),
    field('founded', 'Founding date'), field('founders', 'Founders'), url('website', 'Website'),
    field('socialName', 'Social profile name'), field('email', 'Contact email', 'string', { type: 'email' }), field('phone', 'Phone'),
    url('whatsappCommunity', 'WhatsApp community'), field('meetingPlace', 'Meeting place'), flag('showTemplates', 'Show template entries'),
    group('social', 'Social profiles', ['facebook', 'instagram', 'linkedin', 'github', 'youtube', 'tiktok'].map(channel => url(channel, channel))),
    group('stats', 'Verified statistics', [
      number('sessionsCompleted', 'Sessions completed'), number('members', 'Members'), number('studentsReached', 'Students reached'),
      number('projects', 'Projects'), number('volunteers', 'Volunteers'), number('collaborations', 'Collaborations')
    ]),
    group('forms', 'Public form connections', [
      formConnection('registration', 'Event registration'), formConnection('join', 'Membership'), formConnection('contact', 'Contact')
    ])
  ];
  const navItem = [required('label', 'Link text'), path('href', 'Destination'), field('icon', 'Icon name'), text('desc', 'Description')];
  collections.push({
    name: 'configuration', label: 'Website settings', icon: 'settings', files: [
      { name: 'site', label: 'Community details & forms', file: 'content/settings.json', fields: settings },
      { name: 'term', label: 'Current team term', file: 'content/team-settings.json', fields: [required('term', 'Team term')] },
      { name: 'navigation', label: 'Navigation & search pages', file: 'content/navigation.json', fields: [
        rows('nav', 'Main navigation', [required('label', 'Link text'), path('href', 'Destination'), field('section', 'Section'), flag('mega', 'Wide menu'),
          rows('menu', 'Menu links', navItem), group('feature', 'Featured link', [path('href', 'Destination'), field('eyebrow', 'Label'), title, text('text', 'Description')])]),
        rows('discover', 'Discover pages', [key, title, path('href', 'Destination'), field('icon', 'Icon name'), text('desc', 'Description')]),
        rows('pages', 'Search pages', [title, path('url', 'Page path'), text('desc', 'Description'), field('keywords', 'Keywords')])
      ] }
    ]
  });

  const status = document.getElementById('status');
  if (!window.CMS) {
    status.textContent = 'The editor could not load. Check your connection and refresh this page.';
    return;
  }
  window.CMS.init({ config: {
    load_config_file: false,
    backend: { name: 'github', repo: 'sush4nt1030/npjitfinal', branch: 'main', auth_methods: ['token'] },
    app_title: 'NISC Site Admin',
    site_url: 'https://www.nepalgunjitcommunity.com',
    display_url: new URL('../', location.href).href,
    logo_url: new URL('../assets/img/brand/nisc-mark-256.png', location.href).href,
    media_folder: '/assets/img', public_folder: '/assets/img',
    publish_mode: 'simple', collections
  } }).then(() => document.getElementById('startup').remove()).catch(error => {
    console.error(error);
    status.textContent = 'The content editor could not start. Refresh this page to try again.';
  });
})();
