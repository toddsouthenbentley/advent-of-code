import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { Cell, Grid } from "../../../util/grid";

const YEAR = 2024;
const DAY = 10;

// solution path: /Users/todd/projects/advent-of-code/years/2024/10/index.ts
// data path    : /Users/todd/projects/advent-of-code/years/2024/10/data.txt
// problem url  : https://adventofcode.com/2024/day/10

// const locationToPaths = new Map<string, number>();
// function traversePath(start: Cell) {
//   if (start.value === "9") {
//     locationToPaths.set(start.position.toString(), 1);
//     // we're done
//     return 1;
//   }

//   const nextVal = (Number(start.value) + 1).toString();
//   const nexts = start.neighbors(false, false, true, true).filter(c => c.value === nextVal);
//   let nextNumPaths = 0;
//   for (const next of nexts) {
//     const numPaths = locationToPaths.get(next.toString());
//     if (numPaths === undefined) {
//       nextNumPaths += traversePath(next);
//     } else {
//       nextNumPaths += numPaths;
//     }
//   }
//   locationToPaths.set(start.position.toString(), nextNumPaths);
//   return nextNumPaths;
// }

async function p2024day10_part1(input: string, ...params: any[]) {
  const grid = new Grid({ serialized: input });
  const starts = grid.getCells("0");
  const visited = new Set<string>();
  const ends = new Set<string>();

  function traversePath(start: Cell) {
    visited.add(start.position.toString());
    if (start.value === "9") {
      ends.add(start.position.toString());
      return;
    }
    const nextVal = (Number(start.value) + 1).toString();
    const nexts = start
      .neighbors(false, false, true, true)
      .filter(c => c.value === nextVal && !visited.has(c.position.toString()));
    for (const next of nexts) {
      traversePath(next);
    }
  }

  let totalPaths = 0;
  for (const start of starts) {
    visited.clear();
    ends.clear();
    traversePath(start);
    totalPaths += ends.size;
  }
  return totalPaths.toString();
}

async function p2024day10_part2(input: string, ...params: any[]) {
  const grid = new Grid({ serialized: input });
  const starts = grid.getCells("0");
  const locationToPaths = new Map<string, number>();

  function traversePath(start: Cell) {
    if (start.value === "9") {
      locationToPaths.set(start.position.toString(), 1);
      // we're done
      return 1;
    }

    const nextVal = (Number(start.value) + 1).toString();
    const nexts = start.neighbors(false, false, true, true).filter(c => c.value === nextVal);
    let nextNumPaths = 0;
    for (const next of nexts) {
      const numPaths = locationToPaths.get(next.toString());
      if (numPaths === undefined) {
        nextNumPaths += traversePath(next);
      } else {
        nextNumPaths += numPaths;
      }
    }
    locationToPaths.set(start.position.toString(), nextNumPaths);
    return nextNumPaths;
  }

  let totalPaths = 0;
  for (const start of starts) {
    const numPaths = traversePath(start);
    totalPaths += numPaths;
  }
  return totalPaths.toString();
}

async function run() {
  const part1tests: TestCase[] = [
    {
      input: `...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9`,
      expected: "2",
    },
    {
      input: `..90..9
...1.98
...2..7
6543456
765.987
876....
987....`,
      expected: "4",
    },
    {
      input: `10..9..
2...8..
3...7..
4567654
...8..3
...9..2
.....01`,
      expected: "3",
    },
    {
      input: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
      expected: "36",
    },
  ];
  const part2tests: TestCase[] = [
    {
      input: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
      expected: "81",
    },
  ];

  const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

  // Run tests
  test.beginTests();
  await test.section(async () => {
    for (const testCase of p1testsNormalized) {
      test.logTestResult(testCase, String(await p2024day10_part1(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  await test.section(async () => {
    for (const testCase of p2testsNormalized) {
      test.logTestResult(testCase, String(await p2024day10_part2(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  test.endTests();

  // Get input and run program while measuring performance
  const input = await util.getInput(DAY, YEAR);

  const part1Before = performance.now();
  const part1Solution = String(await p2024day10_part1(input));
  const part1After = performance.now();

  const part2Before = performance.now();
  const part2Solution = String(await p2024day10_part2(input));
  const part2After = performance.now();

  logSolution(10, 2024, part1Solution, part2Solution);

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
