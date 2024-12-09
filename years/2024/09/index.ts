import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2024;
const DAY = 9;

// solution path: /Users/todd/projects/advent-of-code/years/2024/09/index.ts
// data path    : /Users/todd/projects/advent-of-code/years/2024/09/data.txt
// problem url  : https://adventofcode.com/2024/day/9

function diskMapToBlocks(input: string) {
  const nums = input.split("").map(Number);
  // get every odd indexed number into own array
  const fileBlocks = nums.filter((_, idx) => idx % 2 === 0);
  const freeBlocks = nums.filter((_, idx) => idx % 2 === 1);
  const diskBlocks = new Array<number>();
  for (let fileIdx = 0; fileIdx < fileBlocks.length; fileIdx++) {
    const currFileBlocks = new Array(fileBlocks[fileIdx]).fill(fileIdx);
    diskBlocks.push(...currFileBlocks);
    if (fileIdx < freeBlocks.length) {
      const currFreeeBlocks = new Array(freeBlocks[fileIdx]).fill(-1);
      diskBlocks.push(...currFreeeBlocks);
    }
  }
  return diskBlocks;
}

function removeEmptySpaceAtEnd(diskBlocks: number[]) {
  let lastIdx = diskBlocks.length - 1;
  while (diskBlocks[lastIdx] === -1) {
    lastIdx--;
  }
  return (diskBlocks.length = lastIdx + 1);
}

function defragDisk(diskBlocks: number[]) {
  removeEmptySpaceAtEnd(diskBlocks);
  while (true) {
    const freeIdx = diskBlocks.indexOf(-1);
    if (freeIdx === -1) {
      break;
    }
    diskBlocks[freeIdx] = diskBlocks[diskBlocks.length - 1];
    diskBlocks.length--;
    removeEmptySpaceAtEnd(diskBlocks);
  }
}

function computeCheckSum(diskBlocks: number[]) {
  let checkSum = 0;
  for (let ii = 0; ii < diskBlocks.length; ii++) {
    checkSum += diskBlocks[ii] * ii;
  }
  return checkSum;
}

async function p2024day9_part1(input: string, ...params: any[]) {
  const blocks = diskMapToBlocks(input);
  defragDisk(blocks);
  const checkSum = computeCheckSum(blocks);
  return checkSum.toString();
}

async function p2024day9_part2(input: string, ...params: any[]) {
  return "Not implemented";
}

async function run() {
  const part1tests: TestCase[] = [
    {
      input: `2333133121414131402`,
      expected: "1928",
    },
  ];
  const part2tests: TestCase[] = [];

  const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

  // Run tests
  test.beginTests();
  await test.section(async () => {
    for (const testCase of p1testsNormalized) {
      test.logTestResult(testCase, String(await p2024day9_part1(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  await test.section(async () => {
    for (const testCase of p2testsNormalized) {
      test.logTestResult(testCase, String(await p2024day9_part2(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  test.endTests();

  // Get input and run program while measuring performance
  const input = await util.getInput(DAY, YEAR);

  const part1Before = performance.now();
  const part1Solution = String(await p2024day9_part1(input));
  const part1After = performance.now();

  const part2Before = performance.now();
  const part2Solution = String(await p2024day9_part2(input));
  const part2After = performance.now();

  logSolution(9, 2024, part1Solution, part2Solution);

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
