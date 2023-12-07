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
  'J3737 123',
  'J3717 123',
];

type RANKED_HAND = {
  hand: string;
  bid: number;
  rank: number;
  cleanedHand: string;
}

const replaceRoyalsWithAlphaRanked = (hand: string) => {
  const CONVERSION: Record<string, string> = {
    'A': 'Z',
    'K': 'Y',
    'Q': 'X',
    'J': '1', // make joker lowest possible card value
    'T': 'V'
  };

  let cleanedString = "";

  for (let l of hand) {
    cleanedString = cleanedString + (CONVERSION[l] || l);
  }

  return cleanedString;
}

const hasPsuedoCount = (counts: number[], jokers: number, goal: number) => {
  for (let c of counts) {
    if (c + jokers >= goal) {
      return true;
    }
  }

  return false;
}

const eliminatePossibleRanks = (hand: string) => {
  const possibleHands = { fiveOAK: true, fourOAK: true, fullHouse: true, threeOAK: true, twoPair: true, onePair: true };

  let seenCards: Record<string, number> = {};
  let jokers = 0

  for (let c of hand) {

    // we can skip jokers and just keep the count
    if (c === 'J') {
      jokers++;
      continue;
    }

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

    seenCards[c] = (seenCards[c] || 0) + 1;
    let uniquesSeen = Object.keys(seenCards)?.length;

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

  // We can eliminate these two options using the total amount of each occurance and the amoun of jokers
  // if the occurance of a card + the amount of jokers makes a 4OAK, then we want that and not a full house
  const nonJokerCardCounts = Object.values(seenCards);
  if (possibleHands.fourOAK && hasPsuedoCount(nonJokerCardCounts, jokers, 4)) {
    possibleHands.fullHouse = false;
  }

  // if the occurance of a card + the amount of jokers makes a 3OAK, then we want that and not a two pair
  if (possibleHands.threeOAK && hasPsuedoCount(nonJokerCardCounts, jokers, 3)) {
    possibleHands.twoPair = false;
  }

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

// Your puzzle answer is 250057090
