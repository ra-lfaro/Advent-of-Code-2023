/*
  https://adventofcode.com/2023/day/9
*/

import SENSOR_HISTORY from "./input";

const SAMPLE = [
  '0 3 6 9 12 15',
  '1 3 6 10 15 21',
  '10 13 16 21 30 45',
];

const parseHistories = (data: string[]) => {

  const results: number[][] = [];

  data.forEach(history => {
    const entries = history.split(' ');
    let cleanedValues: number[] = []

    entries.forEach(val => {
      cleanedValues.push(+val);
    })

    results.push(cleanedValues);
  })

  return results;
};

const calcDiff = (a: number, b: number) => b - a;

const generateHistoryDifferences = (valueHistory: number[]) => {
  let historyCalculations: number[][] = [valueHistory];
  let historyIndex = 0;
  let allZerosFound = false;

  while (!allZerosFound) {
    const currentHistory = historyCalculations[historyIndex];
    const differencesOfAboveRow: number[] = [];
    let diffSum = 0;

    for (let i = 0; i < currentHistory.length - 1; i++) {
      let difference = calcDiff(currentHistory[i], currentHistory[i + 1]);
      diffSum += difference
      differencesOfAboveRow.push(difference);
    }

    historyCalculations.push(differencesOfAboveRow);
    historyIndex++;

    if (diffSum === 0) {
      allZerosFound = true;
    }

  }

  return historyCalculations;
};

const addNextValuePrediction = (differenceHistory: number[][]) => {

  for (let i = differenceHistory.length - 2; i >= 0; i--) {
    let curr = differenceHistory[i];
    let diffsOfCurr = differenceHistory[i + 1];

    curr.push(curr[curr.length - 1] + diffsOfCurr[diffsOfCurr.length - 1])
  }

}




const predictSensorValues = (historyData = SENSOR_HISTORY) => {
  let history = parseHistories(historyData);
  let sum = 0;

  for (let dataPointHistory of history) {
    let entryDifferenceCalculations = generateHistoryDifferences(dataPointHistory);
    addNextValuePrediction(entryDifferenceCalculations)

    let predictedNextVal = entryDifferenceCalculations[0][entryDifferenceCalculations[0].length - 1];
    sum += predictedNextVal;
  }

  return sum;
};


console.log(predictSensorValues())
// console.log(predictSensorValues(SAMPLE))