import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import * as R from "ramda";

const YEAR = 2023;
const DAY = 9;

// solution path: /Users/todd/macdev/personal/advent-of-code/years/2023/09/index.ts
// data path    : /Users/todd/macdev/personal/advent-of-code/years/2023/09/data.txt
// problem url  : https://adventofcode.com/2023/day/9

const getNextRow = (nums: number[]) => {
	const stack = R.clone(nums);
	let previous = stack.shift();
	const newNums = new Array<number>();
	while (previous !== undefined && stack.length) {
		const curr = stack.shift();
		if (curr !== undefined) {
			newNums.push(curr - previous);
			previous = curr;
		}
	}
	return newNums;
};

const getRows = (nums: number[]) => {
	const rows = new Array<Array<number>>();
	rows.push(nums);
	let nextRow: Array<number> | undefined;
	do {
		nextRow = getNextRow(nextRow ?? nums);
		rows.unshift(nextRow);
	} while (nextRow.length && !nextRow.every((n) => n === nextRow![0]))
	return rows;
}

const parseInput = R.pipe(
	R.split("\n"),
	R.map(R.split(" ")),
	R.map(R.map(Number)),
);

async function p2023day9_part1(input: string, ...params: any[]) {
	const calcNextNumber = (nums: number[]) => {
		return getRows(nums).reduce((acc, r) => acc + r[r.length - 1], 0);
	};

	const result = R.pipe(
		parseInput,
		R.map(calcNextNumber),
		R.sum,
	)(input);
	return result.toString();
}

async function p2023day9_part2(input: string, ...params: any[]) {
	const calcFirstNumber = (nums: number[]) => {
		return getRows(nums).reduce((acc, r, _idx, _rows) => -acc + r[0], 0);
	};

	const result = R.pipe(
		parseInput,
		R.map(calcFirstNumber),
		R.sum,
	)(input);
	return result.toString();
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
		expected: "114"
	},
	];
	const part2tests: TestCase[] = [{
		input: `10 13 16 21 30 45
0 3 6 9 12 15
1 3 6 10 15 21`,
		expected: "2"
	},];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2023day9_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2023day9_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day9_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day9_part2(input));
	const part2After = performance.now();

	logSolution(9, 2023, part1Solution, part2Solution);

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
