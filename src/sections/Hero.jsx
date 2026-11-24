import { useRef } from 'react'
import Logo from '../components/Logo'
import { logoPath } from '../lib/logo'
import { WHATSAPP, LAYERS, LAYER_MM } from '../lib/config'
import { gsap, ScrollTrigger, mm, onReady, pad, reduced, scrollToId, useScene } from '../lib/scroll'

const TAIL = 150
const STACK = 12 // camadas empilhadas que aparecem quando o logo "ganha altura"
const GAP = 3.8

export default function Hero() {
  const layer = useRef(null)
  const z = useRef(null)
  const bar = useRef(null)

  const root = useScene((el) => {
    if (reduced) return
    const q = gsap.utils.selector(el)
    const strokes = q('.logo-stroke')
    const guide = q('.hero-guide')[0]
    const nozzle = q('.hero-nozzle')[0]
    const layers = q('.hero-layer')
    const fill = q('.logo-fill')[0]
    const total = guide.getTotalLength()
    const place = (len, lift = 0) => {
      const pt = guide.getPointAtLength(len)
      nozzle.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${(pt.y - lift).toFixed(1)})`)
    }

    gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 })
    gsap.set(q('.hero__sig, .hero__eyebrow, .hero__lead, .hero__actions, .hud'), { opacity: 0, y: 14 })
    gsap.set(q('.pl > span'), { clipPath: 'inset(100% 0 0 0)' })
    gsap.set(nozzle, { opacity: 0 })
    place(0)

    // 1) Entrada: o bico desenha o contorno do logo, depois o título é "impresso" de baixo para cima.
    const drawn = { p: 0 }
    const intro = gsap
      .timeline({ paused: true, defaults: { ease: 'power2.out' } })
      .to(nozzle, { opacity: 1, duration: 0.3 })
      .to(strokes, { strokeDashoffset: 0, duration: 2.3, ease: 'power1.inOut' }, '<')
      .to(drawn, { p: 1, duration: 2.3, ease: 'power1.inOut', onUpdate: () => place(drawn.p * total) }, '<')
      .to(q('.hero__sig'), { opacity: 1, y: 0, duration: 0.5 }, '-=0.5')
      .to(q('.hero__eyebrow'), { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
      .to(q('.pl > span'), { clipPath: 'inset(0% 0 0 0)', duration: 0.9, ease: 'steps(16)', stagger: 0.25 }, '-=0.2')
      .to(q('.hero__lead, .hero__actions, .hud'), { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.5')
    const off = onReady(() => intro.play())

    // 2) Scroll: o logo sobe em camadas, o bico varre o topo, o painel conta, o piso corre.
    const floor = q('.floor__grid')[0]
    const copy = q('.hero__copy')[0]
    const stage = q('.hero__stage')[0]
    ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        const lift = Math.min(1, p / 0.7)
        layers.forEach((l, i) => {
          l.setAttribute('transform', `translate(0 ${(-(i + 1) * GAP * lift).toFixed(2)})`)
          l.style.opacity = lift > 0.01 ? 0.18 + 0.5 * (i / STACK) : 0
        })
        const top = (STACK + 1) * GAP * lift
        fill.setAttribute('transform', `translate(0 ${(-top).toFixed(2)})`)
        if (intro.progress() === 1) {
          const sweep = (Math.sin(p * 46) * 0.5 + 0.5) * total
          place(lift < 1 ? sweep : total, top)
        }
        floor.style.backgroundPositionY = `${p * 320}px`
        const n = 1 + p * (LAYERS - 1)
        if (layer.current) layer.current.textContent = `${pad(n)} / ${pad(LAYERS)}`
        if (z.current) z.current.textContent = `${mm(n * LAYER_MM)} mm`
        if (bar.current) bar.current.style.transform = `scaleX(${p})`
        const out = gsap.utils.clamp(0, 1, (p - 0.62) / 0.3)
        copy.style.opacity = 1 - out
        copy.style.transform = `translateY(${-out * 40}px)`
        stage.style.setProperty('--dim', out)
      },
    })
    return off
  })

  const d = logoPath(TAIL)
  return (
    <section className="hero track" id="topo" data-theme="dark" ref={root} style={{ '--h': '220vh' }}>
      <div className="sticky hero__stage">
        <div className="floor" aria-hidden="true">
          <div className="floor__grid" />
        </div>
        <div className="hero__glow" aria-hidden="true" />

        <div className="hero__logo">
          <Logo tail={TAIL} extraTop={130}>
            <path className="hero-guide" d={d} fill="none" stroke="none" />
            <g aria-hidden="true">
              {Array.from({ length: STACK }, (_, i) => (
                <path key={i} className="hero-layer" d={d} fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0" />
              ))}
            </g>
            <g className="hero-nozzle" aria-hidden="true">
              <circle r="15" cy="-2" fill="url(#heat)" />
              <path d="M-9 -22 H9 L3.5 -4 H-3.5 Z" fill="#C9A24A" />
              <rect x="-15" y="-46" width="30" height="24" rx="3" fill="#1A2A31" stroke="#5C6B70" />
            </g>
            <defs>
              <radialGradient id="heat">
                <stop offset="0" stopColor="#FF5B2E" stopOpacity="0.9" />
                <stop offset="1" stopColor="#FF5B2E" stopOpacity="0" />
              </radialGradient>
            </defs>
          </Logo>
          <p className="hero__sig mono" aria-hidden="true">
            <i />
            Impressão 3D
            <i />
          </p>
        </div>

        <div className="hero__copy">
          <p className="mono hero__eyebrow">Peças personalizadas · São Paulo · envio para todo o Brasil</p>
          <h1 className="hero__title">
            <span className="pl">
              <span>Se dá pra imaginar,</span>
            </span>{' '}
            <span className="pl pl--neon">
              <span>dá pra imprimir.</span>
            </span>
          </h1>
          <p className="hero__lead">
            Action figure, chaveiro, peça de carro, brinde da sua marca. Você manda a ideia pelo WhatsApp; a gente
            modela, imprime e envia.
          </p>
          <div className="hero__actions">
            <a className="btn btn--neon" href={WHATSAPP} target="_blank" rel="noreferrer">
              Pedir orçamento no WhatsApp
            </a>
            <a
              className="btn btn--ghost"
              href="#pecas"
              onClick={(e) => {
                e.preventDefault()
                scrollToId('pecas')
              }}
            >
              Ver o que já saiu da mesa
            </a>
          </div>
        </div>

        <aside className="hud mono" aria-label="Painel da impressora (ilustrativo)">
          <dl>
            <div>
              <dt>Status</dt>
              <dd>imprimindo v3rso.gcode</dd>
            </div>
            <div>
              <dt>Bico</dt>
              <dd className="hot">215 °C</dd>
            </div>
            <div>
              <dt>Mesa</dt>
              <dd>60 °C</dd>
            </div>
            <div>
              <dt>Camada</dt>
              <dd ref={layer}>0001 / 0960</dd>
            </div>
            <div>
              <dt>Z</dt>
              <dd ref={z}>0,2 mm</dd>
            </div>
          </dl>
          <div className="hud__bar">
            <i ref={bar} />
          </div>
          <p className="hud__hint">Role para imprimir ↓</p>
        </aside>
      </div>
    </section>
  )
}
