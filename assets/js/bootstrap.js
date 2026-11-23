// Admin edits and public pages share these JSON files, including lazy-loaded search.
const N = window.NISC = {};
const page = document.querySelector('script[data-content]');
const requests = new Map();

function read(name) {
  if (!requests.has(name)) {
    const url = new URL('../../content/' + name + '.json', import.meta.url);
    requests.set(name, fetch(url, { cache: 'no-cache' }).then(response => {
      if (!response.ok) throw new Error('Could not load ' + name);
      return response.json();
    }).catch(error => {
      requests.delete(name);
      throw error;
    }));
  }
  return requests.get(name);
}

async function loadGroup(name) {
  if (N[name]) return;
  switch (name) {
    case 'site': {
      const [site, navigation, activities] = await Promise.all(['settings', 'navigation', 'activities'].map(read));
      Object.assign(N, navigation, { site, activities });
      break;
    }
    case 'team': {
      const [settings, roles, current, alumni] = await Promise.all(['team-settings', 'roles', 'members', 'alumni'].map(read));
      N.team = { ...settings, roles, current, alumni };
      break;
    }
    case 'timeline': {
      const [phases, milestones] = await Promise.all(['phases', 'milestones'].map(read));
      N.timeline = { phases, milestones };
      break;
    }
    case 'gallery': {
      const [albums, photos] = await Promise.all(['albums', 'photos'].map(read));
      N.gallery = { albums, photos };
      break;
    }
    case 'resources':
      [N.resourceCategories, N.resources] = await Promise.all(['resource-categories', 'resources'].map(read));
      break;
    case 'updates':
      // The editor appends new entries. The public news feeds show newest first.
      N.updates = (await read('updates')).slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      break;
    default:
      N[name] = await read(name);
  }
}

N.loadData = names => Promise.all(names.map(loadGroup));

try {
  await N.loadData(page.dataset.content.split(' '));
  await import('./icons.js');
  await import('./core.js');
  await import('./ui.js');
  for (const name of (page.dataset.scripts || '').split(' ').filter(Boolean)) {
    await import('./' + name + '.js');
  }
  N.enhance(document);
} catch (error) {
  console.error(error);
  const notice = document.createElement('p');
  notice.className = 'container notice';
  notice.setAttribute('role', 'alert');
  notice.textContent = 'Some content could not be loaded. Refresh the page to try again.';
  document.querySelector('main').prepend(notice);
}
