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
  const groups = unparsedGroups.split(',').map(g => +g);

  const groupRegex = new RegExp(generateRegex(groups));
  const expectedDamaged = groups.reduce((partialSum, a) => partialSum + a, 0);

  const helper = (report: string, currIndex: number): number => {

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

  return helper(status, 0)
};

const countAll = (originalReport: string[]) => {
  let sum = 0;
  for (let report of originalReport) {
    sum += calculatePermutations(report);
  }
  return sum;
}

console.log(countAll(REPORTS));

// calculatePermutations(SAMPLE[4])