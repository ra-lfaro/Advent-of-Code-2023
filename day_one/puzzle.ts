/*
--- Day 1: Trebuchet?! ---
  Something is wrong with global snow production, and you've been selected to take a look. The Elves have even given you a map; on it, they've used stars to mark the top fifty locations that are likely to be having problems.

  You've been doing this long enough to know that to restore snow operations, you need to check all fifty stars by December 25th.

  Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

  You try to ask why they can't just use a weather machine ("not powerful enough") and where they're even sending you ("the sky") and why your map looks mostly blank ("you sure ask a lot of questions") and hang on did you just say the sky ("of course, where do you think snow comes from") when you realize that the Elves are already loading you into a trebuchet ("please hold still, we need to strap you in").

  As they're making the final adjustments, they discover that their calibration document (your puzzle input) has been amended by a very young Elf who was apparently just excited to show off her art skills. Consequently, the Elves are having trouble reading the values on the document.

  The newly-improved calibration document consists of lines of text; each line originally contained a specific calibration value that the Elves now need to recover. On each line, the calibration value can be found by combining the first digit and the last digit (in that order) to form a single two-digit number.

  For example:

  1abc2
  pqr3stu8vwx
  a1b2c3d4e5f
  treb7uchet
  In this example, the calibration values of these four lines are 12, 38, 15, and 77. Adding these together produces 142.

  Consider your entire calibration document. What is the sum of all of the calibration values?

  MY INPUT ANSWER: 55017

--- Part Two ---
  Your calculation isn't quite right. It looks like some of the digits are actually spelled out with letters: one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".

  Equipped with this new information, you now need to find the real first and last digit on each line. For example:

  two1nine
  eightwothree
  abcone2threexyz
  xtwone3four
  4nineeightseven2
  zoneight234
  7pqrstsixteen
  In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76. Adding these together produces 281.

  What is the sum of all of the calibration values?

  MY INPUT ANSWER: 53539
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

