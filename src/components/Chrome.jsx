import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import { WHATSAPP, LAYERS, LAYER_MM } from '../lib/config'
import { gsap, ScrollTrigger, lockScroll, mm, reduced, scrollToId } from '../lib/scroll'

const LINKS = [
  ['pecas', 'Peças'],
  ['processo', 'Como funciona'],
  ['cores', 'Cores'],
  ['atacado', 'Atacado'],
]

export function Nav() {
  const go = (id) => (e) => {
    e.preventDefault()
    scrollToId(id)
  }
  return (
    <header className="nav">
      <a className="nav__logo" href="#topo" onClick={go('topo')} aria-label="V3rso, voltar ao início">
        <Logo />
      </a>
      <nav className="nav__links" aria-label="Seções">
        {LINKS.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={go(id)}>
            {label}
          </a>
        ))}
      </nav>
      <a className="nav__cta" href={WHATSAPP} target="_blank" rel="noreferrer">
        Pedir orçamento <span aria-hidden="true">↗</span>
      </a>
    </header>
  )
}

// Régua Z: a posição do scroll é a altura da impressão. Substitui a barra de progresso.
export function ZRuler() {
  const marker = useRef(null)
  const label = useRef(null)
  const bar = useRef(null)
  useEffect(() => {
    const total = LAYERS * LAYER_MM
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const p = self.progress
        if (marker.current) marker.current.style.transform = `translateY(${-p * 100}%)`
        if (label.current) label.current.textContent = `Z ${mm(p * total)}`
        if (bar.current) bar.current.style.transform = `scaleX(${p})`
        // A navegação sai ao rolar para baixo e volta ao rolar para cima, para não cobrir o conteúdo.
        document.body.classList.toggle('nav-off', self.direction === 1 && self.scroll() > 120)
      },
    })
    return () => st.kill()
  }, [])
  return (
    <>
      <div className="zruler" aria-hidden="true">
        <div className="zruler__track" ref={marker}>
          <i />
          <span ref={label}>Z 0,0</span>
        </div>
      </div>
      <div className="zbar" aria-hidden="true">
        <i ref={bar} />
      </div>
    </>
  )
}

// Troca a cor da navegação e da régua conforme a seção que está no topo da tela.
export function useThemeWatcher() {
  useEffect(() => {
    const sts = [...document.querySelectorAll('[data-theme]')]
      .filter((el) => el !== document.body)
      .map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: 'top 40px',
          end: 'bottom 40px',
          onToggle: (self) => {
            if (self.isActive) document.body.dataset.theme = el.dataset.theme
          },
        }),
      )
    return () => sts.forEach((s) => s.kill())
  }, [])
}

// Pré-carregamento: o bico "aquece" de 25 a 215 °C enquanto fontes e imagens principais chegam.
export function Preloader({ assets = [] }) {
  const [gone, setGone] = useState(false)
  const root = useRef(null)
  const temp = useRef(null)
  const fill = useRef(null)

  useEffect(() => {
    const finish = () => {
      window.__v3ready = true
      window.dispatchEvent(new Event('v3:ready'))
      lockScroll(false)
      setGone(true)
      ScrollTrigger.refresh()
    }
    if (reduced) {
      finish()
      return
    }
    lockScroll(true)
    window.scrollTo(0, 0)
    const load = (src) =>
      new Promise((res) => {
        const im = new Image()
        im.onload = im.onerror = res
        im.src = src
      })
    const ready = Promise.race([
      Promise.all([document.fonts.ready, ...assets.map(load)]),
      new Promise((r) => setTimeout(r, 3500)),
    ])
    const v = { t: 25 }
    const heat = gsap.to(v, {
      t: 215,
      duration: 1.9,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (temp.current) temp.current.textContent = Math.round(v.t)
        if (fill.current) fill.current.style.transform = `scaleX(${(v.t - 25) / 190})`
      },
    })
    let dead = false
    Promise.all([ready, heat.then()]).then(() => {
      if (dead) return
      gsap
        .timeline({ onComplete: finish })
        .to(root.current.querySelector('.pre__status'), { opacity: 0, y: -8, duration: 0.25 })
        .to(root.current, { yPercent: -100, duration: 0.8, ease: 'power3.inOut' })
    })
    return () => {
      dead = true
      heat.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (gone) return null
  return (
    <div className="pre" ref={root} role="status" aria-live="polite">
      <div className="pre__box">
        <p className="mono pre__label">Aquecendo o bico</p>
        <p className="pre__temp">
          <span ref={temp}>25</span>
          <small>°C</small>
        </p>
        <div className="pre__bar">
          <i ref={fill} />
        </div>
        <p className="mono pre__status">Mesa 60 °C · nivelando · carregando v3rso.gcode</p>
      </div>
    </div>
  )
}
