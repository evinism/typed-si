import Fraction from "fraction.js";
import { DualNumber, mul } from "./dualNumber";
import {
  meters,
  seconds,
  kilograms,
  Dimensionality,
  Unit,
  Composition,
  amperes,
  scalar,
  partialToFull,
  kelvins,
  moles,
  candelas,
} from "./unit";
import { f, one } from "./util";

export const alias = <C extends Composition>(
  unit: Unit<C>,
  abbreviation?: string,
  multiplier: DualNumber = one
): Unit<C> => {
  return new Unit(unit._composition, {
    multiplier: mul(unit._multiplier, multiplier),
    abbreviation,
  });
};

// Dimensionality Aliases
export type Scalar = Dimensionality<{}>;
export type Area = Dimensionality<{ meter: 2 }>;
export type Volume = Dimensionality<{ meter: 3 }>;
export type Mass = Dimensionality<{ kg: 1 }>;
export type Length = Dimensionality<{ meter: 1 }>;
export type Time = Dimensionality<{ second: 1 }>;
export type Frequency = Dimensionality<{ second: -1 }>;
export type Velocity = Dimensionality<{ meter: 1; second: -1 }>;
export type Density = Dimensionality<{ kg: 1; meter: -3 }>;
export type SurfaceDensity = Dimensionality<{ kg: 1; meter: -2 }>;
export type SpecificEnergy = Dimensionality<{ joule: 1; kg: -1 }>;
export type SpecificHeat = Dimensionality<{ joule: 1; kelvin: -1 }>;
export type Acceleration = Dimensionality<{ meter: 1; second: -2 }>;
export type Concentration = Dimensionality<{ mol: 1; meter: -3 }>;
export type MassConcentration = Dimensionality<{ mol: 1; kg: -1 }>;
export type Temperature = Dimensionality<{ kelvin: 1 }>;
export type Pressure = Dimensionality<{ kg: 1; meter: -1; second: -2 }>;
export type Force = Dimensionality<{ kg: 1; meter: 1; second: -2 }>;
export type Energy = Dimensionality<{ kg: 1; meter: 2; second: -2 }>;
export type Power = Dimensionality<{ kg: 1; meter: 2; second: -3 }>;
export type Torque = Dimensionality<{ kg: 1; meter: 2; second: -2 }>;
export type Charge = Dimensionality<{ ampere: 1; second: 1 }>;
export type ElectricPotentialDelta = Dimensionality<{
  kg: 1;
  meter: 2;
  second: -3;
  ampere: -1;
}>;
export type Capacitance = Dimensionality<{
  kg: 1;
  meter: -2;
  second: 4;
  ampere: 2;
}>;
export type Impedance = Dimensionality<{
  kg: 1;
  meter: 2;
  second: -3;
  ampere: -2;
}>;
export type Conductance = Dimensionality<{
  kg: -1;
  meter: 2;
  second: 3;
  ampere: 2;
}>;
export type MagneticFlux = Dimensionality<{
  kg: 1;
  meter: 2;
  second: -2;
  ampere: -1;
}>;
export type MagneticFluxDensity = Dimensionality<{
  kg: 1;
  second: -2;
  ampere: -1;
}>;
export type Inductance = Dimensionality<{
  kg: 1;
  meter: 2;
  second: -2;
  ampere: -2;
}>;

// Plurals for SI units
export const meter = meters;
export const second = seconds;
export const kilogram = kilograms;
export const ampere = amperes;
export const kelvin = kelvins;
export const mole = moles;
export const candela = candelas;

// SI Unit Aliases
export const amps = amperes;
export const amp = amperes;
export const hertz: Unit<Frequency> = alias(
  scalar.per(seconds), // scorched earth policy for now
  "Hz"
);
export const newtons: Unit<Force> = alias(
  kilograms.times(meters).per(seconds.squared()),
  "N",
  1
);
export const newton = newtons;
export const joules: Unit<Energy> = alias(newtons.times(meters), "J");
export const joule = joules;
export const pascals: Unit<Pressure> = alias(
  newtons.per(meters.squared()),
  "Pa",
  1
);
export const pascal = pascals;
export const watts: Unit<Power> = alias(joules.over(seconds), "W");
export const watt = watts;
export const coulombs: Unit<Charge> = alias(amperes.times(seconds), "C");
export const coulomb = coulombs;
export const volts: Unit<ElectricPotentialDelta> = alias(
  watts.over(amperes),
  "v"
);
export const volt = volts;
export const ohms: Unit<Impedance> = alias(volts.over(amperes), "Ω");
export const ohm = ohms;

// Derived SI Units
export const grams: Unit<Mass> = alias(kilograms, "g", f(1, 1000));
export const gram = grams;
export const gs: Unit<Acceleration> = alias(
  meters.per(seconds.squared()),
  "g",
  f(980665, 100000)
);
export const g = gs;
export const aus: Unit<Length> = alias(
  meters,
  "au",
  new Fraction(149597870700, 1)
);
export const au = aus;
export const angstroms: Unit<Length> = alias(meters, "Å", f(1, 1e10));
export const angstrom = angstroms;
export const liters: Unit<Volume> = alias(meters.cubed(), "l", f(1, 1e3));
export const liter = liters;
export const atmospheres: Unit<Pressure> = alias(pascals, "atm", f(101325, 1));
export const atmosphere = atmospheres;
export const atm = atmospheres;

// Time aliases
export const minutes = alias(seconds, "min", f(60, 1));
export const minute = minutes;
export const hours = alias(minutes, "h", f(60, 1));
export const hour = hours;
export const days = alias(hours, "d", f(24, 1));
export const day = days;
export const weeks = alias(days, "w", f(7, 1));
export const week = weeks;
export const years = alias(days, "yr", f(1461, 4));
export const year = years;

// Imperial units:
export const pounds = alias(newtons, "lb", f(224808943, 1000000000));
export const pound = pounds;
export const poundsForce = alias(pounds, "lbf");
export const poundsMass = alias(kilograms, "lbm", f(45359237, 100000000));
export const inches = alias(meter, "in", f(254, 10000)); // Imperial / US crossover.
export const inch = inches;
export const feet = alias(inches, "ft", f(12, 1));
export const foot = feet;
export const yards = alias(feet, "yd", f(3, 1));
export const yard = yards;
export const miles = alias(feet, "mi", f(5280, 1));
export const mile = miles;
export const footPounds = alias(foot.times(poundsForce), "ft⋅lbf");
export const footPound = footPounds;

// Temperature aliases
export const celsius = new Unit<Temperature>(
  partialToFull({ kelvin: 1 as const }),
  {
    multiplier: one,
    abbreviation: "°C",
    offset: f(27315, 100),
  }
);
export const fahrenheit = new Unit<Temperature>(
  partialToFull({ kelvin: 1 as const }),
  {
    multiplier: f(5, 9),
    abbreviation: "°F",
    offset: f(45967, 180),
  }
);
