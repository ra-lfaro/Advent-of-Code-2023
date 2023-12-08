/*
  https://adventofcode.com/2023/day/8 
*/

import DOCUMENTS from './input';

const SAMPLE1 = [
  'RL',
  '',
  'AAA = (BBB, CCC)',
  'BBB = (DDD, EEE)',
  'CCC = (ZZZ, GGG)',
  'DDD = (DDD, DDD)',
  'EEE = (EEE, EEE)',
  'GGG = (GGG, GGG)',
  'ZZZ = (ZZZ, ZZZ)'
];

const SAMPLE2 = [
  'LLR',
  '',
  'AAA = (BBB, BBB)',
  'BBB = (AAA, ZZZ)',
  'ZZZ = (ZZZ, ZZZ)'
];

const SAMPLE3 = [
  'LR',
  '',
  '11A = (11B, XXX)',
  '11B = (XXX, 11Z)',
  '11Z = (11B, XXX)',
  '22A = (22B, XXX)',
  '22B = (22C, 22C)',
  '22C = (22Z, 22Z)',
  '22Z = (22B, 22B)',
  'XXX = (XXX, XXX)'
];

type ParsedNode = [
  parentKey: string,
  leftKey: string,
  rightKey: string
]

class Node {
  key: string;
  left: Node | null;
  right: Node | null;

  constructor(key: string, left?: Node, right?: Node) {
    this.key = key;
    this.left = left || null;
    this.right = right || null;
  }
}

class Matrix {
  heads: Node[] | null;
  matrix: Record<string, Node> = {};

  constructor(nodes: ParsedNode[]) {
    this.heads = null;
    this.buildMatrix(nodes);
  }

  buildMatrix(nodes: ParsedNode[]) {

    let heads: Node[] = []

    //create initial nodes
    for (let i = 0; i < nodes.length; i++) {
      const [key] = nodes[i];
      this.matrix[key] = new Node(key);

      if (key.endsWith('A')) {
        heads.push(this.matrix[key]);
      }
    }

    //add all the children references
    for (let i = 0; i < nodes.length; i++) {
      const [key, leftKey, rightKey] = nodes[i];
      let node = this.matrix[key];
      node.left = this.matrix[leftKey];
      node.right = this.matrix[rightKey];
    }

    this.heads = heads;
  }

  traverseUntilExit(directions: string) {
    let cycleLengths: number[] = [];

    for (let c of (this.heads || [])) {
      let cycleLength = this.findDistanceToNodesEnd(c, directions);
      cycleLengths.push(cycleLength);
    }

    // I had to look this part up cause i didnt know the best way to calculate it
    // https://stackoverflow.com/a/49722579
    // https://en.wikipedia.org/wiki/Euclidean_algorithm

    const greatestCommonDivisor = (a: number, b: number): number => a ? greatestCommonDivisor(b % a, a) : b;
    const leastCommonMultiplier = (a: number, b: number): number => a * b / greatestCommonDivisor(a, b);

    return cycleLengths.reduce(leastCommonMultiplier);
  }

  findDistanceToNodesEnd(start: Node, directions: string) {
    let curr = start;
    let stepsTaken = 0;
    let i = 0;

    while (curr && !curr?.key.endsWith('Z')) {
      let nextStep = directions[i];
      stepsTaken++;

      curr = (nextStep === 'L' ? curr?.left : curr.right) as Node;

      // repeat steps if necessary
      if (i === directions.length - 1) {
        i = 0;
      } else {
        i++
      }
    }

    return stepsTaken;
  }

  logMatrix() {
    for (let key of Object.keys(this.matrix)) {
      console.log(`Parent: ${key}; Left: ${this.matrix[key].left?.key}; Right: ${this.matrix[key].right?.key}`)
    }
  }
}

const parseInput = (documents: string[]): [string, ParsedNode[]] => {
  const directions = documents[0];

  const nodes: ParsedNode[] = [];

  for (let i = 2; i < documents.length; i++) {
    const [key, children] = documents[i].split(" = ");
    const [left, right] = children.split(", ");

    //shave off the ( and )
    nodes.push([key, left.slice(1), right.slice(0, right.length - 1)])
  }

  return [directions, nodes];
};


const calculateSteps = (documents = DOCUMENTS) => {
  const [directions, nodes] = parseInput(documents);

  const matrix = new Matrix(nodes);
  const stepsTaken = matrix.traverseUntilExit(directions);
  
  console.log(stepsTaken);
  return stepsTaken;
}

calculateSteps();
// calculateSteps(SAMPLE1);
// calculateSteps(SAMPLE2)
// calculateSteps(SAMPLE3)