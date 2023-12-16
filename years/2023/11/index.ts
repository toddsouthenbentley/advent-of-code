import * as R from "ramda";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { Grid } from "../../../util/grid";

const YEAR = 2023;
const DAY = 11;

// solution path: /Users/todd/macdev/personal/advent-of-code/years/2023/11/index.ts
// data path    : /Users/todd/macdev/personal/advent-of-code/years/2023/11/data.txt
// problem url  : https://adventofcode.com/2023/day/11

const transposeInput = R.pipe(
	R.split("\n"),
	R.map(R.split("")),
	R.transpose,
	R.map(R.join("")),
	R.join("\n"),
);

async function p2023day11_part1(input: string, ...params: any[]) {
	const expandRows = (input: string) => input.replaceAll(/(^[.]+$)/gm, "$1\n$1");
	const expanded = R.pipe(
		expandRows,
		transposeInput,
		expandRows,
		transposeInput,
	);
	const grid = new Grid({serialized: expanded(input)});
	let distance = 0;
	grid.getCells("#").forEach((n1, index, nodes) => {
		nodes.slice(index+1).forEach((n2) => {
			distance += Math.abs(n2.position[1] - n1.position[1]) + Math.abs(n2.position[0] - n1.position[0]);
		});
	});
	return distance.toString();
}

async function p2023day11_part2(input: string, multiplier = 1000000, ...params: any[]) {
	const isEmptyRow = (input: string) => /(^[.]+$)/.test(input);
	const emptyIndices = R.pipe(
		R.split("\n"),
		(rows) => rows.map((row, index) => isEmptyRow(row) ? index : undefined),
		(indices) => R.reject(R.isNil, indices),
	);
	const emptyRows = emptyIndices(input);
	const emptyCols = emptyIndices(transposeInput(input));

	const grid = new Grid({serialized: input});
	let distance = 0;
	const inRange = (rLow: number, rHigh: number, test: number) => {
		return test > Math.min(rLow, rHigh) && test < Math.max(rLow, rHigh);
	}
	grid.getCells("#").forEach((n1, index, nodes) => {
		nodes.slice(index+1).forEach((n2) => {
			const numEmptyRows = emptyRows.filter((rowIdx) => inRange(n1.position[0], n2.position[0], rowIdx)).length;
			const numEmptyCols = emptyCols.filter((colIdx) => inRange(n1.position[1], n2.position[1], colIdx)).length;
			distance += Math.abs(n2.position[1] - n1.position[1]) + Math.abs(n2.position[0] - n1.position[0]);
			distance += (multiplier * numEmptyCols) - numEmptyCols;
			distance += (multiplier * numEmptyRows) - numEmptyRows;
		});
	});
	return distance.toString();
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
		expected: "374"
	}];
	const part2tests: TestCase[] = [{
		input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
		expected: "1030",
		extraArgs: [10],
	}, {
		input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
		expected: "8410",
		extraArgs: [100]
	}];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2023day11_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2023day11_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day11_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day11_part2(input));
	const part2After = performance.now();

	logSolution(11, 2023, part1Solution, part2Solution);

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
