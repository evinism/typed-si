import Fraction from "fraction.js";

export type DualNumber = number | Fraction;


export function mul(a: DualNumber, b: DualNumber): DualNumber {
  if (typeof a !== "number" && typeof b !== "number") {
    return a.mul(b);
  }
  return asNum(a) * asNum(b);
}

export function div(a: DualNumber, b: DualNumber): DualNumber {
  if (typeof a !== "number" && typeof b !== "number") {
    return a.div(b);
  }
  return asNum(a) / asNum(b);
}

export function add(a: DualNumber, b: DualNumber): DualNumber {
  if (typeof a !== "number" && typeof b !== "number") {
    return a.add(b);
  }
  return asNum(a) + asNum(b);
}

export function sub(a: DualNumber, b: DualNumber): DualNumber {
  if (typeof a !== "number" && typeof b !== "number") {
    return a.sub(b);
  }
  return asNum(a) - asNum(b);
}

export function asNum(a: DualNumber): number {
  if (typeof a === "number") {
    return a;
  }
  return a.valueOf();
}
