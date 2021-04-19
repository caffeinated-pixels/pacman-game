const w = 'wall'
const b = 'blank'
const d = 'pac-dot'
const p = 'power-pill'
const l = 'ghost-lair'
const e = 'door'
const x = 'invisible-wall'
const f = 'bonus-sq'

// prettier-ignore
export const layout = [
  w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w,
  w, d, d, d, d, d, d, d, d, d, d, d, d, w, w, d, d, d, d, d, d, d, d, d, d, d, d, w,
  w, d, w, w, w, w, d, w, w, w, w, w, d, w, w, d, w, w, w, w, w, d, w, w, w, w, d, w,
  w, p, w, w, w, w, d, w, w, w, w, w, d, w, w, d, w, w, w, w, w, d, w, w, w, w, p, w,
  w, d, w, w, w, w, d, w, w, w, w, w, d, w, w, d, w, w, w, w, w, d, w, w, w, w, d, w,
  w, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, w,
  w, d, w, w, w, w, d, w, w, d, w, w, w, w, w, w, w, w, d, w, w, d, w, w, w, w, d, w,
  w, d, w, w, w, w, d, w, w, d, w, w, w, w, w, w, w, w, d, w, w, d, w, w, w, w, d, w,
  w, d, d, d, d, d, d, w, w, d, d, d, d, w, w, d, d, d, d, w, w, d, d, d, d, d, d, w,
  w, w, w, w, w, w, d, w, w, w, w, w, b, w, w, b, w, w, w, w, w, d, w, w, w, w, w, w,
  b, b, b, b, b, w, d, w, w, w, w, w, b, w, w, b, w, w, w, w, w, d, w, b, b, b, b, b,
  b, b, b, b, b, w, d, w, w, b, b, b, b, b, b, b, b, b, b, w, w, d, w, b, b, b, b, b,
  b, b, b, b, b, w, d, w, w, b, w, w, w, e, e, w, w, w, b, w, w, d, w, b, b, b, b, b,
  w, w, w, w, w, w, d, w, w, b, w, x, l, l, l, l, x, w, b, w, w, d, w, w, w, w, w, w,
  b, b, b, b, b, w, d, b, b, b, w, x, x, x, x, x, x, w, b, b, b, d, w, b, b, b, b, b,
  w, w, w, w, w, w, d, w, w, b, w, x, x, x, x, x, x, w, b, w, w, d, w, w, w, w, w, w,
  b, b, b, b, b, w, d, w, w, b, w, w, w, w, w, w, w, w, b, w, w, d, w, b, b, b, b, b,
  b, b, b, b, b, w, d, w, w, b, b, b, b, b, f, b, b, b, b, w, w, d, w, b, b, b, b, b,
  b, b, b, b, b, w, d, w, w, b, w, w, w, w, w, w, w, w, b, w, w, d, w, b, b, b, b, b,
  w, w, w, w, w, w, d, w, w, b, w, w, w, w, w, w, w, w, b, w, w, d, w, w, w, w, w, w,
  w, d, d, d, d, d, d, d, d, d, d, d, d, w, w, d, d, d, d, d, d, d, d, d, d, d, d, w,
  w, d, w, w, w, w, d, w, w, w, w, w, d, w, w, d, w, w, w, w, w, d, w, w, w, w, d, w,
  w, d, w, w, w, w, d, w, w, w, w, w, d, w, w, d, w, w, w, w, w, d, w, w, w, w, d, w,
  w, p, d, d, w, w, d, d, d, d, d, d, d, b, b, d, d, d, d, d, d, d, w, w, d, d, p, w,
  w, w, w, d, w, w, d, w, w, d, w, w, w, w, w, w, w, w, d, w, w, d, w, w, d, w, w, w,
  w, w, w, d, w, w, d, w, w, d, w, w, w, w, w, w, w, w, d, w, w, d, w, w, d, w, w, w,
  w, d, d, d, d, d, d, w, w, d, d, d, d, w, w, d, d, d, d, w, w, d, d, d, d, d, d, w,
  w, d, w, w, w, w, w, w, w, w, w, w, d, w, w, d, w, w, w, w, w, w, w, w, w, w, d, w,
  w, d, w, w, w, w, w, w, w, w, w, w, d, w, w, d, w, w, w, w, w, w, w, w, w, w, d, w,
  w, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, w,
  w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w
]
