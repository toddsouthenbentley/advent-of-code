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

function traverseGrid(grid: Grid, detectLoops = false) {
	let currCell: Cell | undefined = grid.getCells("^")[0];
	const startPos: GridPos = [...currCell.position];
	currCell.setValue("|");
	let direction = Dir.N;
	const locationToDirections = new Map<string, Set<GridPos>>();
	const addDirection = (pos: GridPos, dir: GridPos) => {
		if (!detectLoops) return;
		const key = pos.toString();
		if (!locationToDirections.has(key)) locationToDirections.set(key, new Set());
		locationToDirections.get(key)?.add(dir);
	};
  addDirection(startPos, direction);

	while (currCell) {
		let nextPos: GridPos | undefined = undefined;
		const result = currCell.repeatMovements([direction], {
			count: candidate => {
				if (!candidate) {
					// we're done, break out of the loop
					return false;
				}
				if (candidate.value === "#" || candidate.value === "O") {
					return false;
				}
				if (detectLoops) {
					const key = candidate.position.toString();
					const dirs = locationToDirections.get(key);
					if (dirs && dirs.has(direction)) {
						grid.setCell(startPos, "^");
						throw new Error("Loop detected");
					}
				}
				addDirection(candidate.position, direction);
				candidate.setValue(direction === Dir.N || direction === Dir.S ? "|" : "-");
				nextPos = [...candidate.position];
				return true;
			},
		});
		// result will be undefined when we go off the grid
		if (result && nextPos) {
			currCell = grid.getCell(nextPos);
		} else {
			break;
		}
		if (direction === Dir.N) direction = Dir.E;
		else if (direction === Dir.E) direction = Dir.S;
		else if (direction === Dir.S) direction = Dir.W;
		else if (direction === Dir.W) direction = Dir.N;

		if (currCell) {
			addDirection(currCell.position, direction);
			grid.setCell(currCell.position, "+");
		}
	}
	grid.setCell(startPos, "^");
	return grid;
}

async function p2024day6_part1(input: string, ...params: any[]) {
	const grid = traverseGrid(new Grid({ serialized: input }));
	// grid.log(false);
	return grid.getCells(c => ["^", "|", "-", "+"].includes(c.value)).length.toString();
}

async function p2024day6_part2(input: string, ...params: any[]) {
  const grid = new Grid({ serialized: input });
  const baseGrid = grid.copyGrid();
	traverseGrid(grid);
	const visitedCells = grid.getCells(c => ["^", "|", "-", "+"].includes(c.value));
	let count = 0;
	for (const cell of visitedCells) {
		const testGrid = baseGrid.copyGrid();
		if (cell.value === "^") continue;
		testGrid.setCell(cell.position, "O");
		try {
			traverseGrid(testGrid, true);
		} catch (e) {
			// testGrid.log(false);
			count++;
		}
	}
	// tried: 2416 too high, 1744 too low
	// console.log(`count: ${count}`);
	// return "In progress";
	return count.toString();
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
	const part2tests: TestCase[] = [
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
			expected: "6",
		},
	];

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
