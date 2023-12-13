/*
  https://adventofcode.com/2023/day/2
*/

import GAME_RECORDS from "./input";

const RED_MAX = 12;
const GREEN_MAX = 13;
const BLUE_MAX = 14;

// Grab the digits if they preceed the color and name them as such for the match
const RECORD_COUNT_REGEX = /(?<blue>\d+(?=( blue)))|(?<green>\d+(?=( green)))|(?<red>\d+(?=( red)))/g
const ID_REGEX = /\d+/

const isGameValid = (gameRecord: string) => {

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

  for (let match of groupMatches) {
    // if any are larger then their respective maxs fail
    if (
      (+(match?.groups?.blue ?? 0) > BLUE_MAX) ||
      (+(match?.groups?.green ?? 0) > GREEN_MAX) ||
      (+(match?.groups?.red ?? 0) > RED_MAX)
    ) {
      return false;
    }
  }

  return true;

};

const checkGames = (games = GAME_RECORDS) => {
  let result = 0;

  for (let game of games) {
    let [gameId, gameRecord] = game.split(': ');
    if (isGameValid(gameRecord)) {
      result += +(gameId.match(ID_REGEX) ?? 0);
    }
  }

  return result;
};

console.log(checkGames());
