import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { Cell, Dir, Grid, GridPos } from "../../../util/grid";

const YEAR = 2024;
const DAY = 15;

// solution path: /Users/todd/projects/advent-of-code/years/2024/15/index.ts
// data path    : /Users/todd/projects/advent-of-code/years/2024/15/data.txt
// problem url  : https://adventofcode.com/2024/day/15

function findBlank(cell: Cell, direction: GridPos) {
  const cells = new Array<Cell>();
  cells.push(cell);
  let currCell = cell;
  while (currCell) {
    const nextCell = currCell.repeatMovements([direction]);
    if (!nextCell || nextCell.value === "#") return undefined;
    if (nextCell.value === ".") {
      cells.push(nextCell);
      return cells;
    }
    if (nextCell.value === "O") {
      cells.push(nextCell);
      currCell = nextCell;
    } else {
      return undefined;
    }
  }
  return undefined;
}

function moveRobot(grid: Grid, cell: Cell, direction: GridPos) {
  const nextCell = cell.repeatMovements([direction]);
  if (!nextCell || nextCell.value === "#") return cell;
  if (nextCell.value === ".") {
    nextCell.setValue("@");
    cell.setValue(".");
    return nextCell;
  }
  if (nextCell.value === "O") {
    const cells = findBlank(nextCell, direction);
    if (!cells) return cell;
    // cells will contain 1 or more "O" cells followed by a blank cell
    cells[cells.length - 1].setValue("O");
    cells[0].setValue("@");
    cell.setValue(".");
    return cells[0];
  }
  return cell;
}

function gpsScore(grid: Grid) {
  const cells = grid.getCells(c => c.value === "O");
  return cells.reduce((acc, curr) => {
    const [row, col] = curr.position;
    return acc + (100 * row + col);
  }, 0);
}

async function p2024day15_part1(input: string, ...params: any[]) {
  const [gridText, moveText] = input.split("\n\n");
  const moves = moveText
    .replaceAll("\n", "")
    .split("")
    .map(c => {
      switch (c) {
        case "^":
          return Dir.U;
        case "v":
          return Dir.D;
        case "<":
          return Dir.L;
        case ">":
          return Dir.R;
      }
      throw new Error(`Invalid move character: ${c}`);
    });
  const grid = new Grid({ serialized: gridText });
  let cell = grid.getCell(c => c.value === "@");
  if (!cell) throw new Error("No starting cell found");
  let idx = 0;
  for (const move of moves) {
    // console.log(`Move ${moveText[idx]}`);
    cell = moveRobot(grid, cell, move);
    // grid.log(false);
    if (!cell) {
      throw new Error("No cell found");
    }
    idx++;
  }
  grid.log(false);
  const score = gpsScore(grid);
  return score.toString();
}

async function p2024day15_part2(input: string, ...params: any[]) {
  return "Not implemented";
}

async function run() {
  const part1tests: TestCase[] = [
    {
      input: `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`,
      expected: "10092",
    },
  ];
  const part2tests: TestCase[] = [];

  const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

  // Run tests
  test.beginTests();
  await test.section(async () => {
    for (const testCase of p1testsNormalized) {
      test.logTestResult(testCase, String(await p2024day15_part1(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  await test.section(async () => {
    for (const testCase of p2testsNormalized) {
      test.logTestResult(testCase, String(await p2024day15_part2(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  test.endTests();

  // Get input and run program while measuring performance
  const input = await util.getInput(DAY, YEAR);

  const part1Before = performance.now();
  const part1Solution = String(await p2024day15_part1(input));
  const part1After = performance.now();

  const part2Before = performance.now();
  const part2Solution = String(await p2024day15_part2(input));
  const part2After = performance.now();

  logSolution(15, 2024, part1Solution, part2Solution);

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
