# `typed-si`

`typed-si` is a typescript library for working with si-based phyisical quantities and measures with strong type safety guarantees.

Basic usage:

```ts
import {Quantity, feet, kilo, newtons, atmospheres} from 'typed-si';

const sqft = Quantity.of(50, feet.squared());
const force = Quantity.of(10, kilo(newtons));
console.log(`Atmospheres: ${force.over(sqft).in(atmospheres)}`)
```
