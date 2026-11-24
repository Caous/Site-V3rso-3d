import { useRef, useState } from 'react'
import { gsap, reduced, useScene } from '../lib/scroll'

// Cores de exemplo: a lista real de filamentos ainda precisa ser confirmada com a V3rso.
const COLORS = [
  ['Branco', '#F6F6F3'],
  ['Preto', '#2A3136'],
  ['Verde', '#1F8A4C'],
  ['Vermelho', '#D8342B'],
  ['Laranja', '#F28A1E'],
  ['Amarelo', '#F2C230'],
  ['Azul', '#2458C5'],
  ['Ciano', '#1FE5D8'],
]

export function SectionTag({ n, label, right }) {
  return (
    <div className="tagrow">
      <p className="tag mono">
        <b>{n}</b> {label}
      </p>
      <p className="mono tagrow__right">{right}</p>
    </div>
  )
}

export default function Colors() {
  const [sel, setSel] = useState(7)
  const spool = useRef(null)

  const root = useScene((el) => {
    if (reduced) return
    const q = gsap.utils.selector(el)
    gsap.from(q('.colors__copy > *, .colors__list li'), {
      y: 24,
      opacity: 0,
      stagger: 0.05,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 60%' },
    })
    gsap.from(q('.colors__panel'), {
      clipPath: 'polygon(24px 0, 100% 0, 100% 0, 100% 0, 0 0, 0 24px)',
      duration: 1,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: el, start: 'top 55%' },
    })
    // O carretel inclina de leve acompanhando o mouse.
    const panel = q('.colors__panel')[0]
    const rx = gsap.quickTo(spool.current, '--rx', { duration: 0.8, ease: 'power3.out' })
    const ry = gsap.quickTo(spool.current, '--ry', { duration: 0.8, ease: 'power3.out' })
    const move = (e) => {
      const r = panel.getBoundingClientRect()
      ry(((e.clientX - r.left) / r.width - 0.5) * 34 - 24)
      rx(((e.clientY - r.top) / r.height - 0.5) * -22 + 8)
    }
    panel.addEventListener('pointermove', move)
    return () => panel.removeEventListener('pointermove', move)
  })

  const pick = (i) => {
    setSel(i)
    if (!reduced && spool.current) {
      gsap.fromTo(spool.current, { '--spin': 0 }, { '--spin': 360, duration: 0.9, ease: 'power3.out' })
    }
  }

  return (
    <section className="colors lined" id="cores" data-theme="light" ref={root}>
      <div className="wrap">
        <SectionTag n="08" label="Cores" right="Filamento · 8 cores de exemplo" />
        <div className="colors__grid">
          <div className="colors__copy">
            <h2 className="h2 h2--ink">
              Escolha{' '}
              <span className="boxed">
                <span>a cor.</span>
              </span>
            </h2>
            <p className="lead lead--ink">
              Toque em uma cor na lista e o carretel muda na hora. A peça sai na cor que você escolher.
            </p>
            <p className="mono colors__hint">Toque em uma cor →</p>
          </div>

          <div className="colors__panel" style={{ '--c': COLORS[sel][1] }}>
            <i className="corner corner--tl" />
            <i className="corner corner--tr" />
            <i className="corner corner--bl" />
            <i className="corner corner--br" />
            <div className="spool" ref={spool} role="img" aria-label={`Carretel de filamento na cor ${COLORS[sel][0]}`}>
              <div className="spool__disc" />
              <div className="spool__wind" />
              <div className="spool__hub" />
            </div>
            <p className="mono colors__name">{COLORS[sel][0]}</p>
          </div>

          <ul className="colors__list">
            {COLORS.map(([name, hex], i) => (
              <li key={name}>
                <button type="button" className="mono" aria-pressed={sel === i} onClick={() => pick(i)}>
                  {sel === i && <small>Selecionada</small>}
                  <span>{name}</span>
                  <i style={{ background: hex }} />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p className="mono colors__note">Cores de exemplo · lista real a confirmar</p>
      </div>
    </section>
  )
}
