import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, Download, Linkedin, Mail, Phone } from 'lucide-react'
import { profile } from '../data/profile'
import { RevealOnScroll } from './effects/RevealOnScroll'

export default function Contact() {
  const [copyState, setCopyState] = useState('idle')
  const timer = useRef()
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copyEmail = async () => {
    window.clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
    timer.current = window.setTimeout(() => setCopyState('idle'), 4000)
  }

  return (
    <section id="contact" tabIndex={-1} className="section-padding editorial-contact relative">
      <div className="container-width">
        <RevealOnScroll>
          <p className="eyebrow">05 / Get in touch</p>
          <h2 className="contact-statement"><a href={'mailto:' + profile.email}><span>Have something<br /><em className="editorial-em">in mind?</em></span><span className="contact-orbit-link"><ArrowUpRight strokeWidth={1} aria-hidden="true" /></span></a></h2>
          <div className="contact-conversation">
            <div>
              <p className="contact-invitation">Tell me about your store, the integration that's proving difficult, or the team you're building. I'd be happy to talk.</p>
              <p className="contact-role-note">{profile.role}<br />{profile.currentRole} at {profile.currentCompany}</p>
            </div>
            <div className="contact-details">
              <a href={'mailto:' + profile.email} className="contact-email">{profile.email}<ArrowUpRight size={22} className="shrink-0" aria-hidden="true" /></a>
              <div className="flex flex-wrap gap-3 mt-5">
                <a href={'mailto:' + profile.email} className="button-primary"><Mail size={17} aria-hidden="true" />Email me</a>
                <button type="button" className="button-secondary" onClick={copyEmail}>
                  {copyState === 'copied' ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
                  {copyState === 'copied' ? 'Email copied' : 'Copy email'}
                </button>
              </div>
              <p className="text-sm text-muted-foreground min-h-6 mt-2" role="status" aria-live="polite">
                {copyState === 'copied' ? 'Email address copied to clipboard.' : copyState === 'failed' ? 'Please select the email address above to copy it, or use Email me.' : ''}
              </p>
              <div className="contact-socials">
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-link"><Linkedin size={16} aria-hidden="true" />LinkedIn<span className="sr-only"> (opens in a new tab)</span></a>
                <a href={profile.phoneHref} className="text-link"><Phone size={16} aria-hidden="true" />{profile.phone}</a>
                <a href={profile.resume} download className="text-link"><Download size={16} aria-hidden="true" />Résumé</a>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
