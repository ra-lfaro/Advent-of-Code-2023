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

type WinningCombo = [
  timeCharging: number,
  distanceTraveled: number
];

const parseBoatConstraints = (data: string[]) => {
  const [timesRaw, distancesRaw] = data;
  const times = timesRaw.split(/\s+/);
  const distances = distancesRaw.split(/\s+/);

  let results: RaceParameters[] = [];

  for (let i = 1; i < times.length; i++) {
    results.push([+times[i], +distances[i]]);
  }

  return results;
};

const calculateDistanceTraveled = (timeCharged: number, totalAllowed: number) => {
  return timeCharged * (totalAllowed - timeCharged);
};

const calculateRacePossibilities = (timeAllowed: number, minDistance: number) => {
  let winningChargeTimes: WinningCombo[] = [];

  const compliments: Record<string, number> = {}

  for (let i = 0; i <= timeAllowed; i++) {

    // if you find the compliment you dont need to recalculate the distance because the distance will be the same
    if (compliments[timeAllowed - i]) {
      winningChargeTimes.push([i, compliments[timeAllowed - i]])
      continue;
    }

    let distanceTraveled = calculateDistanceTraveled(i, timeAllowed);
    if (distanceTraveled > minDistance) {
      compliments[i] = distanceTraveled;
      winningChargeTimes.push([i, distanceTraveled])
    }
  }

  return winningChargeTimes;
};

const findProductOfBoatRacesWins = (data = BOAT_CONSTRAINTS) => {
  const raceParameters = parseBoatConstraints(data)

  let productOfRaces = 1;

  for (let [timeAllowed, minDistance] of raceParameters) {
    let numberOfPossibilities = calculateRacePossibilities(timeAllowed, minDistance).length;
    productOfRaces *= numberOfPossibilities;
  }

  return productOfRaces;
};


console.log(findProductOfBoatRacesWins());