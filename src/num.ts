type Positive = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
type Negative = -1 | -2 | -3 | -4 | -5 | -6 | -7 | -8 | -9 | -10 | -11 | -12 | -13 | -14 | -15 | -16;

type Succ<A extends number> =
  A extends -16 ? -15
  : A extends -15 ? -14
  : A extends -14 ? -13
  : A extends -13 ? -12
  : A extends -12 ? -11
  : A extends -11 ? -10
  : A extends -10 ? -9
  : A extends -9 ? -8
  : A extends -8 ? -7
  : A extends -7 ? -6
  : A extends -6 ? -5
  : A extends -5 ? -4
  : A extends -4 ? -3
  : A extends -3 ? -2
  : A extends -2 ? -1
  : A extends -1 ? 0
  : A extends 0 ? 1 
  : A extends 1 ? 2
  : A extends 2 ? 3
  : A extends 3 ? 4
  : A extends 4 ? 5
  : A extends 5 ? 6
  : A extends 6 ? 7
  : A extends 7 ? 8
  : A extends 8 ? 9
  : A extends 9 ? 10
  : A extends 10 ? 11
  : A extends 11 ? 12
  : A extends 12 ? 13
  : A extends 13 ? 14
  : A extends 14 ? 15
  : A extends 15 ? 16
  : number;

type Pred<A extends number> =
  A extends 15 ? 14
  : A extends 14 ? 13
  : A extends 13 ? 12
  : A extends 12 ? 11
  : A extends 11 ? 10
  : A extends 10 ? 9
  : A extends 9 ? 8
  : A extends 8 ? 7
  : A extends 7 ? 6
  : A extends 6 ? 5
  : A extends 5 ? 4
  : A extends 4 ? 3
  : A extends 3 ? 2
  : A extends 2 ? 1
  : A extends 1 ? 0
  : A extends 0 ? -1
  : A extends -1 ? -2
  : A extends -2 ? -3
  : A extends -3 ? -4
  : A extends -4 ? -5
  : A extends -5 ? -6
  : A extends -6 ? -7
  : A extends -7 ? -8
  : A extends -8 ? -9
  : A extends -9 ? -10
  : A extends -10 ? -11
  : A extends -11 ? -12
  : A extends -12 ? -13
  : A extends -13 ? -14
  : A extends -14 ? -15
  : A extends -15 ? -16
  : number;

type Invert<N extends number> =
  N extends -16 ? 16
  : N extends -15 ? 15
  : N extends -14 ? 14
  : N extends -13 ? 13
  : N extends -12 ? 12
  : N extends -11 ? 11
  : N extends -10 ? 10
  : N extends -9 ? 9
  : N extends -8 ? 8
  : N extends -7 ? 7
  : N extends -6 ? 6
  : N extends -5 ? 5
  : N extends -4 ? 4
  : N extends -3 ? 3
  : N extends -2 ? 2
  : N extends -1 ? 1
  : N extends 0 ? 0
  : N extends 1 ? -1
  : N extends 2 ? -2
  : N extends 3 ? -3
  : N extends 4 ? -4
  : N extends 5 ? -5
  : N extends 6 ? -6
  : N extends 7 ? -7
  : N extends 8 ? -8
  : N extends 9 ? -9
  : N extends 10 ? -10
  : N extends 11 ? -11
  : N extends 12 ? -12
  : N extends 13 ? -13
  : N extends 14 ? -14
  : N extends 15 ? -15
  : N extends 16 ? -16
  : number;

type AddPositiveSaturating<A extends number, B extends number> =
  A extends 0 ? B
  : A extends Positive ? AddPositiveSaturating<Pred<A>, Succ<B>>
  : number;

type AddNegativeSaturating<A extends number, B extends number> =
  A extends 0 ? B :
  A extends Negative ? AddNegativeSaturating<Succ<A>, Pred<B>>
  : number;

type Add<A extends number, B extends number> =
  A extends Positive ? AddPositiveSaturating<A, B>
  : A extends Negative ? AddNegativeSaturating<A, B>
  : A extends 0 ? B
  : number;

type Subtract<A extends number, B extends number> = Add<A, Invert<B>>;
