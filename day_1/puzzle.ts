/*
  https://adventofcode.com/2023/day/1
*/

import CALIBRATION_VALUES from "./input";

const DIGIT_TEST = /[\d]/;

const ONE = 'one';
const TWO = 'two';
const THREE = 'three';
const FOUR = 'four';
const FIVE = 'five';
const SIX = 'six';
const SEVEN = 'seven';
const EIGHT = 'eight';
const NINE = 'nine';

const NUMBER_LOOKUP: Record<string, number> = {
  [ONE]: 1,
  [TWO]: 2,
  [THREE]: 3,
  [FOUR]: 4,
  [FIVE]: 5,
  [SIX]: 6,
  [SEVEN]: 7,
  [EIGHT]: 8,
  [NINE]: 9
};

const getFirstDigit = (s: string) => {
  for (let i = 0; i < s.length; i++) {
    if (s.charAt(i).match(DIGIT_TEST)) {
      return Number(s.charAt(i));
    }

    // part 2 portion of solution --
    let potentialDigit = isThisADigitSpelledOut(i, s);
    if (potentialDigit !== '') {
      return NUMBER_LOOKUP[potentialDigit];
    }
    // --
    
  }
};

const getLastDigit = (s: string) => {
  for (let i = s.length - 1; i >= 0; i--) {
    if (s.charAt(i).match(DIGIT_TEST)) {
      return Number(s.charAt(i));
    }

    // part 2 portion of solution --
    let potentialDigit = isThisADigitSpelledOut(i, s);
    if (potentialDigit !== '') {
      return NUMBER_LOOKUP[potentialDigit];
    }
    // --

  }
};

const isDigit = (i: number, calibrationValue: string, digits: string[]) => {
  for (let digit of digits) {
    if (calibrationValue.slice(i, i + digit.length) === digit) {
      return digit;
    }
  }
  return '';
}

const isThisADigitSpelledOut = (i: number, calibrationValue: string) => {
  switch (calibrationValue.charAt(i)) {
    case 'o':
      return isDigit(i, calibrationValue, [ONE]);
    case 't':
      return isDigit(i, calibrationValue, [TWO, THREE]);
    case 'f':
      return isDigit(i, calibrationValue, [FOUR, FIVE]);
    case 's':
      return isDigit(i, calibrationValue, [SIX, SEVEN]);
    case 'e':
      return isDigit(i, calibrationValue, [EIGHT]);
    case 'n':
      return isDigit(i, calibrationValue, [NINE]);
    default:
      return '';
  }
}

const sumAllEntries = (entries: string[]) => {
  let result = 0;

  for (let entry of entries) {
    let rowNumber = +`${getFirstDigit(entry)}${getLastDigit(entry)}`;
    result += rowNumber;
  }

  return result;
};

console.log(sumAllEntries(CALIBRATION_VALUES))

