import assert from "assert";
import Fraction from "fraction.js";
import {
  day,
  feet,
  foot,
  hour,
  inch,
  inches,
  meter,
  mile,
  minute,
  second,
  week,
  year,
} from "./aliases";
import { meters, Quantity, scalar, seconds } from "./unit";

const fv = (num: number, den: number) => new Fraction(num, den).valueOf();

describe("typed-si", () => {
  describe("manipulation of simple quantities", () => {
    it("allows the construction of quantities", () => {
      const m = Quantity.of(1, meter);
      assert(m.value == 1);
      assert(m.composition.meter == 1);

      const f = Quantity.of(1, foot);
      assert(f.composition.meter == 1);
    });

    it("allows the adding of quantities", () => {
      const m = Quantity.of(1, meter);
      const f = Quantity.of(1, foot);
      const mf = m.plus(f);
      assert(mf.in(meters) == 1.3048);
    });

    it("allows the subtraction of quantities", () => {
      const t1 = Quantity.of(1, second);
      const t2 = Quantity.of(0.25, seconds);
      const t3 = t1.minus(t2);
      assert(t3.in(seconds) == 0.75);
    });

    it("allows the multiplication of quantities", () => {
      const d1 = Quantity.of(2, meters);
      const d2 = Quantity.of(4, meters);
      const d3 = d1.times(d2);
      assert(d3.in(meters.squared()) == 8);
    });

    it("allows the division of quantities", () => {
      const d1 = Quantity.of(2, meters);
      const d2 = Quantity.of(4, meters);
      const d3 = d1.over(d2);
      assert(d3.in(scalar) == 0.5);
    });
  });

  describe("unit conversions", () => {
    it("allows the conversion of distances", () => {
      assert(Quantity.of(1, meter).in(feet) == fv(10000, 3048));
      assert(Quantity.of(1, foot).in(meters) == fv(3048, 10000));
      assert(Quantity.of(1, inch).in(meters) == fv(3048, 12 * 10000));
      assert(Quantity.of(1, foot).in(inches) == 12);
      assert(Quantity.of(1, mile).in(feet) == 5280);
    });

    it("allows the conversion of time", () => {
      assert(Quantity.of(1, minute).in(seconds) == 60);
      assert(Quantity.of(1, hour).in(seconds) == 3600);
      assert(Quantity.of(1, day).in(seconds) == 86400);
      assert(Quantity.of(1, week).in(seconds) == 604800);
      assert(Quantity.of(1, year).in(seconds) == 31557600);
    });
  });
});
