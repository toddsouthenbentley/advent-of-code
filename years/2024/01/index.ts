import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2024;
const DAY = 1;

// solution path: /Users/todd/projects/advent-of-code/years/2024/01/index.ts
// data path    : /Users/todd/projects/advent-of-code/years/2024/01/data.txt
// problem url  : https://adventofcode.com/2024/day/1

function loadData(input: string) {
  const data = input.split("\n").map(line => line.split(/\s+/).map(Number));
  const l1 = data.map(line => line[0]);
  const l2 = data.map(line => line[1]);
  return { l1, l2 };
}

async function p2024day1_part1(input: string, ...params: any[]) {
  const { l1, l2 } = loadData(input);
  l1.sort();
  l2.sort();
  let sum = 0;
  l1.forEach((v1, i) => {
    sum += Math.abs(v1 - l2[i]);
  });
  return sum.toString();
}

async function p2024day1_part2(input: string, ...params: any[]) {
  const { l1, l2 } = loadData(input);
  let sum = 0;
  l1.forEach(val => {
    const occ = l2.filter(v => v === val).length;
    sum += val * occ;
  });
  return sum.toString();
}

async function run() {
  const part1tests: TestCase[] = [
    {
      input: `3   4
4   3
2   5
1   3
3   9
3   3`,
      expected: "11",
    },
  ];
  const part2tests: TestCase[] = [
    {
      input: `3   4
4   3
2   5
1   3
3   9
3   3`,
      expected: "31",
    },
  ];

  const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

  // Run tests
  test.beginTests();
  await test.section(async () => {
    for (const testCase of p1testsNormalized) {
      test.logTestResult(testCase, String(await p2024day1_part1(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  await test.section(async () => {
    for (const testCase of p2testsNormalized) {
      test.logTestResult(testCase, String(await p2024day1_part2(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  test.endTests();

  // Get input and run program while measuring performance
  const input = await util.getInput(DAY, YEAR);

  const part1Before = performance.now();
  const part1Solution = String(await p2024day1_part1(input));
  const part1After = performance.now();

  const part2Before = performance.now();
  const part2Solution = String(await p2024day1_part2(input));
  const part2After = performance.now();

  logSolution(1, 2024, part1Solution, part2Solution);

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
