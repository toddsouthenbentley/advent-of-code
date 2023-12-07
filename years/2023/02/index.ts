import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2023;
const DAY = 2;

// solution path: /Users/todd/macdev/personal/advent-of-code/years/2023/02/index.ts
// data path    : /Users/todd/macdev/personal/advent-of-code/years/2023/02/data.txt
// problem url  : https://adventofcode.com/2023/day/2

type DieColor = "red" | "green" | "blue";

class Draw {
	counts = new Map<DieColor, number>();

	constructor(line: string) {
		line.split(", ").forEach((cube) => {
			const [num, color] = cube.split(" ");
			this.counts.set(color as DieColor, Number(num));
		});
	}
}

class Game {
	id = 0;
	draws: Draw[] = [];

	constructor(line: string) {
		const [game, draws] = line.split(": ");
		this.id = Number(game.split(" ")[1]);
		draws.split("; ").forEach((draw) => this.draws.push(new Draw(draw)));
	}

	getMaxCount(color: DieColor) {
		let count = 0;
		this.draws.forEach((draw) => count = Math.max(count, draw.counts.get(color) ?? 0));
		return count;
	}
}

async function p2023day2_part1(input: string, ...params: any[]) {
	const games: Game[] = [];
	input.split("\n").forEach((line) => games.push(new Game(line)));
	let sum = 0;
	games.forEach((game) => {
		if (game.getMaxCount("red") <= 12 && game.getMaxCount("green") <= 13 && game.getMaxCount("blue") <= 14)
			sum += game.id;
	});
	return sum.toString();
}

async function p2023day2_part2(input: string, ...params: any[]) {
	const games: Game[] = [];
	input.split("\n").forEach((line) => games.push(new Game(line)));
	let sum = 0;
	games.forEach((game) => {
		const power = game.getMaxCount("red") * game.getMaxCount("green") * game.getMaxCount("blue");
		sum += power;
	});
	return sum.toString();
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
		expected: "8",
	}];
	const part2tests: TestCase[] = [{
		input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
		expected: "2286",
	}];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2023day2_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2023day2_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day2_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day2_part2(input));
	const part2After = performance.now();

	logSolution(2, 2023, part1Solution, part2Solution);

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
