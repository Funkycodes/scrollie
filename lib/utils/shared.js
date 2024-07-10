export const is = {
  def: (v) => v !== void 0,
  undef: v => v === void 0,
  array: v => v.constructor === Array,
  obj: v => v.constructor === Object
};