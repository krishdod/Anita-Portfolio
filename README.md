# Anita Dantani — Personal Portfolio

React + Vite portfolio for a Senior Shopify Plus Developer and E-commerce Technical Lead. The design retains the particle-name entrance, gradient typography, dark/light themes, and real project imagery.

## Run locally

Use Node.js 22.12+ or a newer supported LTS version, then:

```sh
npm install
npm run dev
```

Open the local address printed by Vite. If the machine's npm launcher is broken but dependencies are already installed, the equivalent preview command is:

```sh
node node_modules/vite/bin/vite.js --host 127.0.0.1
```

## Validate and build

```sh
npm run check
npm run build
npm run preview
```

The asset check verifies every project image variant, unique IDs and slugs, filter categories, HTTPS links, the résumé PDF, and social preview dimensions. It does not verify claims about client work or contact external project sites.

The production output is in `dist/`. Configure the hosting provider to serve `index.html` for application routes such as `/all-work`. Missing assets must still return a real 404 rather than the application HTML. No deployment is performed by these commands.

## Pages and interactions

- `/`: original particle entrance, hero, selected projects, about, experience, skills, contact.
- The hero has a manually controlled project showcase, with pointer tilt on fine-pointer devices and native external links. It does not auto-advance.
- The homepage work gallery uses asymmetric editorial layouts on desktop and a single column on mobile. The About explorer switches between three areas of expertise; native career disclosures expand with Enter or Space.
- `/all-work`: lazy-loaded gallery with search, industry filters, result counts, and an empty state.
- Unknown routes: helpful not-found page with links back to the portfolio.
- Section links use shareable hashes, for example `/#contact`.
- Search and filters are stored in the URL, for example `/all-work?industry=Footwear&q=paragon`.
- The mobile menu supports keyboard focus containment, Escape, and focus restoration.
- Theme follows the system until explicitly changed; theme and motion preferences are saved when browser storage is available.
- Reduced motion disables particle physics, smooth scrolling, ambient animation, and the moving marquee. Visitors can also pause site animations in the footer.
- Email, phone, LinkedIn, résumé download, and copy-email actions use the shared profile details.

## Editing content

- `src/data/profile.js`: contact details, résumé path, canonical domain, and navigation.
- Active résumé: `public/Anita_Shopify_developer_7Yrs.pdf`, copied unchanged from the supplied document. All résumé buttons use the shared profile path; keep the no-JavaScript link in `index.html` aligned when replacing it. Older PDFs are retained but are not linked by the interface.
- `src/data/projects.js`: the single source for project descriptions, tags, links, images, and industry filters.
- `src/components/Work.jsx`: employment history.
- `src/components/HeroEnhanced.jsx`: positioning and existing experience/project/client counts.
- `src/components/sections/About.jsx` and `src/components/TechStack.jsx`: expertise and skills.
- `src/index.css`: layout, theme tokens, typography, and shared UI styles.
- `src/studio.css`: the editorial design layer, project showcase, expertise explorer, career disclosures, and typographic contact/footer. Sections retain a continuous transparent background without divider lines.

Only publish professional claims that can be supported. The portfolio intentionally does not invent per-project roles, conversion lifts, revenue, or performance metrics. Before adding a case study, supply the actual problem, your role, the work you owned, and evidence for the outcome. Certification badges should link to a credential.

## Images

Original files remain in `public/projects/`. The UI requests responsive WebP variants from `public/projects/optimized/` with lazy loading and asynchronous decoding.

```sh
npm run images:optimize
npm run images:og
npm run check
```

The current 12 projects have 36 variants at 640, 960, and 1440 pixels. Keep filenames consistent with each project's slug. The generated social image is 1200 × 630. Originals are retained for editing and are copied into the build by Vite, but are not requested by project cards.

## Intro

The particle animation files retain the versions present at the start of this refinement. The entrance finishes via its existing callback and retains the original 20-second emergency fallback. An optional “Enter portfolio” button and Escape offer immediate access; either path restores scrolling. Internal navigation does not replay the intro, while a fresh homepage visit still does.

The homepage content continues to mount after the intro, as requested when the earlier entrance changes were reverted. Reduced-motion visitors see a brief static name screen. A no-JavaScript fallback provides the résumé and email.

## Search and social metadata

`index.html` contains the default description, social preview, canonical URL, and person data. Page-specific metadata updates on client navigation. `public/robots.txt` and `public/sitemap.xml` use the current configured domain, `https://anitadantani.com`; update these and the HTML when the domain changes.

This is a client-rendered application: social crawlers that do not execute JavaScript see the initial HTML metadata. For distinct per-route social cards or fully rendered search pages, use prerendering or server rendering on the chosen host.

## Manual release checks

1. Check the homepage at 375px, 768px, and desktop widths in light and dark mode.
2. Let the original entrance finish, then test its skip button and Escape on fresh visits.
3. Use the keyboard through navigation, project links, filters, and the mobile dialog.
4. Follow a header link from the gallery back to a homepage section.
5. Search/filter the gallery, test no results, then clear filters and use browser Back.
6. Pause animations and test section scrolling. Also check the operating system's reduced-motion preference.
7. Verify the résumé, email, phone, LinkedIn, all project images, and production deep links.
8. Switch between all three hero projects and expertise areas with both pointer and keyboard, and expand/collapse each career entry. Verify motion pause also disables the showcase tilt and name animation.
