import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { Cell, Dir, Grid } from "../../../util/grid";
import { dir } from "console";

const YEAR = 2023;
const DAY = 14;

// solution path: /Users/todd/macdev/personal/advent-of-code/years/2023/14/index.ts
// data path    : /Users/todd/macdev/personal/advent-of-code/years/2023/14/data.txt
// problem url  : https://adventofcode.com/2023/day/14

type Direction = "N" | "E" | "S" | "W";
function tiltGrid(grid: Grid, direction: Direction) {
	switch (direction) {
		case "E":
			grid = grid.rotate(1, "CCW");
			break;
		case "W":
			grid = grid.rotate(1, "CW");
			break;
		case "S":
			grid = grid.rotate(2, "CW");
			break;
	}
	for (const cell of grid) {
		if (cell.value !== "O")
			continue;
		const emptyAbove = cell.findCellCluster({
			allowDiagonal: false,
			allowHorizontal: false,
			allowVertical: true,
			test: ((c) => c.value === "." && c.position[0] < cell.position[0]),
		});
		if (emptyAbove.length > 0) {
			emptyAbove[0].setValue("O");
			cell.setValue(".");
		}
	}
	switch (direction) {
		case "E":
			grid = grid.rotate(1, "CW");
			break;
		case "W":
			grid = grid.rotate(1, "CCW");
			break;
		case "S":
			grid = grid.rotate(2, "CW");
			break;
	}
	return grid;
}

function getGridRow(grid: Grid, row: number) {
	const cells = new Array<Cell>();
	for (let col=0; col < grid.colCount; col++) {
		const cell = grid.getCell([row, col]);
		if (cell?.value === "O")
			cells.push(cell);
	}
	return cells;
}

function getGridColumn(grid: Grid, col: number) {
	const cells = new Array<Cell>();
	for (let row=0; row < grid.rowCount; row++) {
		const cell = grid.getCell([row, col]);
		if (cell?.value === "O")
			cells.push(cell);
	}
	return cells;
}

function tiltGrid2(grid: Grid, direction: Direction) {
	const movementDirFromDirection = () => {
		switch (direction) {
			case "N": return [Dir.N];
			case "E": return [Dir.E];
			case "W": return [Dir.W];
			case "S": return [Dir.S];
		}
	};
	const processCell = (cell: Cell) => {
		const firstNeighbor = cell.repeatMovements(movementDirFromDirection());
		if (!firstNeighbor || firstNeighbor.value !== ".") return;
		const cells = firstNeighbor.findCellCluster({
			allowDiagonal: false,
			allowHorizontal: direction === "E" || direction === "W",
			allowVertical: direction === "N" || direction === "S",
			test: ((c) => c.value === "."),
		});
		if (cells.length) {
			const idx = direction === "N" || direction === "W" ? 0 : cells.length - 1;
			cells[idx].setValue("O");
			cell.setValue(".");
		}
	};

	if (direction == "N") {
		for (let row = 1; row < grid.rowCount; row++) {
			getGridRow(grid, row).forEach(processCell);
		}
	} else if (direction === "S") {
		for (let row = grid.rowCount - 2; row >= 0; row--) {
			getGridRow(grid, row).forEach(processCell);
		}
	} else if (direction === "E") {
		for (let col = grid.colCount - 2; col >= 0; col--) {
			getGridColumn(grid, col).forEach(processCell);
		}
	} else if (direction === "W") {
		for (let col = 1; col < grid.colCount; col++) {
			getGridColumn(grid, col).forEach(processCell);
		}
	}
	return grid;
}

function computeScore(grid: Grid) {
	let sum = 0;
	for (let row=0; row < grid.rowCount; row++) {
		const cells = grid.getCells((c) => c.position[0] === row && c.value === "O").length;
		const rowScore = cells * (grid.rowCount - row);
		sum += rowScore;
	}
	return sum;
}

async function p2023day14_part1(input: string, ...params: any[]) {
	const grid = tiltGrid2(new Grid({serialized: input}), "N");
	const sum = computeScore(grid);
	return sum.toString();
}

async function p2023day14_part2(input: string, ...params: any[]) {
	const iterations = new Map<string, number>();
	let grid = new Grid({serialized: input});

	const max = 1000000000;
	for (let ii=0; ii < max; ii++) {
		const gridString = grid.toString();
		const iteration = iterations.get(gridString);
		if (iteration === undefined) {
			iterations.set(gridString, ii);
		} else {
			const loopSize = ii - iteration;
			const remaining = max - ii;
			const remainder = remaining % loopSize;
			const targetIteration = iteration + remainder;
			const finalGridStr = [...iterations.entries()].find(([g, i]) => i === targetIteration);
			if (finalGridStr) {
				grid = new Grid({ serialized: finalGridStr[0]});
				break;
			}
			log(`Loops on ii: ${ii}, iteration: ${iteration}`);
		}

		for (const direction of new Array<Direction>("N", "W", "S", "E")) {
			grid = tiltGrid2(grid, direction);
		}
		process.stdout.write(".");
	}
	const sum = computeScore(grid);
	return sum.toString();
}

async function run() {
	const part1tests: TestCase[] = [{
	input: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
		expected: "136"
	}];
	const part2tests: TestCase[] = [{
		input: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
			expected: "64"
		}];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2023day14_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2023day14_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day14_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day14_part2(input));
	const part2After = performance.now();

	logSolution(14, 2023, part1Solution, part2Solution);

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
