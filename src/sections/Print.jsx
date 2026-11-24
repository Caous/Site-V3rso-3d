import { useRef } from 'react'
import { gsap, ScrollTrigger, mm, pad, reduced, useScene } from '../lib/scroll'
import { LAYERS, LAYER_MM } from '../lib/config'

// A foto mostra a peça pronta sobre fundo preto. Uma máscara sobe com o scroll e revela a peça de baixo
// para cima; o bico fica na linha de corte. É a "impressão" controlada pelo usuário, sem vídeo.
const BASE = 0.17 // parte de baixo da foto (a mesa) já visível no início
const TOP = 0.74 // altura em que a peça termina

export default function Print() {
  const layer = useRef(null)
  const z = useRef(null)
  const now = useRef(null)

  const root = useScene((el) => {
    const q = gsap.utils.selector(el)
    const view = q('.print__view')[0]
    const ghost = q('.ghost')[0]
    const ticks = q('.ticks__on')[0]
    const render = (p) => {
      const r = BASE + (TOP - BASE) * p
      view.style.setProperty('--r', (r * 100).toFixed(2) + '%')
      view.style.setProperty('--nx', (50 + Math.sin(p * 70) * 14 * (1 - p * 0.4)).toFixed(2) + '%')
      view.style.setProperty('--done', p > 0.985 ? 1 : 0)
      const n = 1 + p * (LAYERS - 1)
      if (layer.current) layer.current.textContent = `Camada ${pad(n)} / ${pad(LAYERS)}`
      if (z.current) z.current.textContent = `Z ${mm(n * LAYER_MM)} mm`
      if (now.current) now.current.textContent = `${Math.round(p * 100)}% · camada ${pad(n)} de ${pad(LAYERS)} · ilustrativo`
      if (ticks) ticks.style.clipPath = `inset(0 ${(100 - p * 100).toFixed(2)}% 0 0)`
      if (ghost) ghost.style.transform = `translateX(${10 - p * 30}%)`
    }
    if (reduced) return render(1)
    render(0)
    ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (s) => render(gsap.utils.clamp(0, 1, s.progress / 0.9)),
    })
    gsap.from(q('.print__text > *'), {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 50%' },
    })
  })

  return (
    <section className="print track" data-theme="dark" ref={root} style={{ '--h': '380vh' }}>
      <div className="sticky print__stage">
        <p className="ghost" aria-hidden="true">
          CAMADA
        </p>
        <div className="print__text">
          <p className="mono eyebrow eyebrow--hot">
            <i /> Imprimindo
          </p>
          <h2 className="h2">Camada por camada, até ficar pronto.</h2>
          <p className="lead">
            Role devagar: cada movimento do scroll deposita mais uma camada. Volte e a peça desce de novo.
          </p>
        </div>

        <div className="print__view">
          <img src="/img/gato.webp" alt="Escultura de gato impressa em filamento ciano, com as linhas de camada visíveis" />
          <div className="print__nozzle" aria-hidden="true">
            <span />
          </div>
          <p className="chip mono chip--tl" ref={layer}>
            Camada 0001 / 0960
          </p>
          <p className="chip mono chip--tr" ref={z}>
            Z 0,2 mm
          </p>
        </div>

        <div className="print__ruler" aria-hidden="true">
          <div className="ticks">
            <div className="ticks__on" />
          </div>
          <div className="mono print__scale">
            <span>0%</span>
            <span ref={now} className="neon">
              0%
            </span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </section>
  )
}
