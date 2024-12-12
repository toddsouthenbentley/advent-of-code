import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { Cell, Dir, Grid, GridPos } from "../../../util/grid";

const YEAR = 2024;
const DAY = 6;

// solution path: /Users/todd/projects/advent-of-code/years/2024/06/index.ts
// data path    : /Users/todd/projects/advent-of-code/years/2024/06/data.txt
// problem url  : https://adventofcode.com/2024/day/6

function traverseGrid(grid: Grid) {
  const locations = new Set<string>();
  let currCell: Cell | undefined = grid.getCell("^");
  if (!currCell) return locations;
  let direction = Dir.N;

  while (currCell) {
    locations.add(currCell.position.toString());
    const nextCell = currCell.repeatMovements([direction]);
    if (!nextCell) break;
    if (nextCell.value === "#") {
      direction = [direction[1], -direction[0]];
    } else {
      currCell = nextCell;
    }
  }
  return locations;
}

async function p2024day6_part1(input: string, ...params: any[]) {
  const grid = new Grid({ serialized: input });
  const locations = traverseGrid(grid);
  return locations.size.toString();
}

function hasLoops(currCell: Cell) {
  const locations = new Set<string>();
  if (!currCell) return locations;
  let direction = Dir.N;
  const keyVal = (pos: GridPos, dir: GridPos) => `${pos[0]}, ${pos[1]}, ${dir[0]}, ${dir[1]}`;
  while (currCell) {
    locations.add(keyVal(currCell.position, direction));
    const nextCell: Cell | undefined = currCell.repeatMovements([direction]);
    if (!nextCell) break;
    if (nextCell.value === "#") {
      direction = [direction[1], -direction[0]];
    } else {
      currCell = nextCell;
    }
    if (locations.has(keyVal(currCell.position, direction))) {
      return true;
    }
  }
  return false;
}

async function p2024day6_part2(input: string, ...params: any[]) {
  const grid = new Grid({ serialized: input });
  const locations = traverseGrid(grid);
  const gridPositions: GridPos[] = Array.from(locations).map((l: string) => l.split(",").map(Number) as GridPos);
  const visitedCells = gridPositions.map(l => grid.getCell(l)).filter(c => c);
  let count = 0;

  const startCell = grid.getCell("^");
  for (const cell of visitedCells) {
    if (!cell || cell.value !== ".") continue;
    grid.setCell(cell.position, "#");
    if (hasLoops(startCell!)) count++;
    grid.setCell(cell.position, ".");
  }
  return count.toString();
}

async function run() {
  const part1tests: TestCase[] = [
    {
      input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
      expected: "41",
    },
  ];
  const part2tests: TestCase[] = [
    {
      input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
      expected: "6",
    },
  ];

  const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

  // Run tests
  test.beginTests();
  await test.section(async () => {
    for (const testCase of p1testsNormalized) {
      test.logTestResult(testCase, String(await p2024day6_part1(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  await test.section(async () => {
    for (const testCase of p2testsNormalized) {
      test.logTestResult(testCase, String(await p2024day6_part2(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  test.endTests();

  // Get input and run program while measuring performance
  const input = await util.getInput(DAY, YEAR);

  const part1Before = performance.now();
  const part1Solution = String(await p2024day6_part1(input));
  const part1After = performance.now();

  const part2Before = performance.now();
  const part2Solution = String(await p2024day6_part2(input));
  const part2After = performance.now();

  logSolution(6, 2024, part1Solution, part2Solution);

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
