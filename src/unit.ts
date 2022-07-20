// keep in sync.
type BaseUnit = "meter" | "second" | "kelvin" | "kg";
const baseUnits: BaseUnit[] = ["meter", "second", "kelvin", "kg"];

// Composition and Composition aliases
export type Composition = {
  [b in BaseUnit]: number;
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

export type Quantity<T extends Partial<Composition>> = FromPartial<T>;

const partialToFull = <T extends Partial<Composition>>(
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

// Value and Unit classes
export class Value<C extends Composition> {
  composition: C;
  value: number;

  constructor(composition: C, value: number) {
    this.composition = composition;
    this.value = value;
  }

  static of<C extends Composition>(value: number, unit: Unit<C>): Value<C> {
    return new Value(unit.composition, value * unit.multiplier);
  }

  in(unit: Unit<C>): number {
    return this.value * unit.multiplier;
  }

  toUnitString(unit: Unit<C>): string {
    return `${this.value}${unit.toString()}`;
  }

  times<C2 extends Composition>(
    value: Value<C2>
  ): Value<{
    [key in BaseUnit]: Add<C[key], C2[key]>;
  }> {
    return multiplyValue(this, value);
  }

  per<C2 extends Composition>(
    value: Value<C2>
  ): Value<{
    [key in BaseUnit]: Subtract<C[key], C2[key]>;
  }> {
    return divideValue(this, value);
  }

  over = this.per;

  plus(value: Value<C>): Value<C> {
    return add(this, value);
  }

  minus(value: Value<C>): Value<C> {
    return subtract(this, value);
  }
}

export class Unit<C extends Composition = Composition> {
  composition: C;
  multiplier: number;
  abbreviation?: string;

  constructor(composition: C, multiplier: number, abbreviation?: string) {
    this.composition = composition;
    this.multiplier = multiplier;
    this.abbreviation = abbreviation;
  }

  toString() {
    return this.abbreviation || compositionToString(this.composition);
  }

  value(value: number): Value<C> {
    return Value.of(value, this);
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
}

// ---
// Multiplication and division of units and values
// ---
type MultiplyValueFn = <C1 extends Composition, C2 extends Composition>(
  a: Value<C1>,
  b: Value<C2>
) => Value<{
  [key in BaseUnit]: Add<C1[key], C2[key]>;
}>;

export const multiplyValue: MultiplyValueFn = (a, b) => {
  return new Value<any>(
    {
      meter: a.composition.meter + b.composition.meter,
      second: a.composition.second + b.composition.second,
      kelvin: a.composition.kelvin + b.composition.kelvin,
      kg: a.composition.kg + b.composition.kg,
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
    },
    a.multiplier * b.multiplier
  );
};

type DivideValueFn = <C1 extends Composition, C2 extends Composition>(
  a: Value<C1>,
  b: Value<C2>
) => Value<{
  [key in BaseUnit]: Subtract<C1[key], C2[key]>;
}>;

export const divideValue: DivideValueFn = (a, b) => {
  return new Value<any>(
    {
      meter: a.composition.meter - b.composition.meter,
      second: a.composition.second - b.composition.second,
      kelvin: a.composition.kelvin - b.composition.kelvin,
      kg: a.composition.kg - b.composition.kg,
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
    a.multiplier / b.multiplier
  );
};

// ---
// Addition and Subtraction
// ---
type BinFn = <C extends Composition>(a: Value<C>, b: Value<C>) => Value<C>;

export const add: BinFn = (a, b) => {
  return new Value(a.composition, a.value + b.value);
};

export const subtract: BinFn = (a, b) => {
  return new Value(a.composition, a.value - b.value);
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
  return new Unit(partialToFull(pc), 1, abbreviation) as any;
};

export const meters = siAlias({ meter: 1 } as const, "m");
export const seconds = siAlias({ second: 1 } as const, "s");
export const kelvins = siAlias({ kelvin: 1 } as const, "K");
export const kilograms = siAlias({ kg: 1 } as const, "kg");
