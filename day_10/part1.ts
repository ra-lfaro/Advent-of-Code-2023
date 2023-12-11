/*
  https://adventofcode.com/2023/day/10
  */

/*
..... 
.S-7.
.|.|.
.L-J.
.....

.....
.012.
.1.3.
.234.
.....
*/
const SAMPLE = [
  '-L|F7',
  '7S-7|',
  'L|7||',
  '-L-J|',
  'L|-JF'
];

/*
  ..F7.
  .FJ|.
  SJ.L7
  |F--J
  LJ...

  ..45.
  .236.
  01.78
  14567
  23...
*/
const SAMPLE2 = [
  '7-F7-',
  '.FJ|7',
  'SJLL7',
  '|F--J',
  'LJ.LJ',
];

import MAZE_SKETCH from './input';


class MazeSpace {
  value: string;
  coords: [number, number];

  isStart = false;

  // possible connections
  up = false;
  down = false;
  right = false;
  left = false;

  constructor(value: string, x: number, y: number) {
    this.value = value
    this.coords = [x, y];

    switch (value) {
      case '|':
        this.up = true;
        this.down = true;
        break;
      case '-':
        this.left = true;
        this.right = true;
        break;
      case 'L':
        this.up = true;
        this.right = true;
        break;
      case 'J':
        this.up = true;
        this.left = true;
        break;
      case '7':
        this.left = true;
        this.down = true;
        break;
      case 'F':
        this.right = true;
        this.down = true;
        break;
      case 'S':
        this.isStart = true;
        break;
      default:
        break;
    }
  }

  getPossibleNextCoords() {
    let nextPossibleCoords: [number, number][] = [];
    let [currX, currY] = this.coords;

    if (this.up) {
      nextPossibleCoords.push([currX - 1, currY]);
    }

    if (this.down) {
      nextPossibleCoords.push([currX + 1, currY]);
    }

    if (this.left) {
      nextPossibleCoords.push([currX, currY - 1]);
    }

    if (this.right) {
      nextPossibleCoords.push([currX, currY + 1]);
    }

    return nextPossibleCoords;
  }
}

class Maze {
  maze: MazeSpace[][] = [];
  start: MazeSpace = new MazeSpace('.', 0, 0); //placeholder, replaced at build

  constructor(sketch: string[]) {
    this.build(sketch);
  }

  build(sketch: string[]) {

    for (let row = 0; row < sketch.length; row++) {
      let mazeRow: MazeSpace[] = [];

      for (let col = 0; col < sketch[row]?.length; col++) {
        const space = new MazeSpace(sketch[row][col], row, col);

        mazeRow.push(space);

        if (space.isStart) {
          this.start = space;
        }

      }

      this.maze.push(mazeRow);
    }

  }

  traverse() {
    return this.traverseDownPath(this.getPossibleFirstSteps()[0]);
  }

  traverseDownPath(firstStep: MazeSpace) {
    let seen = new Set([this.start, firstStep]);
    let curr = firstStep;
    let stepsTaken = 1;

    while (!curr.isStart) {
      //every step should have two options, the path you just came from and the next.

      for (let [x, y] of curr.getPossibleNextCoords()) {
        if (!this.maze?.[x]?.[y] || (seen.has(this.maze[x][y]) && !this.maze[x][y].isStart)) {
          continue;
        }
        seen.add(curr)
        curr = this.maze[x][y];
      }

      stepsTaken++
    }


    return stepsTaken;
  }

  getPossibleFirstSteps() {
    const steps: MazeSpace[] = [];

    let [startX, startY] = this.start.coords;


    // does the above space have the option to go down
    if (this.maze?.[startX - 1][startY]?.down) {
      steps.push(this.maze[startX - 1][startY]);
    }
    // does the below space have the option to go up
    if (this.maze?.[startX + 1][startY]?.up) {
      steps.push(this.maze[startX + 1][startY]);
    }

    // does the space to the right have the option to connect left
    if (this.maze?.[startX]?.[startY + 1]?.left) {
      steps.push(this.maze[startX][startY + 1]);
    }

    // does the space to the left have the option to connect right
    if (this.maze?.[startX]?.[startY - 1]?.right) {
      steps.push(this.maze[startX][startY - 1]);
    }

    return steps;
  }

  print() {
    for (let col = 0; col < this.maze.length; col++) {
      let row = '';
      for (let entry of this.maze[col]) {
        row += entry.value;
      }
      console.log(row);
    }

    console.log(`Start: ${this.start?.coords}`);
  }

}




const calculateFurthestStep = (sketch = MAZE_SKETCH) => {
  let maze = new Maze(sketch);
  // maze.print()
  const lengthOfMaze = maze.traverse();

  console.log(`Length of Maze: ${lengthOfMaze}`);
  console.log(`Length of Maze / 2: ${lengthOfMaze / 2}`);
};

calculateFurthestStep(SAMPLE);
calculateFurthestStep(SAMPLE2);
calculateFurthestStep();
