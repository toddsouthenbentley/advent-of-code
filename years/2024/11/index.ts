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

function evenNumDigits(n: number) {
	return numDigits(n) % 2 === 0;
}

function splitStones(stones: number[]) {
	const originalLength = stones.length;
	let nSplits = 0;
	let nMults = 0;
	stones.toReversed().forEach((stone, rIndex) => {
		const lIndex = originalLength - rIndex - 1;
		if (stone === 0) {
			stones[lIndex] = 1;
		} else if (evenNumDigits(stone)) {
			const strVal = stone.toString();
			const half = strVal.length / 2;
			const left = Number(strVal.substring(0, half));
			const right = Number(strVal.substring(half));
			stones[lIndex] = left;
			stones.push(right);
			nSplits++;
		} else {
			stones[lIndex] = stone * 2024;
			nMults++;
		}
	});
	return { nSplits, nMults };
}

function splitStones2(stones: string[]) {
	const originalLength = stones.length;
	let nSplits = 0;
	let nMults = 0;
	stones.toReversed().forEach((stone, rIndex) => {
		const lIndex = originalLength - rIndex - 1;
		if (stone === "0") {
			stones[lIndex] = "1";
		} else if (stone.length % 2 === 0) {
			const strVal = stone.toString();
			const half = strVal.length / 2;
			const left = strVal.substring(0, half);
			// let right = strVal.substring(half);
			// while (right.startsWith("0")) right = right.substring(1);
			const right = Number(strVal.substring(half)).toString();
			stones[lIndex] = left;
			stones.push(right);
			nSplits++;
		} else {
			stones[lIndex] = (Number(stone) * 2024).toString();
			nMults++;
		}
	});
	return { nSplits, nMults };
}

async function p2024day11_part1(input: string, ...params: any[]) {
	const count = params[0] as number ?? 25;
	const stones = input.split(" ").map(Number);
	for (let i = 0; i < count; i++) {
		splitStones(stones);
	}
	return stones.length.toString();
}

async function p2024day11_part2(input: string, ...params: any[]) {
	// return "Not implemented";
	const count = params[0] as number ?? 75;
	const stones = input.split(" ").map(Number);
	stones.length = 1;
	for (let i = 0; i < count; i++) {
		const { nSplits, nMults } = splitStones(stones);
		console.log(i, stones.length, nSplits, nMults);
	}
	return stones.length.toString();
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `125 17`,
			extraArgs: [6],
			expected: "22"
		},
		{
			input: `125 17`,
			expected: "55312"
		}
	];
	const part2tests: TestCase[] = [];

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

	const part2Before = performance.now()
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
