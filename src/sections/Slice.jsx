import { useRef } from 'react'
import { gsap, ScrollTrigger, pad, reduced, useScene } from '../lib/scroll'
import { LAYERS } from '../lib/config'

const N = 40
const CX = 280
// Perfil de um vaso: raio de cada fatia, altura compacta (peça sólida) e altura explodida.
const SLICES = Array.from({ length: N }, (_, i) => {
  const t = i / (N - 1)
  const r = 120 + 78 * Math.sin(t * 3.3 + 0.5) - 30 * t
  return { t, r, y0: 690 - t * 250, y1: 700 - Math.pow(t, 1.35) * 640, hi: i === 0 || i === 20 || i === N - 1 }
})
const LABELS = [
  [N - 1, `Camada ${pad(LAYERS)} · topo`],
  [20, `Camada ${pad(LAYERS / 2)}`],
  [0, 'Camada 0001 · base'],
]

export default function Slice() {
  const count = useRef(null)

  const root = useScene((el) => {
    const q = gsap.utils.selector(el)
    const rings = q('.slice-ring')
    const labels = q('.slice-label')
    const ghost = q('.ghost')[0]
    const render = (p) => {
      const e = gsap.parseEase('power2.inOut')(p)
      SLICES.forEach((s, i) => {
        // As fatias de cima se soltam um pouco depois das de baixo.
        const local = gsap.utils.clamp(0, 1, e * 1.3 - s.t * 0.3)
        const y = s.y0 + (s.y1 - s.y0) * local
        rings[i].setAttribute('cy', y.toFixed(1))
        rings[i].style.opacity = s.hi ? 1 : 0.28 + 0.6 * s.t
      })
      LABELS.forEach(([idx], k) => {
        const s = SLICES[idx]
        const local = gsap.utils.clamp(0, 1, e * 1.3 - s.t * 0.3)
        labels[k].setAttribute('transform', `translate(${CX + s.r + 14} ${(s.y0 + (s.y1 - s.y0) * local).toFixed(1)})`)
        labels[k].style.opacity = gsap.utils.clamp(0, 1, (p - 0.25) * 4)
      })
      if (count.current) count.current.textContent = pad(1 + e * (LAYERS - 1), 3)
      if (ghost) ghost.style.transform = `translateX(${-p * 26}%)`
    }
    if (reduced) return render(1)
    render(0)
    ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (s) => render(s.progress),
    })
    gsap.from(q('.slice__text > *'), {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 55%' },
    })
  })

  return (
    <section className="slice track" data-theme="dark" ref={root} style={{ '--h': '260vh' }}>
      <div className="sticky slice__stage">
        <p className="ghost" aria-hidden="true">
          FATIAR
        </p>
        <div className="slice__text">
          <p className="mono eyebrow">Antes de imprimir</p>
          <h2 className="h2">Toda peça começa em fatias.</h2>
          <p className="lead">
            O modelo 3D é cortado em centenas de camadas finas. Cada camada vira um caminho que o bico percorre, uma por
            cima da outra, até a peça existir.
          </p>
          <dl className="stats">
            <div>
              <dd>0,2 mm</dd>
              <dt className="mono">Altura de cada camada</dt>
            </div>
            <div>
              <dd ref={count}>960</dd>
              <dt className="mono">Camadas nesta peça · ilustrativo</dt>
            </div>
          </dl>
        </div>
        <svg className="slice__art" viewBox="0 0 760 760" aria-hidden="true">
          {SLICES.map((s, i) => (
            <ellipse
              key={i}
              className={`slice-ring${s.hi ? ' is-hi' : ''}`}
              cx={CX}
              cy={s.y1}
              rx={s.r}
              ry={s.r * 0.16}
            />
          ))}
          {LABELS.map(([, txt]) => (
            <g key={txt} className="slice-label">
              <line x1="0" x2="46" y1="0" y2="0" />
              <text x="56" y="4">
                {txt.toUpperCase()}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  )
}
