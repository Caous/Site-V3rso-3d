import { useRef } from 'react'
import FrameSequence from '../lib/FrameSequence'
import { gsap, ScrollTrigger, isDesktop, pad, reduced, useScene } from '../lib/scroll'
import { LAYERS } from '../lib/config'

// Ângulo em graus (0 = direita, sentido anti-horário). O anel de progresso anda no sentido horário a
// partir do topo, então cada frase acende quando o anel passa pelo ângulo dela.
const ITEMS = [
  ['Porta-chaves', 'Aquele em forma de carro esportivo.', 32],
  ['Peça de carro', 'A que quebrou e não se acha mais.', 0],
  ['Action figure', 'Do personagem que você escolher.', -32],
  ['Chaveiro de capivara', 'Ou do bicho, logo ou nome que for.', 212],
  ['Suporte de capacete', 'Na medida da sua parede.', 180],
  ['Brinde com NFC', 'Encosta o celular e abre o link.', 148],
].map(([title, text, a]) => {
  const rad = (a * Math.PI) / 180
  const clock = (90 - a + 360) % 360
  return { title, text, cos: Math.cos(rad), sin: Math.sin(rad), at: (clock / 360) * 0.9, right: Math.cos(rad) > 0 }
})
const RING = 2 * Math.PI * 380
const TICKS = Array.from({ length: 72 }, (_, i) => i * 5)

export default function Printer() {
  const canvas = useRef(null)
  const layer = useRef(null)
  const pct = useRef(null)

  const root = useScene((el) => {
    const q = gsap.utils.selector(el)
    const desktop = isDesktop()
    const seq = new FrameSequence(canvas.current, {
      count: desktop ? 193 : 97,
      src: (i) => `/frames/${desktop ? 'printer' : 'printer-m'}/f_${String(i + 1).padStart(4, '0')}.webp`,
      lerp: 0.16,
      windowRadius: desktop ? 30 : 20,
    })
    const ring = q('.printer-ring')[0]
    const ticks = q('.printer-ticks')[0]
    const phrases = q('.phrase')
    const nodes = q('.printer-node')
    const render = (p) => {
      const fill = gsap.utils.clamp(0, 1, p / 0.9)
      seq.setProgress(fill)
      ring.style.strokeDashoffset = RING * (1 - fill)
      ticks.style.transform = `rotate(${p * 40}deg)`
      let current = -1
      ITEMS.forEach((it, i) => {
        const on = p >= it.at
        phrases[i].classList.toggle('is-on', on)
        nodes[i].classList.toggle('is-on', on)
        if (on) current = i
      })
      phrases.forEach((ph, i) => ph.classList.toggle('is-current', i === Math.max(0, current)))
      if (layer.current) layer.current.textContent = `Camada ${pad(1 + fill * (LAYERS - 1))} / ${pad(LAYERS)}`
      if (pct.current) pct.current.textContent = `${Math.round(fill * 100)}%`
    }
    if (reduced) {
      render(1)
      return () => seq.destroy()
    }
    render(0)
    ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (s) => render(s.progress),
    })
    gsap.from(q('.printer__orbit'), {
      scale: 0.86,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 60%' },
    })
    return () => seq.destroy()
  })

  return (
    <section className="printer track" data-theme="dark" ref={root} style={{ '--h': '440vh' }}>
      <div className="sticky printer__stage">
        <div className="floor floor--low" aria-hidden="true">
          <div className="floor__grid" />
        </div>
        <header className="printer__head">
          <p className="mono eyebrow">Impressora ligada</p>
          <h2 className="h2 h2--sm">O que você quer que saia daqui?</h2>
        </header>

        <div className="printer__orbit">
          <div className="printer__glow" aria-hidden="true" />
          <svg className="printer__rings" viewBox="0 0 1000 1000" aria-hidden="true">
            <circle className="printer-orbit" cx="500" cy="500" r="440" />
            <g className="printer-ticks">
              {TICKS.map((a) => (
                <line key={a} x1="500" y1={a % 30 === 0 ? 86 : 92} x2="500" y2="100" transform={`rotate(${a} 500 500)`} />
              ))}
            </g>
            <circle className="printer-track" cx="500" cy="500" r="380" />
            <circle
              className="printer-ring"
              cx="500"
              cy="500"
              r="380"
              transform="rotate(-90 500 500)"
              strokeDasharray={RING}
              strokeDashoffset={RING}
            />
            {ITEMS.map((it) => (
              <circle key={it.title} className="printer-node" cx={500 + 440 * it.cos} cy={500 - 440 * it.sin} r="9" />
            ))}
          </svg>
          <div className="printer__screen">
            <canvas ref={canvas} role="img" aria-label="Impressora 3D imprimindo um carro em miniatura, da mesa vazia até a peça pronta" />
          </div>
          <ul className="printer__phrases">
            {ITEMS.map((it) => (
              <li
                key={it.title}
                className={`phrase ${it.right ? 'phrase--r' : 'phrase--l'}`}
                style={{ '--cx': it.cos.toFixed(4), '--sy': it.sin.toFixed(4) }}
              >
                <strong>{it.title}</strong>
                <span>{it.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mono printer__read">
          <span ref={layer}>Camada 0001 / 0960</span>
          <span className="neon" ref={pct}>
            0%
          </span>
          <span className="hot">Bico 215 °C</span>
          <span className="only-desktop">Números ilustrativos</span>
        </p>
      </div>
    </section>
  )
}
