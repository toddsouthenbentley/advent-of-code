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

class DiskFile {
  public id = 0;
  public blocks = 0;
  public processed = false;

  constructor(id: number, blocks: number) {
    this.id = id;
    this.blocks = blocks;
  }
}

class EmptySpace extends DiskFile {
  constructor(blocks: number) {
    super(-1, blocks);
  }
}

function diskMapToBlocks(input: string) {
  const nums = input.split("").map(Number);
  const diskBlocks = new Array<DiskFile>();
  for (let ii = 0; ii < nums.length; ii += 2) {
    diskBlocks.push(new DiskFile(ii / 2, nums[ii]));
    if (ii + 1 < nums.length && nums[ii + 1]) {
      diskBlocks.push(new EmptySpace(nums[ii + 1]));
    }
  }
  return diskBlocks;
}

function computeChecksum(diskBlocks: DiskFile[]) {
  let checkSum = 0;
  let blockIdx = 0;
  for (const diskBlock of diskBlocks) {
    for (let ii = 0; ii < diskBlock.blocks; ii++) {
      if (diskBlock.id > 0) {
        checkSum += diskBlock.id * (blockIdx + ii);
      }
    }
    blockIdx += diskBlock.blocks;
  }
  return checkSum;
}

function defragDisk1(diskBlocks: DiskFile[]) {
  while (true) {
    const emptySpaceIdx = diskBlocks.findIndex(f => f.id === -1);
    if (emptySpaceIdx === -1) break;
    const emptySpace = diskBlocks[emptySpaceIdx];
    const candidateIdx = diskBlocks.findLastIndex(f => f.id > -1);
    if (candidateIdx === -1 || candidateIdx < emptySpaceIdx) break;
    const candidate = diskBlocks[candidateIdx];
    if (candidate.blocks > emptySpace.blocks) {
      emptySpace.id = candidate.id;
      candidate.blocks -= emptySpace.blocks;
    } else if (candidate.blocks < emptySpace.blocks) {
      emptySpace.blocks -= candidate.blocks;
      diskBlocks.splice(candidateIdx, 1);
      diskBlocks.splice(emptySpaceIdx, 0, candidate);
    } else {
      emptySpace.id = candidate.id;
      diskBlocks.splice(candidateIdx, 1);
    }
  }
}

async function p2024day9_part1(input: string, ...params: any[]) {
  const blocks = diskMapToBlocks(input);
  defragDisk1(blocks);
  const checkSum = computeChecksum(blocks);
  return checkSum.toString();
}

function defragDisk2(diskBlocks: DiskFile[]) {
  while (true) {
    const candidateIdx = diskBlocks.findLastIndex(f => !f.processed && f.id > -1);
    if (candidateIdx === -1) break;
    const candidate = diskBlocks[candidateIdx];
    candidate.processed = true;
    const emptySpaceIdx = diskBlocks.findIndex(f => f.id === -1 && f.blocks >= candidate.blocks);
    if (emptySpaceIdx === -1 || emptySpaceIdx >= candidateIdx) continue;
    const emptySpace = diskBlocks[emptySpaceIdx];
    emptySpace.blocks -= candidate.blocks;
    diskBlocks.splice(candidateIdx, 1, new EmptySpace(candidate.blocks));
    diskBlocks.splice(emptySpaceIdx, emptySpace.blocks ? 0 : 1, candidate);
  }
}

async function p2024day9_part2(input: string, ...params: any[]) {
  const blocks = diskMapToBlocks(input);
  defragDisk2(blocks);
  const checkSum = computeChecksum(blocks);
  return checkSum.toString();
}

async function run() {
  const part1tests: TestCase[] = [
    {
      input: `2333133121414131402`,
      expected: "1928",
    },
  ];
  const part2tests: TestCase[] = [
    {
      input: `2333133121414131402`,
      expected: "2858",
    },
  ];

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
