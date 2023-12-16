import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { Cell, Grid } from "../../../util/grid";

const YEAR = 2023;
const DAY = 10;

// solution path: /Users/todd/macdev/personal/advent-of-code/years/2023/10/index.ts
// data path    : /Users/todd/macdev/personal/advent-of-code/years/2023/10/data.txt
// problem url  : https://adventofcode.com/2023/day/10

const getNextCell = (cell: Cell, prevCell: Cell) => {
	const getOther = (candidate: Cell | undefined, elseCell: Cell | undefined) => {
		return (candidate?.index === prevCell.index) ? elseCell : candidate;
	};
	switch (cell.value) {
		case "|": return getOther(cell.south(), cell.north());
		case "-": return getOther(cell.east(), cell.west());
		case "F": return getOther(cell.south(), cell.east());
		case "7": return getOther(cell.south(), cell.west());
		case "L": return getOther(cell.north(), cell.east());
		case "J": return getOther(cell.north(), cell.west());
	}
}

const getCellToMoveInto = (cell: Cell) => {
	const checkCell = (candidate: Cell | undefined, values: string[]) => values.includes(candidate?.value ?? "") ? candidate : undefined;
	return (
		checkCell(cell.north(), ["|", "F", "7"]) ??
		checkCell(cell.south(), ["|", "L", "J"]) ??
		checkCell(cell.west(), ["-", "L", "F"]) ??
		checkCell(cell.east(), ["-", "7", "J"])
	);
}

const getPath = (grid: Grid): [Array<Cell>, Cell | undefined] => {
	const start = grid.getCell("S");
	const path = new Array<Cell>();
	if (start) {
		let prevCell = start;
		let currCell = getCellToMoveInto(start);
		while (currCell && currCell.index !== start.index) {
			path.push(currCell);
			[currCell, prevCell] = [getNextCell(currCell, prevCell), currCell];
		}
	}
	return [path, start];
}

async function p2023day10_part1(input: string, ...params: any[]) {
	const [path] = getPath(new Grid({ serialized: input }));
	return Math.round(path.length / 2).toString();
}

const replaceStartWithSymbol = (start: Cell, path: Cell[]) => {
	let first = path[0];
	let last = path[path.length - 1];
	if (first.position[0] == last.position[0]) {
		start.setValue("-");
	} else if (first.position[1] == last.position[1]) {
		start.setValue("|");
	}
}

const isContainedInPath = (cell: Cell, path: Cell[]) => {
	// F-7 ┌─┐
	// | | │ │
	// L-J └─┘
	const leftList = path.filter(
		(c) => c.position[0] === cell.position[0] && c.value !== "-" && c.position[1] < cell.position[1]
	).sort((a, b) => a.position[1] - b.position[1]).map((c) => c.value).join("");
	// remove all 180 degree turns and change zig zags into one boundary
	const leftFixed = leftList.replaceAll("F7", "").replaceAll("LJ", "")
			.replaceAll("L7", "|").replaceAll("7L", "|").replaceAll("FJ", "|").replaceAll("JF", "|");
	// inside if it crosses an odd number of boundaries
	return leftFixed.length % 2 === 1;
}

const isPathCell = (cell: Cell, path: Cell[]) => {
	return !!path.find((c) => c.position[0] === cell.position[0] && c.position[1] === cell.position[1]);
}

async function p2023day10_part2(input: string, ...params: any[]) {
	const grid = new Grid({ serialized: input });
	const [path, start] = getPath(grid);
	if (start) {
		replaceStartWithSymbol(start, path);
		path.unshift(start);
	}
	const cells = grid.getCells((c: Cell) => !isPathCell(c, path));
	const result = cells.reduce((acc, c) => {
		return acc + (isContainedInPath(c, path) ? 1 : 0);
	}, 0);
	return result.toString();
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`,
		expected: "8"
	}];
	const part2tests: TestCase[] = [{
		input: `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`,
		expected: "4"
	}, {
		input: `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`,
		expected: "8"
	}, {
		input: `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`,
		expected: "10"
	}];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2023day10_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2023day10_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day10_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day10_part2(input));
	const part2After = performance.now();

	logSolution(10, 2023, part1Solution, part2Solution);

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
