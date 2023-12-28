export enum PokerFlower {
  SPADES = 'S',
  HEART = 'H',
  CLUB = 'C',
  DIAMOND = 'D',
}

export enum PokerType {
  NORMAL = 'NORMAL',
  LITTLE_JOKER = 'joker',
  BIG_JOKER = 'JOKER',
}

export type PokerNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export type Poker = {
  type: PokerType.NORMAL;
  flower: PokerFlower;
  num: PokerNumber;
} | { type: PokerType.BIG_JOKER | PokerType.LITTLE_JOKER };
