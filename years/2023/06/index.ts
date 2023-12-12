import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import * as R from "ramda";

const YEAR = 2023;
const DAY = 6;

// solution path: /Users/todd/macdev/personal/advent-of-code/years/2023/06/index.ts
// data path    : /Users/todd/macdev/personal/advent-of-code/years/2023/06/data.txt
// problem url  : https://adventofcode.com/2023/day/6

const getRaceWins = ([raceTime, raceDistance]: number[]) => {
	let wins = 0;
	for (let val = 1; val < raceTime; val++) {
		const distance = (raceTime - val) * val;
		if (distance > raceDistance)
			wins++;
	}
	return wins;
}

async function p2023day6_part1(input: string, ...params: any[]) {
	const result = R.pipe(
		R.split("\n"),
		R.map(R.pipe(
			R.split(/ +/),
			R.drop(1),
			R.map(Number)
		)),
		R.transpose,
		R.map(getRaceWins),
		R.product,
	)(input);
	return result.toString();
}

async function p2023day6_part2(input: string, ...params: any[]) {
	const result = R.pipe(
		R.split("\n"),
		R.map(R.pipe(
			R.replace(/ /g, ""),
			R.split(/:/),
			R.drop(1),
			R.map(Number),
		)),
		R.transpose,
		R.map(getRaceWins),
		R.sum,
	)(input);
	return result.toString();
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `Time:      7  15   30
Distance:  9  40  200`,
		expected: "288"
	}];
	const part2tests: TestCase[] = [{
		input: `Time:      7  15   30
Distance:  9  40  200`,
		expected: "71503"
	}];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2023day6_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2023day6_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day6_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day6_part2(input));
	const part2After = performance.now();

	logSolution(6, 2023, part1Solution, part2Solution);

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
