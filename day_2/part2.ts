/*
  https://adventofcode.com/2023/day/2
*/

import GAME_RECORDS from "./input";

// Grab the digits if they preceed the color and name them as such for the match
const RECORD_COUNT_REGEX = /(?<blue>\d+(?=( blue)))|(?<green>\d+(?=( green)))|(?<red>\d+(?=( red)))/g

const getMinimumRequiredCubes = (gameRecord: string) => {

  const groupMatches = [...gameRecord.matchAll(RECORD_COUNT_REGEX)];

  /*
    groupMatches will look like 
    [
      groups: {
        blue: '5',
        green: undefined,
        red: undefined
      },
      ...
    ]
  */

  let redMax = 0;
  let blueMax = 0;
  let greenMax = 0;

  // the minimum to make a game valid is the max of each color pulled in a whole game.
  for (let match of groupMatches) {
    redMax = Math.max(redMax, +(match?.groups?.red ?? 0));
    blueMax = Math.max(blueMax, +(match?.groups?.blue ?? 0));
    greenMax = Math.max(greenMax, +(match?.groups?.green ?? 0));
  }

  return [redMax, blueMax, greenMax];
};

const checkGames = (games = GAME_RECORDS) => {
  let result = 0;

  for (let game of games) {
    let [redMin, blueMin, greenMin] = getMinimumRequiredCubes(game);

    let power = redMin * blueMin * greenMin;
    result += power;
  }

  return result;
};

console.log(checkGames());
