/*
  https://adventofcode.com/2023/day/4
*/

import SCRATCH_CARDS from './input';

const parseNumbers = (numbers: string) => {
  const [winningNumbers, givenNumbers] = numbers.split(" | ");

  const cleanedWinningNumbers = winningNumbers.split(/\s+/);
  const cleanedGivenNumbers = givenNumbers.split(/\s+/);

  return [cleanedWinningNumbers, cleanedGivenNumbers];
}

const countCardMatches = (card: string) => {
  const [, numbers] = card.split(/:\s+/);
  const [winningNumbers, givenNumbers] = parseNumbers(numbers);

  const matchingNumbers = givenNumbers.filter(num => winningNumbers.includes(num))

  return matchingNumbers.length;
};

const calculateCardCounts = (cards = SCRATCH_CARDS) => {
  let cardCounts = new Array(cards.length).fill(1);

  for (let i = 0; i < cards.length; i++) {
    let matchesFound = countCardMatches(cards[i]);

    // duplicate the following X cards; where X is matchesFound
    // including the amount of times the current card has already been duplicated
    for (let j = 1; (j <= matchesFound && i + j < cards.length); j++) {
      cardCounts[i + j] = cardCounts?.[i + j] + cardCounts[i];
    }

  }

  // return sum
  return cardCounts.reduce((ongoing: number, curr: number) => ongoing + curr, 0);
}


console.log(calculateCardCounts())