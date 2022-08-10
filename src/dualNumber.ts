import Fraction from "fraction.js";

export type DualNumber = number | Fraction;


export function mul(a: DualNumber, b: DualNumber): DualNumber {
  if (typeof a === "number" && typeof b === "number") {
    return a * b;
  }
  if (typeof a !== "number" && typeof b !== "number") {
    return a.mul(b);
  }
  return new Fraction(a).mul(new Fraction(b));
}

export function div(a: DualNumber, b: DualNumber): DualNumber {
  if (typeof a === "number" && typeof b === "number") {
    return a / b;
  }
  if (typeof a !== "number" && typeof b !== "number") {
    return a.div(b);
  }
  return new Fraction(a).div(new Fraction(b));
}

export function add(a: DualNumber, b: DualNumber): DualNumber {
  if (typeof a === "number" && typeof b === "number") {
    return a + b;
  }
  if (typeof a !== "number" && typeof b !== "number") {
    return a.add(b);
  }
  return new Fraction(a).add(new Fraction(b));
}

export function sub(a: DualNumber, b: DualNumber): DualNumber {
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  if (typeof a !== "number" && typeof b !== "number") {
    return a.sub(b);
  }
  return new Fraction(a).sub(new Fraction(b));
}
