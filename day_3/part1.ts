/*
--- Day 3: Gear Ratios ---
You and the Elf eventually reach a gondola lift station; he says the gondola lift will take you up to the water source, but this is as far as he can bring you. You go inside.

It doesn't take long to find the gondolas, but there seems to be a problem: they're not moving.

"Aaah!"

You turn around to see a slightly-greasy Elf with a wrench and a look of surprise. "Sorry, I wasn't expecting anyone! The gondola lift isn't working right now; it'll still be a while before I can fix it." You offer to help.

The engineer explains that an engine part seems to be missing from the engine, but nobody can figure out which one. If you can add up all the part numbers in the engine schematic, it should be easy to work out which part is missing.

The engine schematic (your puzzle input) consists of a visual representation of the engine. There are lots of numbers and symbols you don't really understand, but apparently any number adjacent to a symbol, even diagonally, is a "part number" and should be included in your sum. (Periods (.) do not count as a symbol.)

Here is an example engine schematic:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
In this schematic, two numbers are not part numbers because they are not adjacent to a symbol: 114 (top right) and 58 (middle right). Every other number is adjacent to a symbol and so is a part number; their sum is 4361.

Of course, the actual engine schematic is much larger. What is the sum of all of the part numbers in the engine schematic?

Your puzzle answer was 538046.
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


