import { gsap, ScrollTrigger, reduced, useScene } from '../lib/scroll'

// A numeração aqui é informação real: as etapas acontecem nesta ordem.
const STEPS = [
  ['Você manda a ideia', 'Foto, desenho, arquivo 3D ou só a explicação. Tudo pelo WhatsApp.'],
  ['A gente orça', 'Preço e prazo antes de começar. Para uma peça ou para um lote.'],
  ['Modelagem e ajuste', 'Se o arquivo não existe, a gente modela. Você aprova antes de imprimir.'],
  ['Impressão e acabamento', 'Camada por camada. Depois, limpeza e conferência da peça.'],
  ['Envio', 'Embalada e enviada para qualquer lugar do Brasil.'],
]

export default function Process() {
  const root = useScene((el) => {
    const q = gsap.utils.selector(el)
    const steps = q('.step')
    if (reduced) {
      steps.forEach((s) => s.classList.add('is-on', 'is-done'))
      return
    }
    const list = q('.proc__list')[0]
    const fill = q('.proc__fill')[0]
    const nozzle = q('.proc__nozzle')[0]
    const state = steps.map(() => false)
    const paint = () =>
      steps.forEach((s, i) => {
        s.classList.toggle('is-on', state[i])
        s.classList.toggle('is-done', state[i] && !!state[i + 1])
        s.classList.toggle('is-now', state[i] && !state[i + 1])
      })
    ScrollTrigger.create({
      trigger: list,
      start: 'top 62%',
      end: 'bottom 62%',
      scrub: true,
      onUpdate: (s) => {
        fill.style.transform = `scaleY(${s.progress})`
        nozzle.style.top = `${s.progress * 100}%`
      },
    })
    steps.forEach((step, i) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 62%',
        onEnter: () => {
          state[i] = true
          paint()
        },
        onLeaveBack: () => {
          state[i] = false
          paint()
        },
      })
    })
    gsap.from(q('.proc__intro > *'), {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 65%' },
    })
    gsap.to(q('.ghost'), {
      xPercent: -18,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    })
  })

  return (
    <section className="proc" id="processo" data-theme="dark" ref={root}>
      <div className="proc__glow" aria-hidden="true" />
      <div className="floor floor--low" aria-hidden="true">
        <div className="floor__grid" />
      </div>
      <p className="ghost ghost--bottom" aria-hidden="true">
        ETAPAS
      </p>
      <div className="wrap proc__grid">
        <div className="proc__intro">
          <p className="mono eyebrow">Como funciona</p>
          <h2 className="h2">Da ideia à sua porta.</h2>
          <p className="lead">Cinco etapas. Em cada uma você sabe o que está acontecendo com a sua peça.</p>
        </div>
        <div className="proc__flow">
          <div className="proc__spool" aria-hidden="true" />
          <ol className="proc__list">
            <div className="proc__line" aria-hidden="true">
              <i className="proc__fill" />
              <b className="proc__nozzle" />
            </div>
            {STEPS.map(([title, text], i) => (
              <li className="step" key={title}>
                <span className="step__dot mono" aria-hidden="true">
                  <em>0{i + 1}</em>
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <div>
                  <p className="mono step__now">Imprimindo agora</p>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
