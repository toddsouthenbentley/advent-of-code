import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2024;
const DAY = 11;

// solution path: /Users/todd/projects/advent-of-code/years/2024/11/index.ts
// data path    : /Users/todd/projects/advent-of-code/years/2024/11/data.txt
// problem url  : https://adventofcode.com/2024/day/11

function numDigits(n: number) {
  return 1 + Math.floor(Math.log10(Math.abs(n)));
}

function processStone(stone: number) {
  if (stone === 0) return 1;
  const digits = numDigits(stone);
  if (digits % 2 === 0) {
    const divisor = Math.pow(10, digits / 2);
    const result = [Math.floor(stone / divisor), stone % divisor];
    return result;
  }
  return stone * 2024;
}

function processStones(stones: number[]) {
  stones.forEach((stone, idx) => {
    const result = processStone(stone);
    if (Array.isArray(result)) {
      stones[idx] = result[0];
      stones.push(result[1]);
    } else {
      stones[idx] = result;
    }
  });
}

async function p2024day11_part1(input: string, ...params: any[]) {
  const count = (params[0] as number) ?? 25;
  const stones = input.split(" ").map(Number);
  for (let i = 0; i < count; i++) {
    processStones(stones);
  }
  return stones.length.toString();
}

async function p2024day11_part2(input: string, ...params: any[]) {
  const mapSize = (map: Map<number, number>) => {
    let sum = 0;
    for (const val of map.values()) sum += val;
    return sum;
  };
  const iterations = (params[0] as number) ?? 75;
  let counts = new Map<number, number>(input.split(" ").map(n => [Number(n), 1]));
  for (let i = 0; i < iterations; i++) {
    const newCounts = new Map<number, number>();
    counts.forEach((count, stone) => {
      const result = processStone(stone);
      if (Array.isArray(result)) {
        newCounts.set(result[0], count + (newCounts.get(result[0]) ?? 0));
        newCounts.set(result[1], count + (newCounts.get(result[1]) ?? 0));
      } else {
        newCounts.set(result, count + (newCounts.get(result) ?? 0));
      }
    });
    counts = newCounts;
    let sum = 0;
    for (const val of counts.values()) sum += val;
    console.log(i, counts.size, mapSize(counts));
  }
  return mapSize(counts).toString();
}

async function run() {
  const part1tests: TestCase[] = [
    {
      input: `125 17`,
      extraArgs: [6],
      expected: "22",
    },
    {
      input: `125 17`,
      expected: "55312",
    },
  ];
  const part2tests: TestCase[] = [
    {
      input: `125 17`,
      extraArgs: [6],
      expected: "22",
    },
  ];

  const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

  // Run tests
  test.beginTests();
  await test.section(async () => {
    for (const testCase of p1testsNormalized) {
      test.logTestResult(testCase, String(await p2024day11_part1(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  await test.section(async () => {
    for (const testCase of p2testsNormalized) {
      test.logTestResult(testCase, String(await p2024day11_part2(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  test.endTests();

  // Get input and run program while measuring performance
  const input = await util.getInput(DAY, YEAR);

  const part1Before = performance.now();
  const part1Solution = String(await p2024day11_part1(input));
  const part1After = performance.now();

  const part2Before = performance.now();
  const part2Solution = String(await p2024day11_part2(input));
  const part2After = performance.now();

  logSolution(11, 2024, part1Solution, part2Solution);

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
