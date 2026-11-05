import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.mutechlab.education',
  // Old Wix addresses that have a new name, so existing links keep working.
  redirects: {
    '/home': '/',
    '/copy-of-matteo': '/luc',
    '/copy-of-andré': '/ipem',
    // Music Education Bites has its own site. The recorder's "Back" link points to /meb, so these must stay.
    '/meb': 'https://www.musiceducationbites.lu/',
    '/mebabout': 'https://www.musiceducationbites.lu/about',
    '/mebepisodes': 'https://www.musiceducationbites.lu/episodes',
    '/mebinteractive': 'https://www.musiceducationbites.lu/interactive',
    '/mebcontact': 'https://www.musiceducationbites.lu/contact',
    '/goodteaching': 'https://www.musiceducationbites.lu/goodteaching',
  },
});
