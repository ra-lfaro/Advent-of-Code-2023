/*
  https://adventofcode.com/2023/day/4
*/

import SCRATCH_CARDS from './input';

const countCardPoints = (card: string) => {
  const [, numbers] = card.split(/:\s+/);
  const [winningNumbers, givenNumbers] = parseNumbers(numbers);

  const matchingNumbers = givenNumbers.filter(num => winningNumbers.includes(num))

  if (!matchingNumbers.length) {
    return 0;
  }

  return Math.pow(2, matchingNumbers.length - 1);
};

const parseNumbers = (numbers: string) => {
  const [winningNumbers, givenNumbers] = numbers.split(" | ");

  const cleanedWinningNumbers = winningNumbers.split(/\s+/);
  const cleanedGivenNumbers = givenNumbers.split(/\s+/);

  return [cleanedWinningNumbers, cleanedGivenNumbers];
}

const sumAllCardPoints = (cards = SCRATCH_CARDS) => {
  return cards.reduce((ongoing: number, curr: string) => ongoing + countCardPoints(curr), 0);
}

console.log(sumAllCardPoints())