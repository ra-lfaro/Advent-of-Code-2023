/*
  https://adventofcode.com/2023/day/6
*/

import BOAT_CONSTRAINTS from "./input";

const SAMPLE = [
  'Time:      7  15   30',
  'Distance:  9  40  200'
];

type RaceParameters = [
  timeAllowed: number,
  misDistance: number
];

const parseBoatConstraints = (data: string[]): RaceParameters => {
  const [timesRaw, distancesRaw] = data;
  const times = timesRaw.matchAll(/\d+/g);
  const distances = distancesRaw.matchAll(/\d+/g);

  return [
    +([...times].reduce((ongoing, curr) => ongoing + curr, '')),
    +([...distances].reduce((ongoing, curr) => ongoing + curr, ''))
  ];
};

const calculateDistanceTraveled = (timeCharged: number, totalAllowed: number) => {
  return timeCharged * (totalAllowed - timeCharged);
};


const calculateRacePossibilities = (timeAllowed: number, minDistance: number) => {
  let winningChargeTimes = 0;

  /* 
    even less iterations and space vs tracking compliments in part 1
    you know the second half will all be compliments so you can just iterate over the first half of times
  */
  for (let i = 0; i <= Math.floor(timeAllowed / 2); i++) {
    let distanceTraveled = calculateDistanceTraveled(i, timeAllowed);
    if (distanceTraveled > minDistance) {
      winningChargeTimes++;
    }
  }

  // even times will be off by 1
  return timeAllowed % 2 ? (winningChargeTimes * 2) : (winningChargeTimes * 2) - 1;
};

const findPossibleWinningCombinations = (data = BOAT_CONSTRAINTS) => {
  const [timeAllowed, minDistance] = parseBoatConstraints(data)
  return calculateRacePossibilities(timeAllowed, minDistance);
};


console.log(findPossibleWinningCombinations());