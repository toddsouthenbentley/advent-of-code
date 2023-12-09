import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { __, both, defaultTo, find, findLast, gte, join, juxt, lte, map, pipe, reverse, split, sum } from "ramda";

const YEAR = 2023;
const DAY = 1;

// solution path: /Users/todd/macdev/personal/advent-of-code/years/2023/01/index.ts
// data path    : /Users/todd/macdev/personal/advent-of-code/years/2023/01/data.txt
// problem url  : https://adventofcode.com/2023/day/1

async function p2023day1_part1Orig(input: string, ...params: any[]) {
	const isNumber = (ch: string) => ch >= "1" && ch <= "9";

	function lineVal(line: string) {
		const first = [...line].find((c => isNumber(c))) ?? "";
		const last = [...line].findLast((c) => isNumber(c)) ?? "";
		return Number(`${first}${last}`);
	}
	var sum = 0;
	input.split("\n").forEach((line => sum += lineVal(line)))
	return sum.toString();
}

async function p2023day1_part1(input: string, ...params: any[]) {
	const isNumber = both(lte("1"), gte("9"));
	const lineVal = pipe(split(""), juxt([defaultTo("", find(isNumber)), defaultTo("", findLast(isNumber))]), join(""), Number);
	return pipe(split("\n"), map(lineVal), sum)(input).toString();
}

async function p2023day1_part2(input: string, ...params: any[]) {
	const replacements = new Map<string, string>([
		["one", "1"],
		["two", "2"],
		["three", "3"],
		["four", "4"],
		["five", "5"],
		["six", "6"],
		["seven", "7"],
		["eight", "8"],
		["nine", "9"],
	]);

	// const reverse = (line: string) => [...line].reverse().join("");

	const getRegExp = (reversed = false) => {
		let re = "(\\d)";
		[...replacements.keys()].forEach((k) => re += `|(${reversed ? reverse(k): k})`);
		return re;
	}

	const firstRegExp = new RegExp(getRegExp());
	const lastRegExp = new RegExp(getRegExp(true));

	function lineVal(line: string) {
		const first = firstDigit(line);
		const last = lastDigit(line);
		return (first && last) ? Number(`${first}${last}`) : 0;
	}

	function firstDigit(line: string) {
		const first = firstRegExp.exec(line)?.[0];
		return (first && first.length > 1) ? replacements.get(first) : first;
	}

	function lastDigit(line: string) {
		const last = lastRegExp.exec(reverse(line))?.[0];
		return (last && last.length > 1) ? replacements.get(reverse(last)) : last;
	}

	var sum = 0;
	input.split("\n").forEach((line => sum += lineVal(line)))
	return sum.toString();
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
		expected: "142"
	}];
	const part2tests: TestCase[] = [{
		input: `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`,
		expected: "281"
	}];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2023day1_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2023day1_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day1_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day1_part2(input));
	const part2After = performance.now();

	logSolution(1, 2023, part1Solution, part2Solution);

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
