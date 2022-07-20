import { Composition, Unit } from "./unit";

type Prefix = <C extends Composition>(unit: Unit<C>) => Unit<C>;

const multiplierPrefix: (m: number) => Prefix =
  (multiplier: number) => (unit) => {
    return new Unit(unit.composition, {
      multiplier: unit.multiplier * multiplier,
      abbreviation: unit.abbreviation,
    });
  };

export const yotta = multiplierPrefix(1e24);
export const zetta = multiplierPrefix(1e21);
export const exa = multiplierPrefix(1e18);
export const peta = multiplierPrefix(1e15);
export const tera = multiplierPrefix(1e12);
export const giga = multiplierPrefix(1e9);
export const mega = multiplierPrefix(1e6);
export const kilo = multiplierPrefix(1e3);
export const hecto = multiplierPrefix(1e2);
export const deca = multiplierPrefix(1e1);
export const deci = multiplierPrefix(1e-1);
export const centi = multiplierPrefix(1e-2);
export const milli = multiplierPrefix(1e-3);
export const micro = multiplierPrefix(1e-6);
export const nano = multiplierPrefix(1e-9);
export const pico = multiplierPrefix(1e-12);
export const femto = multiplierPrefix(1e-15);
export const atto = multiplierPrefix(1e-18);
export const zepto = multiplierPrefix(1e-21);
export const yocto = multiplierPrefix(1e-24);
