import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2024;
const DAY = 13;

// solution path: /Users/todd/projects/advent-of-code/years/2024/13/index.ts
// data path    : /Users/todd/projects/advent-of-code/years/2024/13/data.txt
// problem url  : https://adventofcode.com/2024/day/13

function solve(curr: number[], offset = 0) {
  let [ax, ay, bx, by, px, py] = curr;
  px += offset;
  py += offset;
  const b = (py * ax - px * ay) / (ax * by - ay * bx);
  const a = (px - bx * b) / ax;
  if (offset === 0 && (a > 100 || b > 100)) return 0;
  if (a % 1 !== 0 || b % 1 !== 0) return 0;
  return a * 3 + b;
}

function parseMachines(input: string) {
  return input.split("\n\n").map(g => g.match(/([0-9])+/g)!.map(Number));
}

async function p2024day13_part1(input: string, ...params: any[]) {
  const total = parseMachines(input).reduce((acc, curr) => acc + solve(curr), 0);
  return total.toString();
}

async function p2024day13_part2(input: string, ...params: any[]) {
  const total = parseMachines(input).reduce((acc, curr) => acc + solve(curr, 10000000000000), 0);
  return total.toString();
}

/*
Part 1:  39748
Part 2:  74478585072604
*/

async function run() {
  const part1tests: TestCase[] = [
    {
      input: `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400`,
      expected: "280",
    },
    {
      input: `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
      expected: "480",
    },
  ];
  const part2tests: TestCase[] = [
    {
      input: `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
      expected: "875318608908",
    },
  ];

  const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

  // Run tests
  test.beginTests();
  await test.section(async () => {
    for (const testCase of p1testsNormalized) {
      test.logTestResult(testCase, String(await p2024day13_part1(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  await test.section(async () => {
    for (const testCase of p2testsNormalized) {
      test.logTestResult(testCase, String(await p2024day13_part2(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  test.endTests();

  // Get input and run program while measuring performance
  const input = await util.getInput(DAY, YEAR);

  const part1Before = performance.now();
  const part1Solution = String(await p2024day13_part1(input));
  const part1After = performance.now();

  const part2Before = performance.now();
  const part2Solution = String(await p2024day13_part2(input));
  const part2After = performance.now();

  logSolution(13, 2024, part1Solution, part2Solution);

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
