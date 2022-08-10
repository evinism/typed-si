
# `typed-si`: Strongly typed physical units
![Node.js](https://github.com/evinism/typed-si/actions/workflows/node.js.yml/badge.svg) 
[![npm version](https://img.shields.io/npm/v/typed-si.svg?style=flat)](https://www.npmjs.com/package/typed-si)

Installation via `npm i typed-si`

`typed-si` is a typescript library for working with si-based phyisical quantities and measures with strong type safety guarantees.

## Basic usage:

```ts
import {Quantity, feet, kilo, newtons, atmospheres} from 'typed-si';

const sqft = Quantity.of(50, feet.squared());
const force = Quantity.of(10, kilo(newtons));
console.log(`Atmospheres: ${force.over(sqft).in(atmospheres)}`)
```

## Rational by Default
All quantities in `typed-si` use rationals by default under the hood, leading to reasonable conversion with minimal loss of precision.

## Aliases, Aliases, Aliases
`typed-si` has a lot of aliases for things to improve readability. They behave identically and are often the same function instance. 

```js
// Aliasing of singular and plurals
Quantity.of(1, mile).in(meters);

// Aliasing of unit and quantity division.
Quantity.of(60, miles.per(hour));
Quantity.of(60, miles.div(hour));
Quantity.of(60, miles.over(hour));
```
