import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import * as R from "ramda";
import { assert } from "console";

const YEAR = 2023;
const DAY = 5;

// solution path: /Users/todd/macdev/personal/advent-of-code/years/2023/05/index.ts
// data path    : /Users/todd/macdev/personal/advent-of-code/years/2023/05/data.txt
// problem url  : https://adventofcode.com/2023/day/5

type RangeMap = {
	fromName: string;
	toName: string;
	ranges: number[][];
}

type InputData = {
	seeds: number[];
	maps: RangeMap[];
}

function parseRangeMap(input: string) {
	const [nameLine, mapLines] = input.split(" map:\n");
	const [fromName, _to, toName] = nameLine.split("-");
	const ranges = R.pipe(
		R.split("\n"),
		R.map(R.pipe(R.split(" "), R.map(Number))),
	)(mapLines);
	return { fromName, toName, ranges};
}

function parseInput(input: string): InputData {
	return R.pipe(
		R.split("\n\n"),
		(sections) => {
			const [_seeds, seedNums] = sections.shift()!.split(": ");
			const seeds = seedNums.split(" ").map(Number);
			const maps = sections.map((section) => parseRangeMap(section));
			return { seeds, maps };
		}
	)(input);
}

function getMappedValue(val: number, rangeMap: RangeMap, reverse = false) {
	const checkIdx = reverse ? 0 : 1;
	const mapIdx = reverse ? 1 : 0;
	const range = rangeMap.ranges.find((r) => {
		return val >= r[checkIdx] && val < (r[checkIdx] + r[2]);
	});
	return range ? range[mapIdx] + (val - range[checkIdx]) : val;
}

async function p2023day5_part1(input: string, ...params: any[]) {
	const data = parseInput(input);
	const mappedVals = data.seeds.map((val) => data.maps.reduce((acc, rangeMap) => getMappedValue(acc, rangeMap), val));
	const minVal = Math.min(...mappedVals);
	return minVal.toString();
}

async function p2023day5_part2(input: string, ...params: any[]) {
	const data = parseInput(input);
	const seeds = R.splitEvery(2, data.seeds);
	const lastMap = data.maps[data.maps.length-1];
	lastMap.ranges.sort((a, b) => a[1] - b[1]);
	data.maps.reverse();

	// what is the theoretical max? Could be anything, couldn't it?
	const min = 1;
	const max = seeds.reduce((acc, [start, count]) => Math.max(start + count, acc), 0);

	for (let val = min; val < max; val++) {
		const seedVal = data.maps.reduce((acc, rangeMap) => getMappedValue(acc, rangeMap, true), val);
		const found = seeds.find(([start, count]) => seedVal >= start && seedVal < (start + count))
		if (found) {
			return val.toString();
		}
	}
	return "Not found";
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
		expected: "35"
	}];
	const part2tests: TestCase[] = [{
		input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
		expected: "46"
	}];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2023day5_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2023day5_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day5_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day5_part2(input));
	const part2After = performance.now();

	logSolution(5, 2023, part1Solution, part2Solution);

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
