import { Code2, ShoppingBag, Braces, Workflow } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { RevealOnScroll } from './effects/RevealOnScroll'
import { AutoScroll } from './ui/auto-scroll'

const categories = [
  { title: 'Shopify & commerce', icon: ShoppingBag, description: 'From the storefront to the final checkout step.', skills: ['Shopify Plus', 'Shopify Functions', 'Checkout Extensibility', 'Liquid', 'Shopify Flow', 'Klaviyo'] },
  { title: 'Frontend development', icon: Code2, description: 'Responsive interfaces with careful attention to the shopping experience.', skills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'SCSS', 'jQuery'] },
  { title: 'Backend & integrations', icon: Braces, description: 'Connecting commerce data and the tools teams depend on.', skills: ['GraphQL', 'Admin API', 'REST APIs', 'Webhooks', 'PHP', 'MySQL'] },
  { title: 'Delivery & quality', icon: Workflow, description: 'A considered path from implementation through launch.', skills: ['Git', 'Webpack', 'Agile / Scrum', 'Performance Optimization', 'SEO', 'Testing'] },
]

export default function TechStack() {
  return (
    <section id="tech-stack" tabIndex={-1} className="section-padding editorial-toolkit">
      <div className="container-width">
        <SectionHeading eyebrow="04 / The toolkit" title={<>Deep in Shopify.<br /><em className="editorial-em">Curious by nature.</em></>}>
          The technologies and practices I use to build, connect, and maintain commerce experiences.
        </SectionHeading>
        <div className="skills-marquee">
          <AutoScroll items={['Shopify Plus', 'Shopify Functions', 'Checkout Extensibility', 'Liquid', 'React', 'TypeScript', 'GraphQL', 'Admin API']} speed={45} />
        </div>
        <div className="toolkit-grid grid md:grid-cols-2 gap-5">
          {categories.map(({ title, icon: Icon, description, skills }, index) => (
            <RevealOnScroll key={title} delay={index * 0.05}>
              <article className="toolkit-card p-6 sm:p-8 h-full">
                <span className="toolkit-number studio-mono" aria-hidden="true">0{index + 1}</span>
                <div className="flex items-center gap-4 mb-4">
                  <div className="feature-icon shrink-0"><Icon size={23} aria-hidden="true" /></div>
                  <h3 className="text-xl sm:text-2xl font-semibold">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{description}</p>
                <ul className="flex flex-wrap gap-2">
                  {skills.map((skill) => <li key={skill} className="project-tag !px-3 !py-2 !text-sm">{skill}</li>)}
                </ul>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
