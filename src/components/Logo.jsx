import { useId } from 'react'
import { logoBox, logoPath } from '../lib/logo'

// Logo de contorno: um traço grosso menos um traço fino (máscara), o que deixa as letras vazadas.
// Os dois traços da máscara levam a classe .logo-stroke para serem animados com stroke-dashoffset.
export default function Logo({ tail = 0, className = '', title = 'V3rso Impressão 3D', children, extraTop = 0 }) {
  const id = useId().replace(/:/g, '')
  const d = logoPath(tail)
  const b = logoBox(tail, extraTop)
  const common = { d, fill: 'none', strokeLinejoin: 'round', strokeLinecap: 'square', pathLength: 1 }
  return (
    <svg
      className={`logo ${className}`}
      viewBox={`${b.x} ${b.y} ${b.w} ${b.h}`}
      role="img"
      aria-label={title}
      overflow="visible"
    >
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={b.x} y={-14} width={b.w} height={128}>
          <path {...common} className="logo-stroke" stroke="#fff" strokeWidth="15" />
          <path {...common} className="logo-stroke" stroke="#000" strokeWidth="8.5" />
        </mask>
      </defs>
      {children}
      <rect className="logo-fill" x={b.x} y={-14} width={b.w} height={128} fill="currentColor" mask={`url(#${id})`} />
    </svg>
  )
}
