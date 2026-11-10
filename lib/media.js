'use client'
import { useSyncExternalStore } from 'react'

// Keep in sync with the @media rules in app/globals.css.
// Phones lying down are wide but short: they get the mobile layout too.
export const MOBILE = '(max-width: 759px), (max-height: 500px)'
export const LANDSCAPE_PHONE = '(max-height: 500px) and (orientation: landscape)'

const useMedia = (q) => useSyncExternalStore((cb) => {
  const m = matchMedia(q)
  m.addEventListener('change', cb)
  return () => m.removeEventListener('change', cb)
}, () => matchMedia(q).matches, () => null) // null on the server: screen size unknown until hydration

export const useMobile = () => useMedia(MOBILE)
export const useLandscapePhone = () => useMedia(LANDSCAPE_PHONE)

const subFs = (cb) => {
  document.addEventListener('fullscreenchange', cb)
  return () => document.removeEventListener('fullscreenchange', cb)
}
export const useFullscreen = () => useSyncExternalStore(subFs, () => !!document.fullscreenElement, () => false)

export function toggleFullscreen() {
  try {
    if (document.fullscreenElement) document.exitFullscreen()
    else document.documentElement.requestFullscreen()
  } catch {}
}

const noop = () => () => {}
// iPhone Safari has no Fullscreen API for pages; hide the button there.
export const useCanFullscreen = () => useSyncExternalStore(noop, () => !!document.fullscreenEnabled, () => false)
