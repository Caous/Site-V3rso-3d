import Logo from '../components/Logo'
import { SectionTag } from './Colors'
import { INSTAGRAM, WHATSAPP } from '../lib/config'
import { gsap, reduced, scrollToId, useScene } from '../lib/scroll'

const CONTACTS = [
  ['WhatsApp', 'Pedir orçamento', WHATSAPP],
  ['Instagram', '@v3rso3d', INSTAGRAM],
  ['Onde', 'Saúde · São Paulo', null],
  ['Envio', 'Todo o Brasil', null],
]
const LINKS = [
  ['pecas', 'Peças'],
  ['processo', 'Como funciona'],
  ['cores', 'Cores'],
  ['atacado', 'Atacado'],
]

export default function Closing() {
  const root = useScene((el) => {
    if (reduced) return
    const q = gsap.utils.selector(el)
    gsap.fromTo(
      q('.logo-stroke'),
      { strokeDasharray: 1, strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: 'power1.inOut',
        scrollTrigger: { trigger: q('.closing__logo')[0], start: 'top 75%' },
      },
    )
    gsap.from(q('.closing__cta > *, .closing__contacts li'), {
      y: 26,
      opacity: 0,
      stagger: 0.07,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: q('.closing__grid')[0], start: 'top 78%' },
    })
  })

  return (
    <section className="closing lined" id="contato" data-theme="light" ref={root}>
      <div className="wrap">
        <SectionTag n="10" label="Fechamento" right="Impressão concluída · 100%" />
        <div className="closing__logo">
          <Logo tail={150} />
        </div>
        <div className="closing__grid">
          <div className="closing__cta">
            <h2 className="h2 h2--ink h2--xl">
              Manda a{' '}
              <span className="boxed">
                <span>ideia.</span>
              </span>
            </h2>
            <p className="lead lead--ink">
              Diga o que é, o tamanho e quantas peças. A resposta vem com preço e prazo.
            </p>
            <a className="btn btn--cut" href={WHATSAPP} target="_blank" rel="noreferrer">
              Pedir orçamento no WhatsApp
            </a>
          </div>
          <ul className="closing__contacts">
            {CONTACTS.map(([label, value, href]) => (
              <li key={label}>
                <span className="mono">{label}</span>
                {href ? (
                  <a className="mono" href={href} target="_blank" rel="noreferrer">
                    {value} <i aria-hidden="true">↗</i>
                  </a>
                ) : (
                  <b className="mono">{value}</b>
                )}
              </li>
            ))}
          </ul>
        </div>
        <footer className="footer mono">
          <p>V3rso · Impressão 3D</p>
          <nav aria-label="Rodapé">
            {LINKS.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId(id)
                }}
              >
                {label}
              </a>
            ))}
          </nav>
          <p className="footer__end">Z 192,0 mm · fim</p>
        </footer>
      </div>
    </section>
  )
}
