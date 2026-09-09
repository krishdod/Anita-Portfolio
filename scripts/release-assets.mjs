import { projects, getProjectImage } from '../src/data/projects.js'
import { profile } from '../src/data/profile.js'

// Only assets used by the public site are published. Source originals and old CVs stay local.
export const releaseAssets = [
  'favicon.svg', 'og-image.jpg', 'robots.txt', 'sitemap.xml', '404.html',
  profile.resume.slice(1),
  ...projects.flatMap((project) => [640, 960, 1440].map((width) => getProjectImage(project, width).slice(1))),
]
