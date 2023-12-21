import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import * as R from "ramda";

const YEAR = 2023;
const DAY = 15;

// solution path: /Users/todd/macdev/personal/advent-of-code/years/2023/15/index.ts
// data path    : /Users/todd/macdev/personal/advent-of-code/years/2023/15/data.txt
// problem url  : https://adventofcode.com/2023/day/15

function hashCode(input: string) {
	return R.pipe(
		R.split(""),
		R.reduce((acc, c) => ((acc + c.charCodeAt(0)) * 17) % 256, 0),
	)(input);
}

async function p2023day15_part1(input: string, ...params: any[]) {
	const sum = R.pipe(
		R.split(","),
		R.map(hashCode),
		R.sum,
	)(input);
	return sum.toString();
}

type Lens = {
	label: string,
	focalLength: number
}

type Box = {
	index: number;
	lenses: Lens[];
}

async function p2023day15_part2(input: string, ...params: any[]) {
	const sum = R.pipe(
		R.split(","),
		R.reduce((boxes, step) => {
			const [label, fl] = step.split(/[-=]/);
			const index = hashCode(label);
			if (boxes[index] === undefined)
				boxes[index] = { index, lenses: []};
			const lenses = boxes[index].lenses;
			const lensIdx = lenses.findIndex((l) => l.label === label);
			if (fl.length) {
				const focalLength = Number(fl);
				if (lensIdx >= 0) {
					lenses[lensIdx].focalLength = focalLength;
				} else {
					lenses.push({ label, focalLength });
				}
			} else if (lensIdx >= 0) {
				lenses.splice(lensIdx, 1);
				if (lenses.length === 0)
					delete boxes[index];
			}
			return boxes;
		}, new Array<Box>()),
		R.map((box) => box?.lenses?.reduce((boxSum, l, ii) => boxSum + (box.index + 1) * (ii + 1) * l.focalLength, 0) ?? 0),
		R.sum,
	)(input);
	return sum.toString();
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
		expected: "1320"
	}];
	const part2tests: TestCase[] = [{
		input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
		expected: "145"
	}];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2023day15_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2023day15_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day15_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day15_part2(input));
	const part2After = performance.now();

	logSolution(15, 2023, part1Solution, part2Solution);

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
