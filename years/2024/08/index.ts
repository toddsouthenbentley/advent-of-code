import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { Cell, Grid, GridPos } from "../../../util/grid";

const YEAR = 2024;
const DAY = 8;

// solution path: /Users/todd/projects/advent-of-code/years/2024/08/index.ts
// data path    : /Users/todd/projects/advent-of-code/years/2024/08/data.txt
// problem url  : https://adventofcode.com/2024/day/8

function determineLocations(input: string, part1: boolean) {
  const locations = new Set<string>();
  // set of unique chars in input
  const chars = new Set(input.split(""));
  chars.delete(".");
  chars.delete("\n");

  const grid = new Grid({ serialized: input });
  for (const currChar of chars) {
    const cells = grid.getCells(currChar);
    for (let ii = 0; ii < cells.length; ii++) {
      for (let jj = 0; jj < cells.length; jj++) {
        if (ii === jj) continue;
        const [cell1, cell2] = [cells[ii], cells[jj]];
        const delta: GridPos = [cell1.position[0] - cell2.position[0], cell1.position[1] - cell2.position[1]];
        if (part1) {
          const candidate = cell1.repeatMovements([delta]);
          if (candidate) {
            locations.add(candidate.toString());
          }
        } else {
          let currCell: Cell | undefined = cell1;
          while (currCell) {
            locations.add(currCell.toString());
            currCell = currCell.repeatMovements([delta]);
          }
        }
      }
    }
  }
  return locations;
}

async function p2024day8_part1(input: string, ...params: any[]) {
  const locations = determineLocations(input, true);
  return locations.size;
}

async function p2024day8_part2(input: string, ...params: any[]) {
  const locations = determineLocations(input, false);
  return locations.size;
}

async function run() {
  const part1tests: TestCase[] = [
    {
      input: `..........
..........
..........
....a.....
..........
.....a....
..........
..........
..........
..........`,
      expected: "2",
    },
    {
      input: `..........
..........
..........
....a.....
........a.
.....a....
..........
......A...
..........
..........`,
      expected: "4",
    },
    {
      input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
      expected: "14",
    },
  ];
  const part2tests: TestCase[] = [
    {
      input: `T.........
...T......
.T........
..........
..........
..........
..........
..........
..........
..........`,
      expected: "9",
    },
    {
      input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
      expected: "34",
    },
  ];

  const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

  // Run tests
  test.beginTests();
  await test.section(async () => {
    for (const testCase of p1testsNormalized) {
      test.logTestResult(testCase, String(await p2024day8_part1(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  await test.section(async () => {
    for (const testCase of p2testsNormalized) {
      test.logTestResult(testCase, String(await p2024day8_part2(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  test.endTests();

  // Get input and run program while measuring performance
  const input = await util.getInput(DAY, YEAR);

  const part1Before = performance.now();
  const part1Solution = String(await p2024day8_part1(input));
  const part1After = performance.now();

  const part2Before = performance.now();
  const part2Solution = String(await p2024day8_part2(input));
  const part2After = performance.now();

  logSolution(8, 2024, part1Solution, part2Solution);

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
