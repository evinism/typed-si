type Positive = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
type Negative = -1 | -2 | -3 | -4 | -5 | -6 | -7 | -8 | -9 | -10 | -11 | -12 | -13 | -14 | -15 | -16;

type SuccMap = {
  [-16]: -15;
  [-15]: -14;
  [-14]: -13;
  [-13]: -12;
  [-12]: -11;
  [-11]: -10;
  [-10]: -9;
  [-9]: -8;
  [-8]: -7;
  [-7]: -6;
  [-6]: -5;
  [-5]: -4;
  [-4]: -3;
  [-3]: -2;
  [-2]: -1;
  [-1]: 0;
  [0]: 1;
  [1]: 2;
  [2]: 3;
  [3]: 4;
  [4]: 5;
  [5]: 6;
  [6]: 7;
  [7]: 8;
  [8]: 9;
  [9]: 10;
  [10]: 11;
  [11]: 12;
  [12]: 13;
  [13]: 14;
  [14]: 15;
  [15]: 16;
};

type PredMap = {
  [16]: 15;
  [15]: 14;
  [14]: 13;
  [13]: 12;
  [12]: 11;
  [11]: 10;
  [10]: 9;
  [9]: 8;
  [8]: 7;
  [7]: 6;
  [6]: 5;
  [5]: 4;
  [4]: 3;
  [3]: 2;
  [2]: 1;
  [1]: 0;
  [0]: -1;
  [-1]: -2;
  [-2]: -3;
  [-3]: -4;
  [-4]: -5;
  [-5]: -6;
  [-6]: -7;
  [-7]: -8;
  [-8]: -9;
  [-9]: -10;
  [-10]: -11;
  [-11]: -12;
  [-12]: -13;
  [-13]: -14;
  [-14]: -15;
  [-15]: -16;
};

type InvMap = {
  [-16]: 16;
  [-15]: 15;
  [-14]: 14;
  [-13]: 13;
  [-12]: 12;
  [-11]: 11;
  [-10]: 10;
  [-9]: 9;
  [-8]: 8;
  [-7]: 7;
  [-6]: 6;
  [-5]: 5;
  [-4]: 4;
  [-3]: 3;
  [-2]: 2;
  [-1]: 1;
  [0]: 0;
  [1]: -1;
  [2]: -2;
  [3]: -3;
  [4]: -4;
  [5]: -5;
  [6]: -6;
  [7]: -7;
  [8]: -8;
  [9]: -9;
  [10]: -10;
  [11]: -11;
  [12]: -12;
  [13]: -13;
  [14]: -14;
  [15]: -15;
  [16]: -16;
};

type Succ<A extends number> = A extends keyof SuccMap ? SuccMap[A] : number;
type Pred<A extends number> = A extends keyof PredMap ? PredMap[A] : number;

type AddPositiveSaturating<A extends number, B extends number> = A extends 0
  ? B
  : A extends Positive
  ? AddPositiveSaturating<Pred<A>, Succ<B>>
  : number;

type AddNegativeSaturating<A extends number, B extends number> = A extends 0
  ? B
  : A extends Negative
  ? AddNegativeSaturating<Succ<A>, Pred<B>>
  : number;

export type Add<A extends number, B extends number> = A extends 0
  ? B
  : B extends 0
  ? A
  : A extends 1
  ? Succ<B>
  : B extends -1
  ? Pred<A>
  : A extends Positive
  ? AddPositiveSaturating<A, B>
  : A extends Negative
  ? AddNegativeSaturating<A, B>
  : number;

export type Subtract<A extends number, B extends number> = Add<A, Invert<B>>;
export type Invert<N extends number> = N extends keyof InvMap
  ? InvMap[N]
  : number;
