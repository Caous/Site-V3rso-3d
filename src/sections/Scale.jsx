import { useRef } from 'react'
import { SectionTag } from './Colors'
import { gsap, ScrollTrigger, reduced, useScene } from '../lib/scroll'

const CELLS = Array.from({ length: 100 }, (_, i) => i)

// 09 · O número do painel de atacado conta de 1 a 100 com o scroll e a mesa enche, um quadrado por peça.
export default function Scale() {
  const num = useRef(null)
  const node = useRef(null)
  const note = useRef(null)

  const root = useScene((el) => {
    const q = gsap.utils.selector(el)
    const cells = q('.plate i')
    let last = -1
    const render = (p) => {
      const n = Math.round(1 + 99 * gsap.parseEase('power1.inOut')(gsap.utils.clamp(0, 1, p)))
      if (n === last) return
      last = n
      cells.forEach((c, i) => c.classList.toggle('is-on', i < n))
      if (num.current) num.current.textContent = n
      if (node.current) node.current.textContent = `×${n}`
      if (note.current) note.current.textContent = `${n} de 100 peças na mesa · ilustrativo`
    }
    if (reduced) return render(1)
    render(0)
    const mq = gsap.matchMedia()
    mq.add('(min-width: 900px)', () => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (s) => render((s.progress - 0.08) / 0.8),
      })
    })
    mq.add('(max-width: 899px)', () => {
      ScrollTrigger.create({
        trigger: q('.scale__diagram')[0],
        start: 'top 70%',
        end: 'bottom 75%',
        scrub: true,
        onUpdate: (s) => render(s.progress),
      })
    })
    gsap.from(q('.panel, .scale__node'), {
      y: 30,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: q('.scale__diagram')[0], start: 'top 80%' },
    })
  })

  return (
    <section className="scale lined track" id="atacado" data-theme="light" ref={root} style={{ '--h': '230vh' }}>
      <div className="sticky scale__stage">
        <div className="wrap">
          <SectionTag n="09" label="Varejo e atacado" right="O mesmo pedido, em escala" />
          <h2 className="h2 h2--ink scale__title">
            Uma peça ou{' '}
            <span className="boxed">
              <span>cem.</span>
            </span>
          </h2>

          <div className="scale__diagram">
            <article className="panel">
              <p className="mono panel__label">Varejo</p>
              <p className="panel__num">1</p>
              <p className="panel__text">Um presente, um reparo, uma ideia que só existe na sua cabeça.</p>
              <ul className="chips mono">
                <li>Presente</li>
                <li>Reparo</li>
                <li>Ideia sua</li>
              </ul>
            </article>

            <div className="scale__node" aria-hidden="true">
              <div className="boxed boxed--node">
                <span>
                  <b ref={node}>×1</b>
                  <small className="mono">Conta com o scroll</small>
                </span>
              </div>
            </div>

            <article className="panel panel--dark">
              <div className="plate" aria-hidden="true">
                {CELLS.map((i) => (
                  <i key={i} />
                ))}
              </div>
              <p className="mono panel__label">Atacado</p>
              <p className="panel__num" ref={num} aria-label="Até 100 peças ou mais">
                1
              </p>
              <p className="panel__text">
                Brindes, lembranças de evento e lotes para revenda. O orçamento é feito por lote.
              </p>
              <ul className="chips chips--dark mono">
                <li>Brindes</li>
                <li>Eventos</li>
                <li>Revenda</li>
              </ul>
            </article>
          </div>
          <p className="mono scale__note" ref={note}>
            1 de 100 peças na mesa · ilustrativo
          </p>
        </div>
      </div>
    </section>
  )
}
