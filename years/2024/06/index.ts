import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { Cell, Dir, Grid, GridPos } from "../../../util/grid";

const YEAR = 2024;
const DAY = 6;

// solution path: /Users/todd/projects/advent-of-code/years/2024/06/index.ts
// data path    : /Users/todd/projects/advent-of-code/years/2024/06/data.txt
// problem url  : https://adventofcode.com/2024/day/6

async function p2024day6_part1(input: string, ...params: any[]) {
	const grid = new Grid({ serialized: input });
	let currCell: Cell | undefined = grid.getCells("^")[0];
	currCell.setValue("X");
	let direction = Dir.N;
	while (currCell) {
    let nextPos: GridPos | undefined = undefined;
		const result = currCell.repeatMovements([direction], {
			count: (candidate) => {
				if (!candidate) {
					// we're done, break out of the loop
					return false;
				}
				if (candidate.value === "#") {
					return false;
				}
				candidate.setValue("X");
        nextPos = [...candidate.position];
				return true;
			},
		});
    // result will be undefined when we go off the grid
    if (result && nextPos){
      currCell = grid.getCell(nextPos);
    } else {
      break;
    }
    if (direction === Dir.N) direction = Dir.E;
    else if (direction === Dir.E) direction = Dir.S;
    else if (direction === Dir.S) direction = Dir.W;
    else if (direction === Dir.W) direction = Dir.N;
	}
	const positions = grid.getCells("X");
	return positions.length;
}

async function p2024day6_part2(input: string, ...params: any[]) {
	return "Not implemented";
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
			expected: "41",
		},
	];
	const part2tests: TestCase[] = [];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2024day6_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2024day6_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2024day6_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2024day6_part2(input));
	const part2After = performance.now();

	logSolution(6, 2024, part1Solution, part2Solution);

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
