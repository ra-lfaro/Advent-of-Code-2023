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
  head: Node | null;
  exit: Node | null;
  matrix: Record<string, Node> = {};

  constructor(nodes: ParsedNode[]) {
    this.head = null;
    this.exit = null;
    this.buildMatrix(nodes);
  }

  buildMatrix(nodes: ParsedNode[]) {

    //create initial nodes
    for (let i = 0; i < nodes.length; i++) {
      const [key] = nodes[i];
      this.matrix[key] = new Node(key);
    }

    //add all the children references
    for (let i = 0; i < nodes.length; i++) {
      const [key, leftKey, rightKey] = nodes[i];
      let node = this.matrix[key];
      node.left = this.matrix[leftKey];
      node.right = this.matrix[rightKey];
    }

    this.head = this.matrix['AAA'];
    this.exit = this.matrix['ZZZ'];
  }

  traverseUntilExit(directions: string) {
    let curr = this.head;
    let stepsTaken = 0;
    let i = 0;

    while (curr && curr?.key !== this.exit?.key) {
      let nextStep = directions[i];
      stepsTaken++;

      curr = nextStep === 'L' ? curr?.left : curr.right;

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
  // matrix.logMatrix();

  const stepsTaken = matrix.traverseUntilExit(directions);
  console.log(stepsTaken);
  return stepsTaken;

}

calculateSteps();
// calculateSteps(SAMPLE1);
// calculateSteps(SAMPLE2)