import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2024;
const DAY = 2;

// solution path: /Users/todd/projects/advent-of-code/years/2024/02/index.ts
// data path    : /Users/todd/projects/advent-of-code/years/2024/02/data.txt
// problem url  : https://adventofcode.com/2024/day/2

function loadData(input: string) {
  const data = input.split("\n").map((line) => line.split(/\s+/).map(Number));
  return data;
}

function isSafe(line: number[]) {
  const diff = line[1] - line[0];
  if (diff === 0 || Math.abs(diff) > 3) return false;
  const decreasing = diff < 0;

  const isSafe = line.slice(1).every((val, i) => {
    const diff = val - line[i];
    const currDecreasing = diff < 0;
    return currDecreasing === decreasing && Math.abs(diff) > 0 && Math.abs(diff) <= 3;
  });
  return isSafe;
}

async function p2024day2_part1(input: string, ...params: any[]) {
  const data = loadData(input);
  const numSafe = data.reduce((acc, line) => acc + (isSafe(line) ? 1 : 0), 0);
  return numSafe.toString();
}

async function p2024day2_part2(input: string, ...params: any[]) {
  const data = loadData(input);
  const numSafe = data.reduce((acc, line) => {
    if (isSafe(line)) return acc + 1;
    // remove one element at a time and see if it's safe
    for (let i = 0; i < line.length; i++) {
      if (isSafe([...line.slice(0, i), ...line.slice(i + 1)])) {
        return acc + 1;
      }
    }
    return acc;
  }, 0);
  return numSafe.toString();
}

async function run() {
	const part1tests: TestCase[] = [{
    input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
    expected: "2"
	}];
	const part2tests: TestCase[] = [{
    input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
    expected: "4"
	}];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2024day2_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2024day2_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2024day2_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2024day2_part2(input));
	const part2After = performance.now();

	logSolution(2, 2024, part1Solution, part2Solution);

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
