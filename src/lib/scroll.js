import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const reduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isDesktop = () => window.matchMedia('(min-width: 900px)').matches

let lenis = null

// Lenis e GSAP rodam no mesmo loop, para o scroll suave e os ScrollTriggers nunca dessincronizarem.
export function initScroll() {
  if (reduced || lenis) return
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.4 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}

export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start()
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.4 })
  else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
}

// Cria um gsap.context preso ao elemento raiz da seção e limpa tudo ao desmontar.
export function useScene(setup) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => setup(ref.current), ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ref
}

// Executa quando o pré-carregamento termina (ou na hora, se já terminou).
export function onReady(fn) {
  if (window.__v3ready) {
    fn()
    return () => {}
  }
  const h = () => fn()
  window.addEventListener('v3:ready', h, { once: true })
  return () => window.removeEventListener('v3:ready', h)
}

export const clamp01 = (v) => Math.min(1, Math.max(0, v))
export const pad = (n, len = 4) => String(Math.round(n)).padStart(len, '0')
export const mm = (n) => n.toFixed(1).replace('.', ',')

export { gsap, ScrollTrigger }
