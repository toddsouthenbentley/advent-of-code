import * as R from "ramda";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { Cell, Dir, Grid, GridPos } from "../../../util/grid";

const YEAR = 2023;
const DAY = 16;

// solution path: /Users/todd/macdev/personal/advent-of-code/years/2023/16/index.ts
// data path    : /Users/todd/macdev/personal/advent-of-code/years/2023/16/data.txt
// problem url  : https://adventofcode.com/2023/day/16

type Direction = "N" | "E" | "S" | "W";
type CellEntry = {
	cell: Cell, // cell we're entering
	direction: Direction, // direction we're coming from
}

function gridDirFromDirection(direction: Direction) {
	switch(direction) {
		case "N": return Dir.N;
		case "S": return Dir.S;
		case "E": return Dir.E;
		case "W": return Dir.W;
	}
}

function traverseGrid(entry: CellEntry, gridData: Map<string, Array<Direction>>) {
	const splits = new Array<CellEntry>();
	let cell: Cell | undefined = entry.cell;
	let direction: Direction | undefined = entry.direction;

	while (cell !== undefined) {
		// return if cell has already been entered before from the same direction
		const cellKey = cell.position.join(",");
		let cellData = gridData.get(cellKey);
		if (cellData?.find((d) => d === direction))
			return splits;

		if (!cellData) {
			cellData = new Array<Direction>();
			gridData.set(cellKey, cellData);
		}
		cellData.push(direction);

		// get next cell and direction
		if (cell.value === "/") {
			if (direction === "N") {
				direction = "E";
			} else if (direction === "E") {
				direction = "N";
			} else if (direction === "S") {
				direction = "W";
			} else {
				direction = "S";
			}
		} else if (cell.value === "\\") {
			if (direction === "N") {
				direction = "W";
			} else if (direction === "W") {
				direction = "N";
			} else if (direction === "S") {
				direction = "E";
			} else {
				direction = "S";
			}
		} else if (cell.value === "-") {
			if (direction === "N" || direction === "S") {
				direction = "W";
				const otherCell = cell.repeatMovements([gridDirFromDirection("E")]);
				if (otherCell)
					splits.push({ cell: otherCell, direction: "E"});
			}
		} else if (cell.value === "|") {
			if (direction === "W" || direction === "E") {
				direction = "N";
				const otherCell = cell.repeatMovements([gridDirFromDirection("S")]);
				if (otherCell)
					splits.push({ cell: otherCell, direction: "S"});
			}
		}
		cell = cell.repeatMovements([gridDirFromDirection(direction)]);
	}

	return splits;
}

function getGridScore(grid: Grid, startEntry: CellEntry) {
	const gridData = new Map<string, Array<Direction>>();
	const splits = new Array<CellEntry>(startEntry);
	let entry: CellEntry | undefined;
	while (entry = splits.shift()) {
		splits.push(...traverseGrid(entry, gridData));
	}
	return [...gridData.values()].filter((v) => v.length > 0).length;
}

async function p2023day16_part1(input: string, ...params: any[]) {
	const grid = new Grid({serialized: input});
	const score = getGridScore(grid, { cell: grid.getCell([0, 0])!, direction: "E"});
	return score.toString();
}

async function p2023day16_part2(input: string, gridPos: GridPos | undefined = undefined, direction: Direction | undefined = undefined, ...params: any[]) {
	const grid = new Grid({serialized: input});

	if (gridPos !== undefined && direction !== undefined) {
		const score = getGridScore(grid, { cell: grid.getCell(gridPos)!, direction});
		return score.toString();
	}
	let maxScore = 0;
	for (let row = 0; row < grid.rowCount; row++) {
		maxScore = Math.max(maxScore,
			getGridScore(grid, { cell: grid.getCell([row, 0])!, direction: "E"}),
			getGridScore(grid, { cell: grid.getCell([row, grid.colCount-1])!, direction: "W"}),
		);
	}
	for (let col = 0; col < grid.colCount; col++) {
		maxScore = Math.max(maxScore,
			getGridScore(grid, { cell: grid.getCell([0, col])!, direction: "S"}),
			getGridScore(grid, { cell: grid.getCell([grid.rowCount-1, col])!, direction: "N"}),
		);
	}
	return maxScore.toString();
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`,
		expected: "46"
	}];
	const part2tests: TestCase[] = [{
		input: `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`,
		expected: "51",
		extraArgs: [[0, 3], "S"],
	}];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2023day16_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2023day16_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day16_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day16_part2(input));
	const part2After = performance.now();

	logSolution(16, 2023, part1Solution, part2Solution);

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
