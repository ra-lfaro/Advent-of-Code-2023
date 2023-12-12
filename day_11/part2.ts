
import OBSERVATIONAL_DATA from './input';

const SAMPLE = [
  '...#......',
  '.......#..',
  '#.........',
  '..........',
  '......#...',
  '.#........',
  '.........#',
  '..........',
  '.......#..',
  '#...#.....',
];

type Cell = {
  value: string;
  distance: number;
  coords: [number, number]
  isGalaxy: boolean;
}

const parseUniverse = (observationalData = OBSERVATIONAL_DATA): [Cell[][], [number, number][], Set<number>, Set<number>] => {

  let universe: Cell[][] = [];
  let galaxies: [number, number][] = []
  let emptyRows = new Set<number>();
  let emptyCols = new Set<number>();

  // parse initial cell values and empty row flags
  for (let row = 0; row < observationalData.length; row++) {
    let uniRow: Cell[] = [];

    const isEmptyRow = (observationalData[row].indexOf('#') === -1) ? true : false;
    if (isEmptyRow) {
      emptyRows.add(row);
    }

    for (let col = 0; col < observationalData[row].length; col++) {
      const value = observationalData[row][col];
      const isGalaxy = value === '#';

      if (isGalaxy) {
        galaxies.push([row, col]);
      }

      uniRow.push({ value, coords: [row, col], distance: isEmptyRow ? 2 : 1, isGalaxy })
    }
    universe.push(uniRow);
  }

  // double distance of any empty columns
  for (let col = 0; col < universe[0].length; col++) {
    const isEmptyCol = !universe.some((row) => {
      return row[col].value === '#';
    });

    if (isEmptyCol) {
      emptyCols.add(col);
      universe.forEach(row => {
        row[col].distance = 2;
      })
    }
  }

  return [universe, galaxies, emptyRows, emptyCols];
};

const printUniverse = (universe: Cell[][]) => {
  for (let row of universe) {
    let line = ""
    for (let cell of row) {
      let val = ' ' + cell.distance;

      if (cell.isGalaxy) {
        val = ' ' + cell.value;
      }

      line += val;
    }
    console.log(line);
  }
}

const calculateManhattanDistance = (a: [number, number], b: [number, number]) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

const calculateDistance = (a: [number, number], b: [number, number], emptyRows: Set<number>, emptyCols: Set<number>) => {
  let manDistance = calculateManhattanDistance(a, b);
  let expandedDistancesCrossed = 0;


  let start = Math.min(a[0], b[0]);
  let end = Math.max(a[0], b[0]);

  for (let i = start; i <= end; i++) {
    if (emptyCols.has(i)) {
      expandedDistancesCrossed++;
    }
  }

  start = Math.min(a[1], b[1]);
  end = Math.max(a[1], b[1]);
  for (let i = start; i <= end; i++) {
    if (emptyRows.has(i)) {
      expandedDistancesCrossed++;
    }
  }

  return manDistance + (expandedDistancesCrossed * 999999);
};

const calculateAllShortestPaths = (observationalData = OBSERVATIONAL_DATA) => {
  let [universe, galaxies, emptyCols, emptyRows] = parseUniverse(observationalData);
  // printUniverse(universe);

  let pairsSeen: Record<string, string> = {}
  let sum = 0;
  for (let galaxy of galaxies) {
    sum += galaxies.reduce((ongoing, curr) => {
      if (curr === galaxy || pairsSeen[`${galaxy[0]}-${galaxy[1]}:${curr[0]}-${curr[1]}`]) {
        return ongoing;
      }

      pairsSeen[`${curr[0]}-${curr[1]}:${galaxy[0]}-${galaxy[1]}`] = `1`;

      return ongoing + calculateDistance(galaxy, curr, emptyRows, emptyCols);

    }, 0)
  }

  console.log(sum)
};

calculateAllShortestPaths();
calculateAllShortestPaths(SAMPLE);