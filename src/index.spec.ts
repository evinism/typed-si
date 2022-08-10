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
import {
  yotta,
  zetta,
  exa,
  peta,
  tera,
  giga,
  mega,
  kilo,
  hecto,
  deca,
  deci,
  centi,
  milli,
  micro,
  nano,
  pico,
  femto,
  atto,
  zepto,
  yocto,
} from "./prefix";
import { meters, Quantity, scalar, seconds } from "./unit";
import { assert } from "chai";

const fv = (num: number, den: number) => new Fraction(num, den).valueOf();

describe("typed-si", () => {
  describe("manipulation of simple quantities", () => {
    it("allows the construction of quantities", () => {
      const m = Quantity.of(1, meter);
      assert.equal(m._value, 1);
      assert.equal(m._composition.meter, 1);

      const f = Quantity.of(1, foot);
      assert.equal(f._composition.meter, 1);
    });

    it("allows the adding of quantities", () => {
      const m = Quantity.of(1, meter);
      const f = Quantity.of(1, foot);
      const mf = m.plus(f);
      assert.equal(mf.in(meters), 1.3048);
    });

    it("allows the subtraction of quantities", () => {
      const t1 = Quantity.of(1, second);
      const t2 = Quantity.of(0.25, seconds);
      const t3 = t1.minus(t2);
      assert.equal(t3.in(seconds), 0.75);
    });

    it("allows the multiplication of quantities", () => {
      const d1 = Quantity.of(2, meters);
      const d2 = Quantity.of(4, meters);
      const d3 = d1.times(d2);
      assert.equal(d3.in(meters.squared()), 8);
    });

    it("allows the division of quantities", () => {
      const d1 = Quantity.of(2, meters);
      const d2 = Quantity.of(4, meters);
      const d3 = d1.over(d2);
      assert.equal(d3.in(scalar), 0.5);
    });
  });

  describe("unit conversions", () => {
    it("allows the conversion of distances", () => {
      assert.approximately(
        Quantity.of(1, meter).in(feet),
        fv(10000, 3048),
        1e-6
      );
      assert.equal(Quantity.of(1, foot).in(meters), fv(3048, 10000));
      assert.equal(Quantity.of(1, inch).in(meters), fv(3048, 12 * 10000));
      assert.equal(Quantity.of(1, foot).in(inches), 12);
      assert.equal(Quantity.of(1, mile).in(feet), 5280);
    });

    it("allows the conversion of time", () => {
      assert.equal(Quantity.of(1, minute).in(seconds), 60);
      assert.equal(Quantity.of(1, hour).in(seconds), 3600);
      assert.equal(Quantity.of(1, day).in(seconds), 86400);
      assert.equal(Quantity.of(1, week).in(seconds), 604800);
      assert.equal(Quantity.of(1, year).in(seconds), 31557600);
    });
  });

  describe("prefixes", () => {
    it("allows the use of prefixes", () => {
      assert.equal(Quantity.of(1, meter).in(yocto(meters)), fv(1e24, 1));
      assert.equal(Quantity.of(1, meter).in(zepto(meters)), fv(1e21, 1));
      assert.equal(Quantity.of(1, meter).in(atto(meters)), fv(1e18, 1));
      assert.equal(Quantity.of(1, meter).in(femto(meters)), fv(1e15, 1));
      assert.equal(Quantity.of(1, meter).in(pico(meters)), fv(1e12, 1));
      assert.equal(Quantity.of(1, meter).in(nano(meters)), fv(1e9, 1));
      assert.equal(Quantity.of(1, meter).in(micro(meters)), fv(1e6, 1));
      assert.equal(Quantity.of(1, meter).in(milli(meters)), fv(1e3, 1));
      assert.equal(Quantity.of(1, meter).in(centi(meters)), fv(1e2, 1));
      assert.equal(Quantity.of(1, meter).in(deci(meters)), fv(1e1, 1));
      assert.equal(Quantity.of(1, meter).in(deca(meters)), fv(1, 1e1));
      assert.equal(Quantity.of(1, meter).in(hecto(meters)), fv(1, 1e2));
      assert.equal(Quantity.of(1, meter).in(kilo(meters)), fv(1, 1e3));
      assert.equal(Quantity.of(1, meter).in(mega(meters)), fv(1, 1e6));
      assert.equal(Quantity.of(1, meter).in(giga(meters)), fv(1, 1e9));
      assert.equal(Quantity.of(1, meter).in(tera(meters)), fv(1, 1e12));
      assert.equal(Quantity.of(1, meter).in(peta(meters)), fv(1, 1e15));
      assert.equal(Quantity.of(1, meter).in(exa(meters)), fv(1, 1e18));
      assert.equal(Quantity.of(1, meter).in(zetta(meters)), fv(1, 1e21));
      assert.equal(Quantity.of(1, meter).in(yotta(meters)), fv(1, 1e24));
    });
  });
});
