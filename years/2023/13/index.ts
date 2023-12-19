import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import * as R from "ramda";

const YEAR = 2023;
const DAY = 13;

// solution path: /Users/todd/macdev/personal/advent-of-code/years/2023/13/index.ts
// data path    : /Users/todd/macdev/personal/advent-of-code/years/2023/13/data.txt
// problem url  : https://adventofcode.com/2023/day/13

function hasMirroredRows(rows: string[], maxDiffs = 0) {
	const diffStrings = (s1: string, s2: string) => s1.split("").filter((c, i) => c !== s2[i]).length;
	const midIdx = Math.floor(R.length(rows) / 2);
	const groups = R.splitAt(midIdx, rows);
	let diffs = 0;
	for (const [idx, row] of R.reverse(groups[0]).entries()) {
		diffs += diffStrings(row, groups[1][idx]);
		if (diffs > maxDiffs)
			return false;
	}
	return true;
}

const transposeInput = R.pipe(
	R.split("\n"),
	R.map(R.split("")),
	R.transpose,
	R.map(R.join("")),
	R.join("\n"),
);

function processInput(input: string, maxDiffs = 0) {
	const getMirrorIndex = (g: string) => {
		const rows = R.split("\n", g);
		for (let ii=1; ii < rows.length; ii++) {
			const startIdx = ii - Math.min(rows.length - ii, ii);
			const count = 2 * (ii - startIdx);
			if (hasMirroredRows(rows.slice(startIdx, startIdx+count), maxDiffs)) {
				return ii;
			}
		}
		return 0;
	};

	let sum = 0;
	input.split("\n\n").forEach((p, index) => {
		let mirrorIdx = 100 * getMirrorIndex(p);
		if (!mirrorIdx) {
			const transposed = transposeInput(p);
			mirrorIdx = getMirrorIndex(transposed);
		}
		if (mirrorIdx === 0)
			throw new Error(`No mirror index found for pattern: ${index+1}`);
		sum += mirrorIdx;
	});
	return sum.toString();
}
async function p2023day13_part1(input: string, ...params: any[]) {
	return processInput(input);
}

async function p2023day13_part2(input: string, ...params: any[]) {
	return processInput(input, 1);
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
		expected: "405"
	}];
	const part2tests: TestCase[] = [{
		input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
		expected: "400"
	}];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2023day13_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2023day13_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day13_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day13_part2(input));
	const part2After = performance.now();

	logSolution(13, 2023, part1Solution, part2Solution);

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
