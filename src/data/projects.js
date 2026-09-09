export const projects = [
  {
    id: '01',
    slug: 'byneil',
    title: 'ByNeil',
    description:
      'Luxury e-commerce platform migrated from Magento to Shopify Plus.',
    tags: ['Shopify Plus', 'Migration', 'Luxury'],
    link: 'https://www.byneilny.com/',
    category: 'Jewellery Store',
  },
  {
    id: '02',
    slug: 'sabyasachi',
    title: 'Sabyasachi',
    description:
      'Premium Indian luxury brand with complex catalog and luxury commerce requirements.',
    tags: ['Shopify Plus', 'Luxury', 'Custom'],
    link: 'https://sabyasachi.com/',
    category: 'Luxury Bridal Store',
  },
  {
    id: '03',
    slug: 'deckingwood',
    title: 'Decking Wood',
    description:
      'Premium decking e-commerce experience with custom tools and optimized purchasing flows.',
    tags: ['E-commerce', 'Custom Tools', 'B2C'],
    link: 'https://www.deckingwood.com.au/',
    category: 'E-commerce Timber Store',
  },
  {
    id: '04',
    slug: 'nickron-india',
    title: 'Nickron India',
    description:
      'Footwear commerce experience with migration, marketing automation and integrations.',
    tags: ['Migration', 'Automation', 'Marketing'],
    link: 'https://nickronindia.com/',
    category: 'Footwear Store',
  },
  {
    id: '05',
    slug: 'mymystyle',
    title: 'My-My Style',
    description:
      'Fashion commerce platform focused on modern product discovery and shopping experience.',
    tags: ['Fashion', 'E-commerce', 'Modern'],
    link: 'https://www.mymystyle.com/',
    category: 'Fashion',
  },
  {
    id: '06',
    slug: 'assay',
    title: 'Assay Jewelers',
    description:
      'Fine-jewelry commerce experience with advanced product discovery and high-value purchases.',
    tags: ['Luxury Jewelry', 'High-Ticket', 'Security'],
    link: 'https://assayjewelers.com/',
    category: 'Jewelry',
  },
  {
    id: '07',
    slug: 'mou',
    title: 'MOU',
    description:
      'International footwear commerce experience with custom galleries and multi-currency support.',
    tags: ['Custom Development', 'Multi-Currency', 'Footwear'],
    link: 'https://www.mou.com/',
    category: 'Footwear Store',
  },
  {
    id: '08',
    slug: 'fabricofsociety',
    title: 'Fabric of Society',
    description:
      'Luxury fashion commerce experience focused on premium merchandising and presentation.',
    tags: ['Custom Development', 'Luxury', 'Fashion'],
    link: 'https://fabricofsociety.luxury/',
    category: 'Luxury Fashion',
  },
  {
    id: '09',
    slug: 'e3k',
    title: 'E3K',
    description:
      'International commerce platform supporting global shopping requirements.',
    tags: ['International', 'Multi-Language', 'E-commerce'],
    link: 'https://e3k.shop/en-in',
    category: 'Global Store',
  },
  {
    id: '10',
    slug: 'baggit',
    title: 'Baggit',
    description:
      'Fashion commerce storefront focused on product discovery and performance.',
    tags: ['Sustainability', 'Fashion', 'Performance'],
    link: 'https://baggit.com/',
    category: 'Sustainable Brand',
  },
  {
    id: '11',
    slug: 'paragon',
    title: 'Paragon Footwear',
    description:
      'Large-catalog multi-brand commerce experience optimized for mobile shopping.',
    tags: ['Multi-Brand', 'Large Inventory', 'Mobile'],
    link: 'https://paragonfootwear.com/',
    category: 'Multi-Brand',
  },
  {
    id: '12',
    slug: 'nude-project',
    title: 'Nude Project',
    description:
      'Contemporary fashion storefront with minimalist merchandising and shopping UX.',
    tags: ['Fashion', 'Minimalist', 'Modern'],
    link: 'https://nude-project.com/',
    category: 'Minimalist',
  },
].map((project) => ({
  ...project,
  industry: {
    byneil: 'Jewelry', sabyasachi: 'Fashion', deckingwood: 'Home & lifestyle',
    'nickron-india': 'Footwear', mymystyle: 'Fashion', assay: 'Jewelry',
    mou: 'Footwear', fabricofsociety: 'Fashion', e3k: 'Global commerce',
    baggit: 'Fashion', paragon: 'Footwear', 'nude-project': 'Fashion',
  }[project.slug],
}))

export const projectIndustries = ['All projects', 'Fashion', 'Jewelry', 'Footwear', 'Home & lifestyle', 'Global commerce']

export function getProjectImage(project, width = 960) {
  return `/projects/optimized/${project.slug}-${width}.webp`
}

export function getProjectSrcSet(project) {
  return [
    `${getProjectImage(project, 640)} 640w`,
    `${getProjectImage(project, 960)} 960w`,
    `${getProjectImage(project, 1440)} 1440w`,
  ].join(', ')
}
