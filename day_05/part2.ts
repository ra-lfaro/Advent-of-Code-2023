/*
  https://adventofcode.com/2023/day/5
*/

import ALMANAC from "./input";

const SAMPLE = [
  'seeds: 79 14 55 13',
  '',
  'seed-to-soil map:',
  '50 98 2',
  '52 50 48',
  '',
  'soil-to-fertilizer map:',
  '0 15 37',
  '37 52 2',
  '39 0 15',
  '',
  'fertilizer-to-water map:',
  '49 53 8',
  '0 11 42',
  '42 0 7',
  '57 7 4',
  '',
  'water-to-light map:',
  '88 18 7',
  '18 25 70',
  '',
  'light-to-temperature map:',
  '45 77 23',
  '81 45 19',
  '68 64 13',
  '',
  'temperature-to-humidity map:',
  '0 69 1',
  '1 0 69',
  '',
  'humidity-to-location map:',
  '60 56 37',
  '56 93 4'
];

type SourceDestRange = [
  destinationStart: number,
  sourceStart: number,
  range: number
];

type SeedPairs = [number, number][]

type ParsedMapping = {
  seedToSoil: SourceDestRange[];
  soilToFert: SourceDestRange[];
  fertToWater: SourceDestRange[];
  waterToLight: SourceDestRange[];
  lightToTemp: SourceDestRange[];
  tempToHumid: SourceDestRange[];
  humidityToLoc: SourceDestRange[];
};

type PlaceHolderKey = 'seedToSoil' | 'soilToFert' | 'fertToWater' | 'waterToLight' | 'lightToTemp' | 'tempToHumid' | 'humidityToLoc';


const parseSeeds = (line: string) => {
  const [, numbers] = line.split(": ");

  const seedPairs = numbers.matchAll(/\d+\s\d+/g);

  let cleanedSeedPairs: SeedPairs = []

  for (let pair of [...seedPairs]) {
    let [firstNum, secondNum] = pair[0]?.split(" ");
    cleanedSeedPairs.push([+firstNum, +secondNum])
  }

  return cleanedSeedPairs;
};

const parseSourceDesticationRange = (line: string): SourceDestRange => {
  const [dest, source, range] = line.split(" ");

  return [+dest, +source, +range];
}

const parseAlmanac = (almanac = ALMANAC): [SeedPairs, ParsedMapping] => {
  let seeds: SeedPairs = [];

  const mappings: ParsedMapping = {
    seedToSoil: [],
    soilToFert: [],
    fertToWater: [],
    waterToLight: [],
    lightToTemp: [],
    tempToHumid: [],
    humidityToLoc: []
  };

  let placeHolderKey: PlaceHolderKey = "seedToSoil";

  for (let line of almanac) {

    if (line.startsWith('seeds:')) {
      seeds = parseSeeds(line);
      continue;
    } else if (line.startsWith('seed-to-soil')) {
      placeHolderKey = 'seedToSoil';
      continue;
    } else if (line.startsWith('soil-to-fertilizer')) {
      placeHolderKey = 'soilToFert';
      continue;
    } else if (line.startsWith('fertilizer-to-water')) {
      placeHolderKey = 'fertToWater';
      continue;
    } else if (line.startsWith('water-to-light')) {
      placeHolderKey = 'waterToLight';
      continue;
    } else if (line.startsWith('light-to-temperature')) {
      placeHolderKey = 'lightToTemp';
      continue;
    } else if (line.startsWith('temperature-to-humidity')) {
      placeHolderKey = 'tempToHumid';
      continue;
    } else if (line.startsWith('humidity-to-location')) {
      placeHolderKey = 'humidityToLoc';
      continue;
    }

    if (line !== "")
      (mappings[placeHolderKey]).push(parseSourceDesticationRange(line))
  }

  return [seeds, mappings];
};


const findMappedPosition = (position: number, mappings: SourceDestRange[]) => {
  for (let mapping of mappings) {
    const [destinationStart, sourceStart, range] = mapping;

    if (position >= sourceStart && position <= (sourceStart + range)) {
      let distanceFromSourceStart = position - sourceStart;
      return destinationStart + distanceFromSourceStart;
    }

  }

  return position;
};

const convertToLocation = (seedPos: number, mappings: ParsedMapping) => {
  let soilPos = findMappedPosition(seedPos, mappings.seedToSoil);
  let fertPos = findMappedPosition(soilPos, mappings.soilToFert);
  let waterPos = findMappedPosition(fertPos, mappings.fertToWater);
  let lightPos = findMappedPosition(waterPos, mappings.waterToLight);
  let tempPos = findMappedPosition(lightPos, mappings.lightToTemp);
  let humidPos = findMappedPosition(tempPos, mappings.tempToHumid);
  return findMappedPosition(humidPos, mappings.humidityToLoc);
}


const findLowestLocation = (almanac = ALMANAC) => {
  const [seedPairs, mappings] = parseAlmanac(almanac);
  let lowestPos: number | undefined;

  for (let seedPair of seedPairs) {
    const [start, range] = seedPair;

    for (let i = start; i < (start + range); i++) {
      let locPos = convertToLocation(+i, mappings);

      if (typeof lowestPos === 'number') {
        lowestPos = Math.min(locPos, lowestPos);
      } else {
        lowestPos = locPos;
      }

    }

  }

  return lowestPos;
}


console.log(findLowestLocation());