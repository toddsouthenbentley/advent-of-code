import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import * as R from "ramda";
import { Cell, Grid, serializeCellArray } from "../../../util/grid";

const YEAR = 2023;
const DAY = 3;

// solution path: /Users/todd/macdev/personal/advent-of-code/years/2023/03/index.ts
// data path    : /Users/todd/macdev/personal/advent-of-code/years/2023/03/data.txt
// problem url  : https://adventofcode.com/2023/day/3

async function p2023day3_part1(input: string, ...params: any[]) {
	const hasSymbol = (s: string) => s.replaceAll(/[0-9.]/g, "").length > 0;
	const portion = (start: number, length: number, s: string | undefined) => R.defaultTo("", R.take(length, R.drop(start, s ?? "")));
	const substring = (start: number, end: number, s: string | undefined) => R.defaultTo("", R.take(end - start, R.drop(start, s ?? "")));
	const hasAdjacentSymbol = (row: number, m: RegExpMatchArray, grid: string[]) => {
		const testAbove = substring(Math.max(m.index! - 1, 0), m.index! + m[0].length + 1, grid[row-1]);
		const testBelow = substring(Math.max(m.index! - 1, 0), m.index! + m[0].length + 1, grid[row+1]);
		const testLeft = m.index! > 0 ? portion(Math.max(m.index! - 1), 1, grid[row]) : "";
		const testRight = portion(m.index! + m[0].length, 1, grid[row]);
		return R.any(hasSymbol, [testAbove, testBelow, testLeft, testRight]);
	}
	const grid = R.split("\n", input);
	var sum = 0;
	for (var row = 0; row < grid.length; row++) {
		const matches = Array.from(grid[row].matchAll(/\d+/g));
		matches.forEach((m) => {
			if (hasAdjacentSymbol(row, m, grid)) {
				sum += Number(m[0]);
			}
		});
	}
	return sum.toString();
}

const isDigit = (s: string) => /\d/.test(s);

async function p2023day3_part2(input: string, ...params: any[]) {
	const sum2 = R.pipe(
		(serialized: string) => (new Grid({ serialized })).getCells("*"),
		R.map((cell) => {
			const product = R.pipe(
				(star: Cell) => {
					const clusterMap = new Map<string, Cell[]>();
					star.neighbors(true).forEach((neighbor) => {
						if (isDigit(neighbor.value)) {
							const cluster = neighbor.findCellCluster({
								allowDiagonal: false, allowVertical: false, allowHorizontal: true,
								test: (t) => isDigit(t.value),
							});
							if (cluster.length > 0) {
								clusterMap.set(serializeCellArray(cluster), cluster);
							}
						}
					});
					return clusterMap.size === 2 ? [...clusterMap.values()] : [];
				},
				(clusters) => clusters.length === 2 ? R.map(R.pipe(R.pluck("value"), R.join(""), Number), clusters) : [0],
				R.product,
			)(cell);
			return product;
		}),
		R.sum,
	)(input);
	return sum2.toString();
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
		expected: "4361"
	}];
	const part2tests: TestCase[] = [{
		input: `.467.114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
		expected: "467835"
	}];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2023day3_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2023day3_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();
	// log ("Early exit");
	// process.exit();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day3_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day3_part2(input));
	const part2After = performance.now();

	logSolution(3, 2023, part1Solution, part2Solution);

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
