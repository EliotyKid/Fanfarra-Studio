'use client'
import { useSyncExternalStore } from 'react'

const MOBILE = '(max-width: 759px)'
const subMobile = (cb) => {
  const m = matchMedia(MOBILE)
  m.addEventListener('change', cb)
  return () => m.removeEventListener('change', cb)
}
export const useMobile = () => useSyncExternalStore(subMobile, () => matchMedia(MOBILE).matches, () => false)

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
