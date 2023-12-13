import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import * as R from "ramda";

const YEAR = 2023;
const DAY = 7;

// solution path: /Users/todd/macdev/personal/advent-of-code/years/2023/07/index.ts
// data path    : /Users/todd/macdev/personal/advent-of-code/years/2023/07/data.txt
// problem url  : https://adventofcode.com/2023/day/7

enum HandType {
	FiveOfAKind = 6,
	FourOfAKind = 5,
	FullHouse = 4,
	ThreeOfAKind = 3,
	TwoPair = 2,
	OnePair = 1,
	HighCard = 0,
}

function getHandRank(hand: string): HandType {
	const counts = R.sort((a, b) => b - a, R.values(R.countBy(R.toUpper, hand.split(""))));
	switch (counts.length) {
		case 1:
			return HandType.FiveOfAKind;
		case 2:
			// full house or 4 of a kind
			if (counts[0] === 4)
				return HandType.FourOfAKind;
			else
				return HandType.FullHouse;
		case 3:
			// two pair or three of a kind
			if (counts[0] === 3)
				return HandType.ThreeOfAKind;
			else
				return HandType.TwoPair;
		case 4:
			return HandType.OnePair;
		case 5:
			return HandType.HighCard;

	}
	return HandType.HighCard;
}

function getCardValues(hand: string) {
	const vals = R.pipe(
		R.split(""),
		R.map(R.compose(
			R.replace(/A/g, "14"),
			R.replace(/K/g, "13"),
			R.replace(/Q/g, "12"),
			R.replace(/J/g, "11"),
			R.replace(/T/g, "10"))
		),
		R.map(Number)
	)(hand);
	return vals;
}

function compareHands(h1: string, h2: string) {
	const s1 = getHandRank(h1);
	const s2 = getHandRank(h2);
	if (s1 !== s2) return s1 - s2;
	const diffs = R.pipe(
		R.map(getCardValues),
		R.transpose,
		R.map((pairs: number[]) => pairs[0] - pairs[1]),
		R.dropWhile(R.equals(0)),
	)([h1, h2]);
	return diffs.length ? diffs[0]: 0;
}

async function p2023day7_part1(input: string, ...params: any[]) {
	return "Not implemented";
}

async function p2023day7_part2(input: string, ...params: any[]) {
	return "Not implemented";
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
		expected: "6440"
	}];
	const part2tests: TestCase[] = [];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2023day7_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2023day7_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day7_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day7_part2(input));
	const part2After = performance.now();

	logSolution(7, 2023, part1Solution, part2Solution);

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
