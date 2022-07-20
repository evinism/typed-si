import {
  meters,
  seconds,
  kilograms,
  Quantity,
  Unit,
  Composition,
} from "./unit";

export const alias = <C extends Composition>(
  unit: Unit<C>,
  abbreviation?: string,
  multiplier: number = 1
): Unit<C> => {
  return new Unit(unit.composition, unit.multiplier * multiplier, abbreviation);
};

// Quantity Aliases
export type Scalar = Quantity<{}>;
export type Area = Quantity<{ meter: 2 }>;
export type Volume = Quantity<{ meter: 3 }>;
export type Mass = Quantity<{ kg: 1 }>;
export type Speed = Quantity<{ meter: 1; second: -1 }>;
export type Acceleration = Quantity<{ meter: 1; second: -2 }>;
export type Temperature = Quantity<{ kelvin: 1 }>;
export type Pressure = Quantity<{ kg: 1; meter: -1; second: -2 }>;
export type Force = Quantity<{ kg: 1; meter: 1; second: -2 }>;
export type Energy = Quantity<{ kg: 1; meter: 2; second: -2 }>;
export type Power = Quantity<{ kg: 1; meter: 2; second: -3 }>;

// SI Unit Aliases
export const newtons: Unit<Force> = alias(
  kilograms.times(meters).over(seconds).over(seconds),
  "N",
  1
);
export const joules: Unit<Energy> = alias(newtons.times(meters), "J", 1);
export const pascals: Unit<Pressure> = alias(
  newtons.over(meters).over(meters),
  "Pa",
  1
);
export const watts: Unit<Power> = alias(joules.over(seconds), "W", 1);

// Derived SI Units
export const grams = alias(kilograms, "g", 0.001);

// Time aliases
export const minutes = alias(seconds, "min", 60);
export const hours = alias(minutes, "h", 60);
export const days = alias(hours, "d", 24);
export const weeks = alias(days, "w", 7);

// Imperial units:
export const pounds = alias(newtons, "lb", 0.224808943);
export const poundsForce = alias(pounds, "lbf");
export const poundsMass = alias(kilograms, "lbm", 0.45359237);
export const feet = alias(meters, "ft", 0.3048);
export const inches = alias(feet, "in", 12);
export const yards = alias(feet, "yd", 3);

export const footPounds = alias(joules, "ft⋅lbf", 1.3558179483314);

// Common units
export const gs = alias(meters.per(seconds).per(seconds), "g", 9.80665);
