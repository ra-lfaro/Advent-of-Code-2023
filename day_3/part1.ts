/*
  https://adventofcode.com/2023/day/3
*/

import ENGINE_SCHEMATIC from './input';

type NumberFound = [
  lineIndex: number,
  numFound: string,
  numStartIndex: number,
  numberEndIndex: number
];

const SYMBOL_REGEX = /[^\d\.]/ //any character not a digit or .

const findNumbersInLine = (line: string, lineIndex: number) => {
  let numbersFound: NumberFound[] = [];

  let wordStart = -1;
  let wordEnd = 0;

  for (let i = 0; i < line.length; i++) {
    // when we find a number reset the start to current
    // once start is set the next symbol ends the word
    // store that word and reset start again
    if (line[i].match(/\d/)) {
      wordEnd = i;

      // edge case if the number leads to the end of the line, we need to add it here
      if (i === line.length - 1) {
        numbersFound.push([lineIndex, line.slice(wordStart, wordEnd + 1), wordStart, wordEnd])
      }

      if (wordStart === -1) {
        wordStart = i;
      }

    } else {
      // if we have a start and have hit another non digit weve hit the end of the word
      if (wordEnd >= wordStart && wordStart !== -1) {
        numbersFound.push([lineIndex, line.slice(wordStart, wordEnd + 1), wordStart, wordEnd])
        wordStart = -1;
      }
    }

  }

  return numbersFound;
};

const checkIfAdjacent = (schamatic: string[], numFound: NumberFound) => {
  const [lineIndex, , numStart, numEnd] = numFound;

  const extendedStart = (numStart > 0) ? numStart - 1 : numStart;
  const extendedEnd = numEnd + 2; // 2 because slice doesnt include final index so 1 for the adjacent and 1 to include it

  const above = schamatic[lineIndex - 1]?.slice(extendedStart, extendedEnd) || '';
  const below = schamatic[lineIndex + 1]?.slice(extendedStart, extendedEnd) || '';
  const leftAndRight = schamatic[lineIndex]?.slice(extendedStart, extendedEnd);

  return SYMBOL_REGEX.test(above) || SYMBOL_REGEX.test(below) || SYMBOL_REGEX.test(leftAndRight);
};


const sumAllPartNumbers = (schamatic = ENGINE_SCHEMATIC) => {
  let result = 0;

  for (let i = 0; i < schamatic.length; i++) {
    let numbersInLine = findNumbersInLine(schamatic[i], i);

    for (let numFound of numbersInLine) {
      const [, num] = numFound;
      if (checkIfAdjacent(schamatic, numFound)) {
        result += +num;
      }
    }
  };

  return result;
}

console.log(sumAllPartNumbers());


