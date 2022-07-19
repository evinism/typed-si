import { meters, seconds, kilograms, kelvins, Quantity, Unit, Composition, siAlias} from './unit';

export const alias = <C extends Composition>(unit: Unit<C>, multiplier: number): Unit<C> => {
  return new Unit(
    unit.composition,
    unit.multiplier * multiplier,
  );
}

// Quantity Aliases
export type Scalar = Quantity<{}>
export type Area = Quantity<{ meter: 2 }>;
export type Volume = Quantity<{ meter: 3 }>;
export type Mass = Quantity<{ kg: 1 }>;
export type Speed = Quantity<{ meter: 1; second: -1 }>;
export type Acceleration = Quantity<{ meter: 1; second: -2 }>;
export type Temperature = Quantity<{ kelvin: 1 }>;
export type Pressure = Quantity<{ kg: 1; meter: -1; second: -2 }>;
export type Energy = Quantity<{ kg: 1, meter: 2, second: -2 }>;

// SI Unit Aliases
export const joules = siAlias({ kg: 1, meter: 2, second: -2 } as const);
export const newtons = siAlias({ kg: 1, meter: 1, second: -2 } as const);
export const pascals = siAlias({ kg: 1, meter: -1, second: -2 } as const);
export const watts = siAlias({ kg: 1, meter: 2, second: -3 } as const);

// Things without clean aliases that we want more aliases for
export const metersPerSecond = siAlias({ meter: 1, second: -1 } as const);
export const metersPerSecondSquared = siAlias({ meter: 1, second: -2 } as const);

// Derived SI Units
export const grams = alias(kilograms, 0.001);

// Time aliases
export const minutes = alias(seconds, 60);
export const hours = alias(minutes, 60);
export const days = alias(hours, 24);
export const weeks = alias(days, 7);

// Imperial units:
export const pounds = alias(newtons, 0.224808943);
export const poundsForce = pounds;
export const poundsMass = alias(kilograms, 0.45359237);
export const feet = alias(meters, 0.3048);
export const inches = alias(feet, 12);
export const yards = alias(feet, 3);

export const footPounds = alias(joules, 1.3558179483314);

// Common Aliases
export const gs = alias(metersPerSecondSquared, 9.80665);
