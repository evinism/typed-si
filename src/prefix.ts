import { DualNumber, mul } from "./dualNumber";
import { Composition, Unit } from "./unit";
import { f } from "./util";

type Prefix = <C extends Composition>(unit: Unit<C>) => Unit<C>;

const multiplierPrefix: (m: DualNumber) => Prefix =
  (multiplier: DualNumber) => (unit) => {
    return new Unit(unit._composition, {
      multiplier: mul(unit._multiplier, multiplier),
      abbreviation: unit.abbreviation,
    });
  };

export const yotta = multiplierPrefix(f(1e24, 1));
export const zetta = multiplierPrefix(f(1e21, 1));
export const exa = multiplierPrefix(f(1e18, 1));
export const peta = multiplierPrefix(f(1e15, 1));
export const tera = multiplierPrefix(f(1e12, 1));
export const giga = multiplierPrefix(f(1e9, 1));
export const mega = multiplierPrefix(f(1e6, 1));
export const kilo = multiplierPrefix(f(1e3, 1));
export const hecto = multiplierPrefix(f(1e2, 1));
export const deca = multiplierPrefix(f(1e1, 1));
export const deci = multiplierPrefix(f(1, 1e1));
export const centi = multiplierPrefix(f(1, 1e2));
export const milli = multiplierPrefix(f(1, 1e3));
export const micro = multiplierPrefix(f(1, 1e6));
export const nano = multiplierPrefix(f(1, 1e9));
export const pico = multiplierPrefix(f(1, 1e12));
export const femto = multiplierPrefix(f(1, 1e15));
export const atto = multiplierPrefix(f(1, 1e18));
export const zepto = multiplierPrefix(f(1, 1e21));
export const yocto = multiplierPrefix(f(1, 1e24));
