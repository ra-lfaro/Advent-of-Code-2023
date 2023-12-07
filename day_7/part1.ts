/*
  https://adventofcode.com/2023/day/7
*/

import HANDS from "./input";

const SAMPLE = [
  '32T3K 765',
  'T55J5 684',
  'KK677 28',
  'KTJJT 220',
  'QQQJA 483',
];

type RANKED_HAND = {
  hand: string;
  bid: number;
  rank: number;
  cleanedHand: string;
}

// to better support alphanumeric sort we replace the non-numeric characters
// with letters the sort the same way as the representation would
const replaceRoyalsWithAlphaRanked = (hand: string) => {
  const CONVERSION: Record<string, string> = {
    'A': 'Z',
    'K': 'Y',
    'Q': 'X',
    'J': 'W',
    'T': 'V'
  };

  let cleanedString = "";

  for (let l of hand) {
    cleanedString = cleanedString + (CONVERSION[l] || l);
  }

  return cleanedString;
}

const eliminatePossibleRanks = (hand: string) => {
  const possibleHands = { fiveOAK: true, fourOAK: true, fullHouse: true, threeOAK: true, twoPair: true, onePair: true };
  let seenCards: Record<string, number> = {};

  for (let c of hand) {

    seenCards[c] = (seenCards[c] || 0) + 1;
    let uniquesSeen = Object.keys(seenCards)?.length;

    /*
      general logic here is once youve seen a certain amount of unique cards
      that will eliminate options. Same with once you've certain amounts of cards
      i.e
        seeing 2 different cards eliminated 5oak
        seeing 3 different cards eliminates 4oak and full house
        seeing 4 of one card eliminates full house
        seeing 4 different cards eliminates 3oak and 2pair
        seeing 3 of one card eliminates two pair
    */

    if (possibleHands.fiveOAK && uniquesSeen > 1) {
      possibleHands.fiveOAK = false;
    }

    if (possibleHands.fourOAK || possibleHands.fullHouse) {
      if (uniquesSeen > 2) {
        possibleHands.fourOAK = false;
        possibleHands.fullHouse = false;
      } else if (seenCards[c] > 3) {
        possibleHands.fullHouse = false;
      }
    }

    if (possibleHands.threeOAK || possibleHands.twoPair) {
      if (uniquesSeen > 3) {
        possibleHands.threeOAK = false;
        possibleHands.twoPair = false;
      } else if (seenCards[c] > 2) {
        possibleHands.twoPair = false;
      }
    }

    if (possibleHands.onePair && uniquesSeen > 4) {
      possibleHands.onePair = false;
    }
  }

  // edge cases that dont get removed during the character loop
  // cant be both so if the latter is true, its that.
  if (possibleHands.fourOAK && possibleHands.fullHouse) {
    possibleHands.fourOAK = false;
  }

  if (possibleHands.threeOAK && possibleHands.twoPair) {
    possibleHands.threeOAK = false;
  }

  return possibleHands;
}

const rankHand = (hand: string) => {
  const { fiveOAK, fourOAK, fullHouse, threeOAK, twoPair, onePair } = eliminatePossibleRanks(hand);

  // return first available based on highest -> lowest rank
  switch (true) {
    case fiveOAK:
      return 7;
    case fourOAK:
      return 6;
    case fullHouse:
      return 5;
    case threeOAK:
      return 4
    case twoPair:
      return 3;
    case onePair:
      return 2;
    default:
      return 1;
  }
};

const comporator = (hand1: RANKED_HAND, hand2: RANKED_HAND) => {
  // rank gets priority
  if (hand1.rank > hand2.rank) {
    return 1;
  } else if (hand1.rank < hand2.rank) {
    return -1;
  }

  // because we replaced the weird ordering of the royals we can just sort normally
  return hand1.cleanedHand < hand2.cleanedHand ? -1 : 1;
};


const processHands = (hands = HANDS) => {
  let preppedHands: RANKED_HAND[] = [];

  for (let hand of hands) {
    const [cards, bid] = hand.split(" ");
    preppedHands.push({
      hand: cards,
      bid: +bid,
      rank: rankHand(cards),
      cleanedHand: replaceRoyalsWithAlphaRanked(cards)
    })
  }

  preppedHands.sort(comporator);
  return preppedHands;
};

const calculateWinnings = (hands = HANDS) => {
  const game = processHands(hands);
  game.sort(comporator); // leaves it as an array where its going lowest rank -> highest

  let totalWinnings = 0;
  for (let i = game.length - 1; i >= 0; i--) {
    totalWinnings += (game[i].bid * (i + 1));
  }

  return totalWinnings;
}

console.log(calculateWinnings())

// Your puzzle answer was 248812215.