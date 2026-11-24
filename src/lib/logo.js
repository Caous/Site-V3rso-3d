// Esqueleto das letras do logo V3rso (redesenho). As letras são desenhadas retas e inclinadas por SLANT.
const SLANT = 0.22
const sl = (x, y) => `${+(x + (100 - y) * SLANT).toFixed(1)} ${y}`
const seg = (c, ox) => {
  let o = c[0]
  for (let i = 1; i < c.length; i += 2) o += ' ' + sl(c[i] + ox, c[i + 1])
  return o
}

const LETTERS = [
  [0, [['M', 'TAIL', 0], ['L', 0, 0], ['L', 36, 100], ['L', 84, 0]]],
  [112, [['M', 0, 0], ['L', 50, 0], ['Q', 68, 0, 68, 18], ['L', 68, 32], ['Q', 68, 50, 50, 50], ['L', 20, 50], ['M', 50, 50], ['Q', 68, 50, 68, 68], ['L', 68, 82], ['Q', 68, 100, 50, 100], ['L', 0, 100]]],
  [212, [['M', 0, 100], ['L', 0, 18], ['Q', 0, 0, 18, 0], ['L', 62, 0]]],
  [296, [['M', 66, 0], ['L', 18, 0], ['Q', 0, 0, 0, 18], ['L', 0, 32], ['Q', 0, 50, 18, 50], ['L', 48, 50], ['Q', 66, 50, 66, 68], ['L', 66, 82], ['Q', 66, 100, 48, 100], ['L', 0, 100]]],
  [392, [['M', 18, 0], ['L', 50, 0], ['Q', 68, 0, 68, 18], ['L', 68, 82], ['Q', 68, 100, 50, 100], ['L', 18, 100], ['Q', 0, 100, 0, 82], ['L', 0, 18], ['Q', 0, 0, 18, 0], ['Z']]],
]

export const LOGO_PAD = 14
export const LOGO_LETTERS_W = 482

export function logoPath(tail = 150) {
  return LETTERS.map(([ox, cs]) =>
    cs.map((c) => seg(c[1] === 'TAIL' ? ['M', -tail, 0] : c, ox)).join(' '),
  ).join(' ')
}

export function logoBox(tail = 150, extraTop = 0) {
  return {
    x: -tail - LOGO_PAD,
    y: -LOGO_PAD - extraTop,
    w: tail + LOGO_LETTERS_W + LOGO_PAD * 2,
    h: 100 + LOGO_PAD * 2 + extraTop,
  }
}
