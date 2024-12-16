import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { Grid, GridPos } from "../../../util/grid";

const YEAR = 2024;
const DAY = 14;

// solution path: /Users/todd/projects/advent-of-code/years/2024/14/index.ts
// data path    : /Users/todd/projects/advent-of-code/years/2024/14/data.txt
// problem url  : https://adventofcode.com/2024/day/14

class Robot {
  position: number[];
  velocity: number[];

  constructor(digits: number[]) {
    this.position = digits.slice(0, 2);
    this.velocity = digits.slice(2);
  }

  move(dimensions: number[], count = 1) {
    this.position[0] = util.mod(this.position[0] + this.velocity[0] * count, dimensions[0]);
    this.position[1] = util.mod(this.position[1] + this.velocity[1] * count, dimensions[1]);
  }
}

function parseRobot(line: string) {
  const values = line.match(/(-*[0-9])+/g)!.map(Number);
  return new Robot(values);
}

function quadrantCount(robots: Robot[], dimensions: number[], quadrant: number[]) {
  const halfWidth = Math.floor(dimensions[0] / 2);
  const halfHeight = Math.floor(dimensions[1] / 2);
  const xRange = [(halfWidth + 1) * quadrant[0], halfWidth];
  const yRange = [(halfHeight + 1) * quadrant[1], halfHeight];

  const inRange = (n: number, range: number[]) => n >= range[0] && n < range[0] + range[1];

  return robots.reduce((acc, r) => {
    if (inRange(r.position[0], xRange) && inRange(r.position[1], yRange)) acc++;
    return acc;
  }, 0);
}

async function p2024day14_part1(input: string, ...params: any[]) {
  const robots = input.split("\n").map(parseRobot);
  const dimensions = params.length ? (params as number[]) : [101, 103];
  robots.forEach(r => r.move(dimensions, 100));
  // printGrid(robots, dimensions);
  let total = 1;
  for (let qx = 0; qx < 2; qx++) {
    for (let qy = 0; qy < 2; qy++) {
      const count = quadrantCount(robots, dimensions, [qx, qy]);
      total *= count;
    }
  }
  return total.toString();
}

function isChristmasTree(robots: Robot[], dimensions: number[], numConsecutive = 10) {
  for (let row = 0; row < dimensions[1]; row++) {
    const rowRobots = robots.filter(r => r.position[1] === row);
    const columns = new Set(rowRobots.map(r => r.position[0]));
    if (columns.size >= numConsecutive) {
      const sorted = _.sortBy(Array.from(columns));
      const result = _.reduce(
        sorted,
        (acc, num) => {
          if (_.isEmpty(acc) || num !== _.last(_.last(acc))! + 1) {
            acc.push([num]);
          } else {
            _.last(acc)!.push(num);
          }
          return acc;
        },
        [] as number[][]
      );
      const consec = result.find(r => r.length >= numConsecutive);
      if (consec) return true;
    }
  }
  return false;
}

function printGrid(robots: Robot[], dimensions: number[]) {
  const grid = new Grid({ colCount: dimensions[0], rowCount: dimensions[1], fillWith: "." });
  robots.forEach(r => {
    const pos: GridPos = [r.position[1], r.position[0]];
    const cell = grid.getCell(pos);
    if (!cell) return;
    if (cell.value === ".") cell.setValue("1");
    else cell.setValue((Number(cell.value) + 1).toString());
  });
  grid.log(false);
}

async function p2024day14_part2(input: string, ...params: any[]) {
  const robots = input.split("\n").map(parseRobot);
  const dimensions = params.length ? (params as number[]) : [101, 103];
  let count = 0;
  while (!isChristmasTree(robots, dimensions)) {
    robots.forEach(r => r.move(dimensions));
    if (count % 1000 === 0) {
      console.log(count);
    }
    count++;
    if (count > 100000) return "Too many iterations";
  }
  printGrid(robots, dimensions);
  return count.toString();
}

async function run() {
  const part1tests: TestCase[] = [
    {
      input: `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`,
      expected: "12",
      extraArgs: [11, 7],
    },
  ];
  const part2tests: TestCase[] = [];

  const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

  // Run tests
  test.beginTests();
  await test.section(async () => {
    for (const testCase of p1testsNormalized) {
      test.logTestResult(testCase, String(await p2024day14_part1(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  await test.section(async () => {
    for (const testCase of p2testsNormalized) {
      test.logTestResult(testCase, String(await p2024day14_part2(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  test.endTests();

  // Get input and run program while measuring performance
  const input = await util.getInput(DAY, YEAR);

  const part1Before = performance.now();
  const part1Solution = String(await p2024day14_part1(input));
  const part1After = performance.now();

  const part2Before = performance.now();
  const part2Solution = String(await p2024day14_part2(input));
  const part2After = performance.now();

  logSolution(14, 2024, part1Solution, part2Solution);

  log(chalk.gray("--- Performance ---"));
  log(chalk.gray(`Part 1: ${util.formatTime(part1After - part1Before)}`));
  log(chalk.gray(`Part 2: ${util.formatTime(part2After - part2Before)}`));
  log();
}

run()
  .then(() => {
    process.exit();
  })
  .catch(error => {
    throw error;
  });
