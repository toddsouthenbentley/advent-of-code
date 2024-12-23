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

function compareHands(h1: string, h2: string, jokers = false) {
	function getHandRank(hand: string): HandType {
		const handToCheck = jokers ? replaceJokers(hand) : hand;
		const letterCounts = R.countBy(R.toUpper, handToCheck.split(""));
		const counts = R.sort((a, b) => b - a, R.values(letterCounts));
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
				R.replace(/J/g, jokers ? "1": "11"),
				R.replace(/T/g, "10"))
			),
			R.map(Number)
		)(hand);
		return vals;
	}

	const hDiff = getHandRank(h1) - getHandRank(h2);
	if (hDiff !== 0)
		return hDiff;

	const diffs = R.pipe(
		R.map(getCardValues),
		R.transpose,
		R.map((pairs: number[]) => pairs[0] - pairs[1]),
		R.dropWhile(R.equals(0)),
	)([h1, h2]);
	return diffs.length ? diffs[0]: 0;
}

function computeResult(input: string, jokers = false) {
	const result = R.pipe(
		R.split("\n"),
		R.map(R.split(" ")),
		R.sort((r1, r2) => compareHands(r1[0], r2[0], jokers)),
		R.pluck(1),
		R.map(Number),
		(bids) => bids.map((bid, index) => bid * (index + 1)),
		R.sum,
	)(input);
	return result.toString();
}

function replaceJokers(hand: string) {
	// find the card with the highest count and replace with J's with it
	const countsByCard = R.countBy(R.toUpper, hand.split(""));
	if (!countsByCard["J"])
		return hand;
	const highestCount = R.pipe(
		R.toPairs,
		R.sort(([_card1, count1]: [string, number], [_card2, count2]: [string, number]) => {
			return count1 - count2;
		}),
		R.takeLast(1),
		R.flatten,
	)(R.omit(["J"], countsByCard));
	const newHand = hand.replaceAll("J", highestCount[0] as string ?? "A");
	return newHand;
}

async function p2023day7_part1(input: string, ...params: any[]) {
	return computeResult(input);
}

async function p2023day7_part2(input: string, ...params: any[]) {
	return computeResult(input, true);
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
	const part2tests: TestCase[] = [{
		input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
		expected: "5905"
	}];

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
