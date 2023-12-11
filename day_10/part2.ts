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

const SAMPLE3 = [
  '..........',
  '.S------7.',
  '.|F----7|.',
  '.||....||.',
  '.||....||.',
  '.|L-7F-J|.',
  '.|..||..|.',
  '.L--JL--J.',
  '..........'
];

const SAMPLE4 = [
  '.F----7F7F7F7F-7....',
  '.|F--7||||||||FJ....',
  '.||.FJ||||||||L7....',
  'FJL7L7LJLJ||LJ.L-7..',
  'L--J.L7...LJS7F-7L7.',
  '....F-J..F7FJ|L7L7L7',
  '....L7.F7||L7|.L7L7|',
  '.....|FJLJ|FJ|F7|.LJ',
  '....FJL-7.||.||||...',
  '....L---J.LJ.LJLJ...'
];

const SAMPLE5 = [
  'FF7FSF7F7F7F7F7F---7',
  'L|LJ||||||||||||F--J',
  'FL-7LJLJ||||||LJL-77',
  'F--JF--7||LJLJ7F7FJ-',
  'L---JF-JLJ.||-FJLJJ7',
  '|F|F-JF---7F7-L7L|7|',
  '|FFJF7L7F-JF7|JL---7',
  '7-L-JL7||F7|L7F-7F7|',
  'L.L7LFJ|||||FJL7||LJ',
  'L7JLJL-JLJLJL--JLJ.L'
];

import MAZE_SKETCH from './input';


class MazeSpace {
  value: string;
  coords: [number, number];

  isStart = false;
  isMazePath = false;
  isEnclosed = false;

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
          space.isMazePath = true;
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
      curr.isMazePath = true;

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
    if (this.maze?.[startX - 1]?.[startY]?.down) {
      steps.push(this.maze[startX - 1][startY]);
    }
    // does the below space have the option to go up
    if (this.maze?.[startX + 1]?.[startY]?.up) {
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

  // point in polygon principal
  countEnclosed() {
    let count = 0;
    let isOutside = true;

    for (let col = 0; col < this.maze.length; col++) {
      for (let entry of this.maze[col]) {
        if (entry.isMazePath) {
          if ((/\||L|J|S/).test(entry.value)) {
            isOutside = !isOutside;
          }
        } else {
          if (!isOutside) {
            entry.isEnclosed = true;
            count++;
          }
        }
      }
      isOutside = true;
    }

    return count;
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

  printPath() {
    for (let col = 0; col < this.maze.length; col++) {
      let row = '';
      for (let entry of this.maze[col]) {
        let val = " "
        if (entry.isMazePath || entry.isStart) {
          val = entry.value;
        }
        row += val;
      }
      console.log(row);
    }

    console.log(`Start: ${this.start?.coords}`);
  }

  printEnclosedSpaces() {
    for (let col = 0; col < this.maze.length; col++) {
      let row = '';
      for (let entry of this.maze[col]) {
        let val = " ";

        if (!entry.isMazePath) {
          if (entry.isEnclosed) {
            val = 'X';
          } else {
            val = 'O';

          }
        }

        row += val;
      }
      console.log(row);
    }

    console.log(`Start: ${this.start?.coords}`);
  }

  printEnclosedSpacesWithMaze() {
    for (let col = 0; col < this.maze.length; col++) {
      let row = '';
      for (let entry of this.maze[col]) {
        let val = entry.value;

        if (!entry.isMazePath) {
          if (entry.isEnclosed) {
            val = 'X';
          } else {
            val = 'O';

          }
        }

        row += val;
      }
      console.log(row);
    }

    console.log(`Start: ${this.start?.coords}`);
  }

}




const calculateFurthestStep = (sketch = MAZE_SKETCH) => {
  console.log('----------- MAZE ----------')
  console.log('')

  let maze = new Maze(sketch);

  const lengthOfMaze = maze.traverse();
  let enclosedSpaces = maze.countEnclosed();

  // maze.print();
  // maze.printPath();
  // maze.printEnclosedSpaces();
  // maze.printEnclosedSpacesWithMaze();

  console.log(`Length of Maze: ${lengthOfMaze}`);
  console.log(`Length of Maze / 2: ${lengthOfMaze / 2}`);
  console.log(`Enclosed Area: ${enclosedSpaces}`);

  console.log('')
};

// calculateFurthestStep(SAMPLE);
// calculateFurthestStep(SAMPLE2);
// calculateFurthestStep(SAMPLE3);
// calculateFurthestStep(SAMPLE4);
// calculateFurthestStep(SAMPLE5);
calculateFurthestStep();
