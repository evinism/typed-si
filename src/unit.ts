import { Add, Subtract } from "./num";

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

// Quantity and Unit classes
export class Quantity<C extends Composition> {
  composition: C;
  value: number;

  constructor(composition: C, value: number) {
    this.composition = composition;
    this.value = value;
  }

  static of<C extends Composition>(value: number, unit: Unit<C>): Quantity<C> {
    return unit.quantity(value);
  }

  in(unit: Unit<C>): number {
    if (!isSameDimensionality(this.composition, unit.composition)) {
      throw new Error("Dimensionalities don't match!");
    }
    return (this.value - unit.offset) / unit.multiplier;
  }

  toUnitString(unit: Unit<C>): string {
    return `${this.value}${unit.toString()}`;
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

  over = this.per;

  plus(value: Quantity<C>): Quantity<C> {
    if (!isSameDimensionality(this.composition, value.composition)) {
      throw new Error("Dimensionalities don't match!");
    }
    return add(this, value);
  }

  minus(value: Quantity<C>): Quantity<C> {
    if (!isSameDimensionality(this.composition, value.composition)) {
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
}

interface UnitOptions {
  abbreviation: string;
  multiplier: number;
  offset: number;
}

export class Unit<C extends Composition = Composition> {
  composition: C;
  // SI = value * multiplier + offset
  multiplier: number;
  // Might want to warn when multiplying units with non-zero offset
  offset: number;
  abbreviation?: string;

  constructor(composition: C, options: Partial<UnitOptions> = {}) {
    const { abbreviation, multiplier = 1, offset = 0 } = options;
    this.composition = composition;
    this.multiplier = multiplier;
    this.offset = offset;
    this.abbreviation = abbreviation;
  }

  toString() {
    return this.abbreviation || compositionToString(this.composition);
  }

  quantity(value: number): Quantity<C> {
    return new Quantity(
      this.composition,
      value * this.multiplier + this.offset
    );
  }

  per<C2 extends Composition>(
    unit: Unit<C2>
  ): Unit<{
    [key in BaseUnit]: Subtract<C[key], C2[key]>;
  }> {
    return divideUnit(this, unit);
  }

  over = this.per;

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
      meter: a.composition.meter + b.composition.meter,
      second: a.composition.second + b.composition.second,
      kelvin: a.composition.kelvin + b.composition.kelvin,
      kg: a.composition.kg + b.composition.kg,
      ampere: a.composition.ampere + b.composition.ampere,
      candela: a.composition.candela + b.composition.candela,
      mol: a.composition.mol + b.composition.mol,
    },
    a.value * b.value
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
      meter: a.composition.meter + b.composition.meter,
      second: a.composition.second + b.composition.second,
      kelvin: a.composition.kelvin + b.composition.kelvin,
      kg: a.composition.kg + b.composition.kg,
      ampere: a.composition.ampere + b.composition.ampere,
      candela: a.composition.candela + b.composition.candela,
      mol: a.composition.mol + b.composition.mol,
    },
    {
      multiplier: a.multiplier * b.multiplier,
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
      meter: a.composition.meter - b.composition.meter,
      second: a.composition.second - b.composition.second,
      kelvin: a.composition.kelvin - b.composition.kelvin,
      kg: a.composition.kg - b.composition.kg,
      ampere: a.composition.ampere - b.composition.ampere,
      candela: a.composition.candela - b.composition.candela,
      mol: a.composition.mol - b.composition.mol,
    },
    a.value / b.value
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
      meter: a.composition.meter - b.composition.meter,
      second: a.composition.second - b.composition.second,
      kelvin: a.composition.kelvin - b.composition.kelvin,
      kg: a.composition.kg - b.composition.kg,
    },
    {
      multiplier: a.multiplier / b.multiplier,
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
  return new Quantity(a.composition, a.value + b.value);
};

export const subtract: BinFn = (a, b) => {
  return new Quantity(a.composition, a.value - b.value);
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
