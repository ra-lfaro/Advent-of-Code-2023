import REPORTS from "./input";

const SAMPLE = [
  '???.### 1,1,3',
  '.??..??...?##. 1,1,3',
  '?#?#?#?#?#?#?#? 1,3,1,6',
  '????.#...#... 4,1,1',
  '????.######..#####. 1,6,5',
  '?###???????? 3,2,1',
];

const generateRegex = (groups: number[]) => {
  let regexToBe = '';

  for (let g of groups) {
    regexToBe += `(#){${g}}(\\.)+`
  }

  regexToBe = regexToBe.slice(0, regexToBe.length - 5);

  return "(\\.|^)" + regexToBe + "(\\.|$)";
}

const calculatePermutations = (originalReport: string) => {

  const [status, unparsedGroups] = originalReport.split(' ');

  // const unfoldedStatus = `${status}?${status}?${status}?${status}?${status}`;
  // const unfoldedGroups = `${unparsedGroups},${unparsedGroups},${unparsedGroups},${unparsedGroups},${unparsedGroups}`;
  const unfoldedStatus = `${status}`;
  const unfoldedGroups = `${unparsedGroups}`;

  const groups = unfoldedGroups.split(',').map(g => +g);
  const expectedDamaged = groups.reduce((partialSum, a) => partialSum + a, 0);

  const groupRegex = new RegExp(generateRegex(groups));
  let iterations = 0;

  const helper = (report: string, currIndex: number): number => {
    iterations++;

    const finishedGroupings = (report.slice(0, currIndex).match(/#+\./g) || []).length
    if (finishedGroupings) {
      let reg = new RegExp(generateRegex(groups.slice(0, finishedGroupings)));
      if (!reg.test(report)) {
        return 0;
      }
    }

    if ((report.match(/#/g) || []).length > expectedDamaged) {
      return 0;
    }

    if (currIndex === report.length) {
      return groupRegex.test(report) ? 1 : 0
    }

    if (report[currIndex] === '?') {
      return helper(report.slice(0, currIndex) + '.' + report.slice(currIndex + 1), currIndex + 1) +
        helper(report.slice(0, currIndex) + '#' + report.slice(currIndex + 1), currIndex + 1);
    }

    return helper(report, currIndex + 1);
  };

  let matchingPossibilities = helper(unfoldedStatus, 0);


  // console.log(possibilities)
  // console.log(matching)
  // console.log(generateRegex(groups))

  // console.log(matchingPossibilities, originalReport, iterations)

  return matchingPossibilities;
};

const countAll = (originalReport: string[]) => {
  let sum = 0;
  for (let report of originalReport) {
    sum += calculatePermutations(report);
  }
  return sum;
}

console.log(countAll(REPORTS));

// calculatePermutations(SAMPLE[0])