import Fraction from "fraction.js";
import {
  DualNumber,
  mul as nmul,
  div as ndiv,
  add as nadd,
  sub as nsub,
  asNum,
} from "./dualNumber";
import { Add, Subtract } from "./num";
import { one, zero } from "./util";

// keep in sync.
type BaseUnit =
  | "meter"
  | "second"
  | "kelvin"
  | "kg"
  | "ampere"
  | "candela"
  | "mol";

const baseUnits: BaseUnit[] = [
  "meter",
  "second",
  "kelvin",
  "kg",
  "ampere",
  "candela",
  "mol",
];

// Composition and Composition aliases
export type Composition = {
  [b in BaseUnit]: number;
};

const isSameDimensionality = (c1: Composition, c2: Composition): boolean => {
  for (let unit of baseUnits) {
    if (c1[unit] !== c2[unit]) {
      return false;
    }
  }
  return true;
};

const compositionToString = (c: Composition): string =>
  Object.entries(c)
    .filter(([_, value]) => value !== 0)
    .map(([key, value]) => {
      if (value === 1) {
        return key;
      }
      return `${key}^${value}`;
    })
    .join("*");

type FromPartial<T extends Partial<Composition>> = {
  [K in BaseUnit]: T[K] extends number ? T[K] : 0;
};

export type Dimensionality<T extends Partial<Composition>> = FromPartial<T>;

export const partialToFull = <T extends Partial<Composition>>(
  partial: T
): FromPartial<T> => {
  let composition: any = {};
  for (let key of baseUnits) {
    if (partial[key] !== undefined) {
      composition[key] = partial[key];
    } else {
      composition[key] = 0;
    }
  }
  return composition;
};

// Unit and Quantity classes
interface UnitOptions {
  abbreviation: string;
  multiplier: DualNumber;
  offset: DualNumber;
}

export class Unit<C extends Composition = Composition> {
  readonly _composition: C;
  // SI = value * multiplier + offset
  readonly _multiplier: DualNumber;
  // Might want to warn when multiplying units with non-zero offset
  readonly _offset: DualNumber;
  readonly abbreviation?: string;

  constructor(composition: C, options: Partial<UnitOptions> = {}) {
    const { abbreviation, multiplier = one, offset = zero } = options;
    this._composition = composition;
    this._multiplier = multiplier;
    this._offset = offset;
    this.abbreviation = abbreviation;
  }

  toString() {
    return this.abbreviation || compositionToString(this._composition);
  }

  quantity(value: DualNumber): Quantity<C> {
    return new Quantity(
      this._composition,
      nadd(nmul(value, this._multiplier), this._offset)
    );
  }

  per<C2 extends Composition>(
    unit: Unit<C2>
  ): Unit<{
    [key in BaseUnit]: Subtract<C[key], C2[key]>;
  }> {
    return divideUnit(this, unit);
  }

  times<C2 extends Composition>(
    value: Unit<C2>
  ): Unit<{
    [key in BaseUnit]: Add<C[key], C2[key]>;
  }> {
    return multiplyUnit(this, value);
  }

  squared(): Unit<{
    [key in BaseUnit]: Add<C[key], C[key]>;
  }> {
    return multiplyUnit(this, this);
  }

  cubed(): Unit<{
    [key in BaseUnit]: Add<C[key], Add<C[key], C[key]>>;
  }> {
    return multiplyUnit(this, this.squared());
  }

  mul = this.times;
  div = this.per;
  over = this.per;
}

export class Quantity<C extends Composition> {
  readonly _composition: C;
  readonly _value: DualNumber;

  constructor(composition: C, value: DualNumber) {
    this._composition = composition;
    this._value = value;
  }

  static of<C extends Composition>(
    value: DualNumber,
    unit: Unit<C>
  ): Quantity<C> {
    return unit.quantity(value);
  }

  in(unit: Unit<C>): number {
    if (!isSameDimensionality(this._composition, unit._composition)) {
      throw new Error("Dimensionalities don't match!");
    }
    return ndiv(nsub(this._value, unit._offset), unit._multiplier).valueOf();
  }

  toUnitString(unit: Unit<C>): string {
    return `${asNum(this._value)}${unit.toString()}`;
  }

  times<C2 extends Composition>(
    value: Quantity<C2>
  ): Quantity<{
    [key in BaseUnit]: Add<C[key], C2[key]>;
  }> {
    return multiplyQuantity(this, value);
  }

  per<C2 extends Composition>(
    value: Quantity<C2>
  ): Quantity<{
    [key in BaseUnit]: Subtract<C[key], C2[key]>;
  }> {
    return divideQuantity(this, value);
  }

  plus(value: Quantity<C>): Quantity<C> {
    if (!isSameDimensionality(this._composition, value._composition)) {
      throw new Error("Dimensionalities don't match!");
    }
    return add(this, value);
  }

  minus(value: Quantity<C>): Quantity<C> {
    if (!isSameDimensionality(this._composition, value._composition)) {
      throw new Error("Dimensionalities don't match!");
    }
    return subtract(this, value);
  }

  squared(): Quantity<{
    [key in BaseUnit]: Add<C[key], C[key]>;
  }> {
    return multiplyQuantity(this, this);
  }

  cubed(): Quantity<{
    [key in BaseUnit]: Add<C[key], Add<C[key], C[key]>>;
  }> {
    return multiplyQuantity(this, this.squared());
  }

  add = this.plus;
  sub = this.minus;
  mul = this.times;
  div = this.per;
  over = this.per;
}

// ---
// Multiplication and division of units and values
// ---
type MultiplyQuantityFn = <C1 extends Composition, C2 extends Composition>(
  a: Quantity<C1>,
  b: Quantity<C2>
) => Quantity<{
  [key in BaseUnit]: Add<C1[key], C2[key]>;
}>;

export const multiplyQuantity: MultiplyQuantityFn = (a, b) => {
  return new Quantity<any>(
    {
      meter: a._composition.meter + b._composition.meter,
      second: a._composition.second + b._composition.second,
      kelvin: a._composition.kelvin + b._composition.kelvin,
      kg: a._composition.kg + b._composition.kg,
      ampere: a._composition.ampere + b._composition.ampere,
      candela: a._composition.candela + b._composition.candela,
      mol: a._composition.mol + b._composition.mol,
    },
    nmul(a._value, b._value)
  );
};

type MultiplyUnitFn = <C1 extends Composition, C2 extends Composition>(
  a: Unit<C1>,
  b: Unit<C2>
) => Unit<{
  [key in BaseUnit]: Add<C1[key], C2[key]>;
}>;

const multiplyUnit: MultiplyUnitFn = (a, b) => {
  return new Unit<any>(
    {
      meter: a._composition.meter + b._composition.meter,
      second: a._composition.second + b._composition.second,
      kelvin: a._composition.kelvin + b._composition.kelvin,
      kg: a._composition.kg + b._composition.kg,
      ampere: a._composition.ampere + b._composition.ampere,
      candela: a._composition.candela + b._composition.candela,
      mol: a._composition.mol + b._composition.mol,
    },
    {
      multiplier: nmul(a._multiplier, b._multiplier),
    }
  );
};

type DivideQuantityFn = <C1 extends Composition, C2 extends Composition>(
  a: Quantity<C1>,
  b: Quantity<C2>
) => Quantity<{
  [key in BaseUnit]: Subtract<C1[key], C2[key]>;
}>;

export const divideQuantity: DivideQuantityFn = (a, b) => {
  return new Quantity<any>(
    {
      meter: a._composition.meter - b._composition.meter,
      second: a._composition.second - b._composition.second,
      kelvin: a._composition.kelvin - b._composition.kelvin,
      kg: a._composition.kg - b._composition.kg,
      ampere: a._composition.ampere - b._composition.ampere,
      candela: a._composition.candela - b._composition.candela,
      mol: a._composition.mol - b._composition.mol,
    },
    ndiv(a._value, b._value)
  );
};

type DivideUnitFn = <C1 extends Composition, C2 extends Composition>(
  a: Unit<C1>,
  b: Unit<C2>
) => Unit<{
  [key in BaseUnit]: Subtract<C1[key], C2[key]>;
}>;

export const divideUnit: DivideUnitFn = (a, b) => {
  return new Unit<any>(
    {
      meter: a._composition.meter - b._composition.meter,
      second: a._composition.second - b._composition.second,
      kelvin: a._composition.kelvin - b._composition.kelvin,
      kg: a._composition.kg - b._composition.kg,
      ampere: a._composition.ampere - b._composition.ampere,
      candela: a._composition.candela - b._composition.candela,
      mol: a._composition.mol - b._composition.mol,
    },
    {
      multiplier: ndiv(a._multiplier, b._multiplier),
    }
  );
};

// ---
// Addition and Subtraction
// ---
type BinFn = <C extends Composition>(
  a: Quantity<C>,
  b: Quantity<C>
) => Quantity<C>;

export const add: BinFn = (a, b) => {
  return new Quantity(a._composition, nadd(a._value, b._value));
};

export const subtract: BinFn = (a, b) => {
  return new Quantity(a._composition, nsub(a._value, b._value));
};

// ---
// Base unit aliases and constructors
// ---
// This should CERTAINLY be internal, because it's not actually valid for
// all extensions of Partial<Composition>
const siAlias = <PC extends Partial<Composition>>(
  pc: PC,
  abbreviation: string
): Unit<FromPartial<PC>> => {
  return new Unit(partialToFull(pc), {
    abbreviation,
  }) as any;
};

export const scalar = siAlias({}, "");
export const meters = siAlias({ meter: 1 } as const, "m");
export const seconds = siAlias({ second: 1 } as const, "s");
export const kelvins = siAlias({ kelvin: 1 } as const, "K");
export const kilograms = siAlias({ kg: 1 } as const, "kg");
export const amperes = siAlias({ ampere: 1 } as const, "A");
export const candelas = siAlias({ candela: 1 } as const, "cd");
export const moles = siAlias({ mol: 1 } as const, "mol");

export const q = Quantity.of;
