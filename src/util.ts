import Fraction from "fraction.js";

export const f = (num: number, den: number) => new Fraction(num, den);
export const zero = f(0, 1);
export const one = f(1, 1);
