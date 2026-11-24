// Sequência de frames em <canvas> controlada pelo scroll.
// O scroll define o frame alvo; o frame exibido persegue o alvo com lerp, e dois vizinhos são fundidos
// pela parte fracionária, para não haver degrau entre imagens.
export default class FrameSequence {
  constructor(canvas, { count, src, lerp = 0.14, windowRadius = 28, parallel = 6 }) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.count = count
    this.src = src
    this.lerp = lerp
    this.radius = windowRadius
    this.parallel = parallel
    this.bitmaps = new Array(count).fill(null)
    this.state = new Uint8Array(count) // 0 = nada, 1 = baixando, 2 = pronto
    this.tries = new Uint8Array(count)
    this.target = 0
    this.shown = -1
    this.pos = 0
    this.active = 0
    this.dead = false
    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(canvas)
    this.resize()
    this.pump()
    this.tick = this.tick.bind(this)
    this.raf = requestAnimationFrame(this.tick)
  }

  setProgress(p) {
    this.target = Math.min(1, Math.max(0, p)) * (this.count - 1)
    this.pump()
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const { width, height } = this.canvas.getBoundingClientRect()
    if (!width || !height) return
    this.canvas.width = Math.round(width * dpr)
    this.canvas.height = Math.round(height * dpr)
    this.shown = -1
  }

  // Baixa do mais perto do frame atual para o mais longe, dentro da janela.
  pump() {
    if (this.dead) return
    const c = Math.round(this.target)
    for (let d = 0; d <= this.radius && this.active < this.parallel; d++) {
      for (const i of d === 0 ? [c] : [c + d, c - d]) {
        if (i < 0 || i >= this.count || this.state[i] !== 0 || this.active >= this.parallel) continue
        this.load(i)
      }
    }
    for (let i = 0; i < this.count; i++) {
      if (this.state[i] === 2 && Math.abs(i - c) > this.radius * 2) {
        this.bitmaps[i].close?.()
        this.bitmaps[i] = null
        this.state[i] = 0
      }
    }
  }

  async load(i) {
    this.state[i] = 1
    this.active++
    try {
      const res = await fetch(this.src(i))
      if (!res.ok) throw new Error(String(res.status))
      const bmp = await createImageBitmap(await res.blob())
      if (this.dead) return bmp.close?.()
      this.bitmaps[i] = bmp
      this.state[i] = 2
      this.shown = -1
    } catch {
      this.tries[i]++
      this.state[i] = this.tries[i] < 2 ? 0 : 3
    } finally {
      this.active--
      this.pump()
    }
  }

  nearest(i) {
    for (let d = 0; d < this.count; d++) {
      if (this.bitmaps[i - d]) return this.bitmaps[i - d]
      if (this.bitmaps[i + d]) return this.bitmaps[i + d]
    }
    return null
  }

  draw(bmp, alpha) {
    const { width: cw, height: ch } = this.canvas
    const s = Math.max(cw / bmp.width, ch / bmp.height)
    const w = bmp.width * s
    const h = bmp.height * s
    this.ctx.globalAlpha = alpha
    this.ctx.drawImage(bmp, (cw - w) / 2, (ch - h) / 2, w, h)
  }

  tick() {
    if (this.dead) return
    this.pos += (this.target - this.pos) * this.lerp
    if (Math.abs(this.target - this.pos) < 0.002) this.pos = this.target
    if (Math.abs(this.pos - this.shown) > 0.01) {
      const i = Math.floor(this.pos)
      const a = this.nearest(i)
      if (a) {
        this.draw(a, 1)
        const b = this.bitmaps[i + 1]
        const f = this.pos - i
        if (b && f > 0.02) this.draw(b, f)
        this.shown = this.pos
      }
    }
    this.raf = requestAnimationFrame(this.tick)
  }

  destroy() {
    this.dead = true
    cancelAnimationFrame(this.raf)
    this.ro.disconnect()
    this.bitmaps.forEach((b) => b?.close?.())
  }
}
