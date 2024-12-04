import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { serialize } from "v8";
import { Cell, Dir, Grid } from "../../../util/grid";

const YEAR = 2024;
const DAY = 4;

// solution path: /Users/todd/projects/advent-of-code/years/2024/04/index.ts
// data path    : /Users/todd/projects/advent-of-code/years/2024/04/data.txt
// problem url  : https://adventofcode.com/2024/day/4

async function p2024day4_part1(input: string, ...params: any[]) {
	let count = 0;
	const searchString = "XMAS";
	const grid = new Grid({serialized: input});
  const cells = grid.getCells(searchString[0]);
  for (const cell of cells) {
    for (const dir of [Dir.N, Dir.NE, Dir.E, Dir.SE, Dir.S, Dir.SW, Dir.W, Dir.NW]) {
      let currCell: Cell | undefined = cell;
      for (let i = 0; i < searchString.length; i++, currCell = currCell?.repeatMovements([dir])) {
        if (currCell?.value !== searchString[i]) break;
        if (i === searchString.length - 1) count++;
      }
    }
  }
	return count.toString();
}

async function p2024day4_part2(input: string, ...params: any[]) {
	let count = 0;
	const grid = new Grid({serialized: input});
  const cells = grid.getCells("A");
  for (const cell of cells) {
    const ne = cell.repeatMovements([Dir.NE]);
    const sw = cell.repeatMovements([Dir.SW]);
    const se = cell.repeatMovements([Dir.SE]);
    const nw = cell.repeatMovements([Dir.NW]);

    if (!ne || !se || !nw || !sw) continue;
    if (
      ((ne.value === "M" && sw.value === "S") || (ne.value === "S" && sw.value === "M")) &&
      ((nw.value === "M" && se.value === "S") || (nw.value === "S" && se.value === "M"))
    ) {
      count++;
    }
  }
	return count.toString();
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
		expected: "18"
	}];
	const part2tests: TestCase[] = [{
		input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
		expected: "9"
	}];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2024day4_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2024day4_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2024day4_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2024day4_part2(input));
	const part2After = performance.now();

	logSolution(4, 2024, part1Solution, part2Solution);

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
