import { useEffect } from 'react'
import { profile } from '../data/profile'

export function usePageMeta(title, description, path, noindex = false) {
  useEffect(() => {
    document.title = title
    const setMeta = (selector, value) => document.querySelector(selector)?.setAttribute('content', value)
    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:url"]', profile.siteUrl + path)
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', description)
    setMeta('meta[name="twitter:url"]', profile.siteUrl + path)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', profile.siteUrl + path)
    const robots = document.querySelector('meta[name="robots"]')
    robots?.setAttribute('content', noindex ? 'noindex, follow' : 'index, follow')
    return () => robots?.setAttribute('content', 'index, follow')
  }, [title, description, path, noindex])
}
