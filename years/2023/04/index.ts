import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import * as R from "ramda";

const YEAR = 2023;
const DAY = 4;

// solution path: /Users/todd/macdev/personal/advent-of-code/years/2023/04/index.ts
// data path    : /Users/todd/macdev/personal/advent-of-code/years/2023/04/data.txt
// problem url  : https://adventofcode.com/2023/day/4

type Card = {
	matches: number;
	count: number;
};

function parseCard(input: string): Card {
	const splits = input.split(/[|:]/);
	const [_card, winners, nums] = splits;
	const winningNumbers = winners.trim().split(/ +/).map(Number);
	const numbers = nums.trim().split(/ +/).map(Number);
	const matches = R.length(R.intersection(winningNumbers, numbers));
	return { matches, count: 1};
}


async function p2023day4_part1(input: string, ...params: any[]) {
	const score = (card: Card) => card.matches > 0 ? Math.pow(2, card.matches - 1) : 0;
	const sum = R.pipe(
		R.split("\n"),
		R.map((line) => parseCard(line)),
		R.map((card) => score(card)),
		R.sum,
	)(input);
	return sum.toString();
}

async function p2023day4_part2(input: string, ...params: any[]) {
	const sum = R.pipe(
		R.split("\n"),
		R.map((line) => parseCard(line)),
		(cards) => {
			cards.forEach((card, index) => {
				if (card.matches > 0)
					cards.slice(index + 1, index + 1 + card.matches).forEach((c) => c.count += card.count);
			});
			return cards;
		},
		R.map(R.prop("count")),
		R.sum,
	)(input);
	return sum.toString();
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
		expected: "13",
	}];
	const part2tests: TestCase[] = [{
		input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
		expected: "30",
	}];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2023day4_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2023day4_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day4_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day4_part2(input));
	const part2After = performance.now();

	logSolution(4, 2023, part1Solution, part2Solution);

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
