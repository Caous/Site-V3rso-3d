import { gsap, ScrollTrigger, reduced, useScene } from '../lib/scroll'

const FILLED = 'Do chaveiro de capivara à peça do carro.'
const REST = 'Se cabe na mesa de impressão, a gente faz.'
const FACTS = [
  ['Varejo e atacado', 'Uma peça ou um lote inteiro.'],
  ['Envio', 'Para todo o Brasil.'],
  ['Orçamento', 'Direto pelo WhatsApp.'],
]

// 04 · Virada: a bancada clara cobre a câmara escura e a frase é preenchida palavra por palavra.
export function Statement() {
  const root = useScene((el) => {
    if (reduced) return
    const q = gsap.utils.selector(el)
    gsap.fromTo(
      q('.w'),
      { opacity: 0.14 },
      {
        opacity: 1,
        stagger: 0.12,
        ease: 'none',
        scrollTrigger: { trigger: q('.statement__phrase')[0], start: 'top 82%', end: 'bottom 45%', scrub: true },
      },
    )
    gsap.from(q('.fact'), {
      y: 26,
      opacity: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: q('.facts')[0], start: 'top 88%' },
    })
  })
  const words = (s) =>
    s.split(' ').map((w, i) => (
      <span className="w" key={i}>
        {w}{' '}
      </span>
    ))
  return (
    <section className="statement" data-theme="light" ref={root}>
      <div className="statement__fade" aria-hidden="true" />
      <div className="wrap">
        <p className="statement__phrase">
          {words(FILLED)}
          {words(REST)}
        </p>
        <ul className="facts">
          {FACTS.map(([l, t]) => (
            <li className="fact" key={l}>
              <span className="mono">{l}</span>
              <strong>{t}</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const CARDS = [
  ['decoracao', 'Decoração', 'Esculturas, vasos e peças de mesa.', 'Escultura de esqueleto de gato impressa em branco sobre base preta'],
  ['presentes', 'Presentes e datas', 'Natal, aniversário, lembrança com nome.', 'Quatro árvores de Natal em espiral impressas em verde'],
  ['chaveiros', 'Chaveiros e brindes', 'Capivara, logo da empresa, chaveiro com NFC.', 'Três chaveiros de capivara impressos em marrom e laranja'],
  ['action', 'Action figures', 'Personagens, bustos e colecionáveis.', 'Action figure de guerreiro impressa em branco, sem pintura'],
  ['pecas', 'Peças de carro e moto', 'A peça que quebrou e não se acha mais.', 'Peças pretas de reposição impressas ao lado de um paquímetro'],
  ['utilitarios', 'Utilitários', 'Suporte de capacete, porta-chaves, organizadores.', 'Suporte de capacete impresso em preto, com um capacete'],
]

// 05 · Peças: no desktop o scroll vertical vira movimento horizontal; no celular a faixa rola com o dedo.
export function Pieces() {
  const root = useScene((el) => {
    if (reduced) return
    const q = gsap.utils.selector(el)
    const mq = gsap.matchMedia()
    mq.add('(min-width: 900px)', () => {
      const rail = q('.pieces__rail')[0]
      const view = q('.pieces__view')[0]
      const ghost = q('.ghost')[0]
      const dist = () => Math.max(0, rail.scrollWidth - view.clientWidth)
      const size = () => el.style.setProperty('--h', `${window.innerHeight + dist() * 1.15}px`)
      size()
      ScrollTrigger.addEventListener('refreshInit', size)
      const imgs = q('.card img')
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (s) => {
          rail.style.transform = `translate3d(${-s.progress * dist()}px,0,0)`
          imgs.forEach((im) => (im.style.transform = `scale(1.16) translateX(${(s.progress - 0.5) * -8}%)`))
          ghost.style.transform = `translateX(${-s.progress * 30}%)`
        },
      })
      return () => {
        ScrollTrigger.removeEventListener('refreshInit', size)
        st.kill()
        el.style.removeProperty('--h')
        rail.style.transform = ''
      }
    })
  })

  return (
    <section className="pieces track" id="pecas" data-theme="light" ref={root}>
      <div className="sticky pieces__stage">
        <p className="ghost ghost--light" aria-hidden="true">
          DA MESA
        </p>
        <header className="pieces__head wrap">
          <div>
            <p className="mono eyebrow eyebrow--ink">O que já saiu da mesa</p>
            <h2 className="h2 h2--ink">Tem de tudo um pouco.</h2>
          </div>
          <p className="mono pieces__hint">
            <span className="only-desktop">Continue rolando</span>
            <span className="only-mobile">Arraste para o lado</span> →
          </p>
        </header>
        <div className="pieces__view" data-lenis-prevent-touch>
          <ul className="pieces__rail">
            {CARDS.map(([img, cat, desc, alt]) => (
              <li className="card" key={img}>
                <div className="card__photo">
                  <img src={`/img/card-${img}.webp`} alt={alt} loading="lazy" width="960" height="960" />
                </div>
                <p className="mono card__cat">{cat}</p>
                <p className="card__desc">{desc}</p>
              </li>
            ))}
          </ul>
        </div>
        <p className="mono pieces__note wrap">Fotos de demonstração geradas por IA. Entram aqui as fotos reais da V3rso.</p>
      </div>
    </section>
  )
}
