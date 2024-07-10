export const clamp = (i, f, v) => Math.min(f, Math.max(i, v));
export const lerp = (i, f, a) => (1 - a) * i + f * a;
export const round = (t, i) => {
  i = R.Is.und(i) ? 100 : 10 ** i;
  return Math.round(t * i) / i;
};
export const range = (i, f, s) => {
  const r = [];
  f = f === void 0 ? (i = 0, i) : f;
  for (let e = i; e < f; e += s) {
    r.push(e);
  }
  return r;
};
export const iLerp = (i, f, v) => clamp(0, 1, (v - i) / (f - i));
export const mapRange = (a, b, v, x, y) => {
  return (v - a) / (b - a) * (x - y) + v;
};
export const normalize = (i, f, v) => remap(i, f, v, 0, 1);
export const getDistance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
export const ease = {
  linear: t => t,
  i1: t => 1 - Math.cos(t * (.5 * Math.PI)),
  o1: t => Math.sin(t * (.5 * Math.PI)),
  io1: t => -.5 * (Math.cos(Math.PI * t) - 1),
  i2: t => t * t,
  o2: t => t * (2 - t),
  io2: t => t < .5 ? 2 * t * t : (4 - 2 * t) * t - 1,
  i3: t => t * t * t,
  o3: t => --t * t * t + 1,
  io3: t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  i4: t => t * t * t * t,
  o4: t => 1 - --t * t * t * t,
  io4: t => t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  i5: t => t * t * t * t * t,
  o5: t => 1 + --t * t * t * t * t,
  io5: t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
  i6: t => 0 === t ? 0 : 2 ** (10 * (t - 1)),
  o6: t => 1 === t ? 1 : 1 - 2 ** (-10 * t),
  io6: t => 0 === t || 1 === t ? t : (t /= .5) < 1 ? .5 * 2 ** (10 * (t - 1)) : .5 * (2 - 2 ** (-10 * --t))
};

export function animate(draw, duration, easeFn) {
  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    const elapsed = time - start;
    const timeFraction = Math.min(elapsed / duration, 1);
    const progress = easeFn(timeFraction);
    draw(progress);
    if (timeFraction !== 1) {
      requestAnimationFrame(animate);
    }
  });
}