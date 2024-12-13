import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { Cell, Dir, Grid, GridPos } from "../../../util/grid";

const YEAR = 2024;
const DAY = 12;

// solution path: /Users/todd/projects/advent-of-code/years/2024/12/index.ts
// data path    : /Users/todd/projects/advent-of-code/years/2024/12/data.txt
// problem url  : https://adventofcode.com/2024/day/12

function getPerimeter(cluster: Cell[]) {
  let perimeter = 0;
  for (const cell of cluster) {
    const neighborCount = cell.neighbors().filter(c => c.value === cell.value).length;
    perimeter += 4 - neighborCount;
  }
  return perimeter;
}

function getScore(cluster: Cell[]) {
  const perimeter = getPerimeter(cluster);
  return cluster.length * perimeter;
}

const keyVal = (cell: Cell) => `${cell.position[0]}, ${cell.position[1]}`;

function* processClusters(input: string) {
  const values = new Set(input.replaceAll("\n", "").split(""));
  const grid = new Grid({ serialized: input });
  const visited = new Set<string>();

  // grid.log();
  for (const value of values) {
    while (true) {
      const cell = grid.getCell(c => c.value === value && !visited.has(keyVal(c)));
      if (!cell) break;
      const cluster = cell.findCellCluster({
        allowDiagonal: false,
        test: c => c.value === value,
      });
      cluster.forEach(c => visited.add(keyVal(c)));
      yield cluster;
      // console.log(`Region ${region} has size ${cluster?.length ?? 0}, score ${score}`);
    }
  }
}

async function p2024day12_part1(input: string, ...params: any[]) {
  let totalScore = 0;
  for (const cluster of processClusters(input)) {
    const score = getScore(cluster);
    totalScore += score;
  }
  return totalScore.toString();
}

function getSides(cluster: Cell[]) {
  const isEdge = (cell: Cell, dir: GridPos) => {
    const rightNeighbor = cell.repeatMovements([[dir[1], -dir[0]]]);
    return !rightNeighbor || cell.value !== rightNeighbor.value;
  };

  let count = 0;
  for (const dir of [Dir.N, Dir.E, Dir.S, Dir.W]) {
    const visited = new Set<string>();
    for (const cell of cluster) {
      if (visited.has(keyVal(cell))) continue;
      visited.add(keyVal(cell));
      if (isEdge(cell, dir)) {
        count++;
        let currCell: Cell | undefined = cell;
        while (currCell) {
          const nextCell = cell.repeatMovements([dir]);
          if (nextCell && !visited.has(keyVal(nextCell)) && isEdge(nextCell, dir)) {
            currCell = nextCell;
            visited.add(keyVal(currCell));
          } else {
            currCell = undefined;
          }
        }
      }
    }
  }
  return count;
}

async function p2024day12_part2(input: string, ...params: any[]) {
  let totalScore = 0;
  for (const cluster of processClusters(input)) {
    const score = cluster.length * getSides(cluster);
    totalScore += score;
  }
  return totalScore.toString();
}

async function run() {
  const part1tests: TestCase[] = [
    {
      input: `AAAA
BBCD
BBCC
EEEC`,
      expected: "140",
    },
    {
      input: `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`,
      expected: "772",
    },
    {
      input: `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
      expected: "1930",
    },
  ];
  const part2tests: TestCase[] = [
    {
      input: `AAAA
BBCD
BBCC
EEEC`,
      expected: "80",
    },
    {
      input: `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`,
      expected: "436",
    },
    {
      input: `EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`,
      expected: "236",
    },
    {
      input: `AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`,
      expected: "368",
    },
    {
      input: `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
      expected: "1206",
    },
  ];

  const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

  // Run tests
  test.beginTests();
  await test.section(async () => {
    for (const testCase of p1testsNormalized) {
      test.logTestResult(testCase, String(await p2024day12_part1(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  await test.section(async () => {
    for (const testCase of p2testsNormalized) {
      test.logTestResult(testCase, String(await p2024day12_part2(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  test.endTests();

  // Get input and run program while measuring performance
  const input = await util.getInput(DAY, YEAR);

  const part1Before = performance.now();
  const part1Solution = String(await p2024day12_part1(input));
  const part1After = performance.now();

  const part2Before = performance.now();
  const part2Solution = String(await p2024day12_part2(input));
  const part2After = performance.now();

  logSolution(12, 2024, part1Solution, part2Solution);

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
