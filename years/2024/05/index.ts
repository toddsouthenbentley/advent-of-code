import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { or } from "ramda";

const YEAR = 2024;
const DAY = 5;

// solution path: /Users/todd/projects/advent-of-code/years/2024/05/index.ts
// data path    : /Users/todd/projects/advent-of-code/years/2024/05/data.txt
// problem url  : https://adventofcode.com/2024/day/5

function loadData(input: string) {
	const [pageOrdering, pages] = input.split("\n\n");
	const orderingMap = pageOrdering.split("\n").reduce((acc, line) => {
		const [key, value] = line.split("|").map(Number);
		let values = acc.get(key);
		if (!values) {
			values = [];
			acc.set(key, values);
		}
		values.push(value);
		return acc;
	}, new Map<number, Array<number>>());

	const pageLists = pages.split("\n").map(line => line.split(",").map(Number));
	return { orderingMap, pageLists };
}

function isCorrectlyOrdered(pageList: number[], orderingMap: Map<number, number[]>) {
	return pageList.every((page, index) => {
		if (index === pageList.length - 1) return true;
		const currBeforeList = orderingMap.get(page);
		const nextPages = pageList.slice(index + 1);
		return nextPages.every(nextPage => currBeforeList?.includes(nextPage));
	});
}

async function p2024day5_part1(input: string, ...params: any[]) {
	const { orderingMap, pageLists } = loadData(input);
	let count = 0;
	pageLists.forEach(pageList => {
		if (isCorrectlyOrdered(pageList, orderingMap)) {
			count += pageList[Math.floor(pageList.length / 2)];
		}
	});
	return count.toString();
}

async function p2024day5_part2(input: string, ...params: any[]) {
	const { orderingMap, pageLists } = loadData(input);
	let count = 0;
	pageLists.forEach(pageList => {
		if (!isCorrectlyOrdered(pageList, orderingMap)) {
			pageList.sort((a, b) => {
				const aBefore = orderingMap.get(a) || [];
				const bBefore = orderingMap.get(b) || [];
				if (aBefore.includes(b)) return -1;
				if (bBefore.includes(a)) return 1;
				return 0;
			});
			count += pageList[Math.floor(pageList.length / 2)];
		}
	});
	return count.toString();
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
			expected: "143",
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
			expected: "123",
		},
	];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2024day5_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2024day5_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2024day5_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2024day5_part2(input));
	const part2After = performance.now();

	logSolution(5, 2024, part1Solution, part2Solution);

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
