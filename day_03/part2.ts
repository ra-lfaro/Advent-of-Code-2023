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

type PotentialGear = [
  lineAndGearIndex: string, // i.e '1-6' lineIndex of 1, string index 6 where the * is located
  NumberFound
]

const GEAR_ADJACENT_REGEX = /\*/ //any character not a digit or .

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

const getPotentialGears = (schamatic: string[], numFound: NumberFound) => {
  const [lineIndex, , numStart, numEnd] = numFound;

  const extendedStart = (numStart > 0) ? numStart - 1 : numStart;
  const extendedEnd = numEnd + 2; // 2 because slice doesnt include final index so 1 for the adjacent and 1 to include it

  const above = schamatic[lineIndex - 1]?.slice(extendedStart, extendedEnd) || '';
  const below = schamatic[lineIndex + 1]?.slice(extendedStart, extendedEnd) || '';
  const leftAndRight = schamatic[lineIndex]?.slice(extendedStart, extendedEnd);

  let potentialGears: PotentialGear[] = [];

  if (GEAR_ADJACENT_REGEX.test(above)) {
    potentialGears.push([`${lineIndex - 1}-${above.indexOf('*') + extendedStart}`, numFound]);
  }

  if (GEAR_ADJACENT_REGEX.test(below)) {
    potentialGears.push([`${lineIndex + 1}-${below.indexOf('*') + extendedStart}`, numFound]);
  }

  if (GEAR_ADJACENT_REGEX.test(leftAndRight)) {
    potentialGears.push([`${lineIndex}-${leftAndRight.indexOf('*') + extendedStart}`, numFound]);
  }

  return potentialGears;
};

const sumAllGearRatios = (allPotentialGears: Record<string, NumberFound[]>) => {
  let result = 0;

  Object.keys(allPotentialGears).map(key => {
    // only exactly two adjacent count towards result
    if (allPotentialGears[key].length === 2) {
      const [gear1, gear2] = allPotentialGears[key];
      const [, gear1Num] = gear1;
      const [, gear2Num] = gear2;

      result += (+gear1Num * +gear2Num);
    }
  })

  return result;
}


const calculateGearRatios = (schamatic = ENGINE_SCHEMATIC) => {
  let allPotentialGears: Record<string, NumberFound[]> = {};

  for (let i = 0; i < schamatic.length; i++) {
    let numbersInLine = findNumbersInLine(schamatic[i], i);

    for (let numFound of numbersInLine) {
      // find any * adjacent to current number
      let gearsForNumFound = getPotentialGears(schamatic, numFound);

      // add to overall map
      gearsForNumFound.map(gear => {
        const [indexOfGear, numFound] = gear;

        if (allPotentialGears[indexOfGear]) {
          allPotentialGears[indexOfGear].push(numFound);
        } else {
          allPotentialGears[indexOfGear] = [numFound];
        }
      });

    }
  };

  return sumAllGearRatios(allPotentialGears);
}

console.log(calculateGearRatios());


