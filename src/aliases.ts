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

export const alias = <C extends Composition>(
  unit: Unit<C>,
  abbreviation?: string,
  multiplier: number = 1
): Unit<C> => {
  return new Unit(unit.composition, {
    multiplier: unit.multiplier * multiplier,
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
export const joules: Unit<Energy> = alias(newtons.times(meters), "J", 1);
export const joule = joules;
export const pascals: Unit<Pressure> = alias(
  newtons.per(meters.squared()),
  "Pa",
  1
);
export const pascal = pascals;
export const watts: Unit<Power> = alias(joules.over(seconds), "W", 1);
export const watt = watts;
export const coulombs: Unit<Charge> = alias(amperes.times(seconds), "C", 1);
export const coulomb = coulombs;
export const volts: Unit<ElectricPotentialDelta> = alias(
  watts.over(amperes),
  "v"
);
export const volt = volts;
export const ohms: Unit<Impedance> = alias(volts.over(amperes), "Ω", 1);
export const ohm = ohms;

// Derived SI Units
export const grams: Unit<Mass> = alias(kilograms, "g", 0.001);
export const gram = grams;
export const gs: Unit<Acceleration> = alias(
  meters.per(seconds.squared()),
  "g",
  9.80665
);
export const g = gs;
export const aus: Unit<Length> = alias(meters, "au", 149597870700);
export const au = aus;
export const angstroms: Unit<Length> = alias(meters, "Å", 1e-10);
export const angstrom = angstroms;
export const liters: Unit<Volume> = alias(meters.cubed(), "l", 1e-3);
export const liter = liters;
export const atmospheres: Unit<Pressure> = alias(pascals, "atm", 101325);
export const atmosphere = atmospheres;
export const atm = atmospheres;

// Time aliases
export const minutes = alias(seconds, "min", 60);
export const minute = minutes;
export const hours = alias(minutes, "h", 60);
export const hour = hours;
export const days = alias(hours, "d", 24);
export const day = days;
export const weeks = alias(days, "w", 7);
export const week = weeks;

// Imperial units:
export const pounds = alias(newtons, "lb", 0.224808943);
export const pound = pounds;
export const poundsForce = alias(pounds, "lbf");
export const poundsMass = alias(kilograms, "lbm", 0.45359237);
export const feet = alias(meters, "ft", 0.3048);
export const foot = feet;
export const inches = alias(feet, "in", 12);
export const inch = inches;
export const yards = alias(feet, "yd", 3);
export const yard = yards;
export const footPounds = alias(joules, "ft⋅lbf", 1.3558179483314);
export const footPound = footPounds;

// Temperature aliases
export const celsius = new Unit<Temperature>(
  partialToFull({ kelvin: 1 as const }),
  {
    multiplier: 1,
    abbreviation: "°C",
    offset: 273.15,
  }
);
export const fahrenheit = new Unit<Temperature>(
  partialToFull({ kelvin: 1 as const }),
  {
    multiplier: 5 / 9,
    abbreviation: "°F",
    offset: 255.372222222222,
  }
);
