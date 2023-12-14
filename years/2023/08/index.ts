import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import * as R from "ramda";

const YEAR = 2023;
const DAY = 8;

// solution path: /Users/todd/macdev/personal/advent-of-code/years/2023/08/index.ts
// data path    : /Users/todd/macdev/personal/advent-of-code/years/2023/08/data.txt
// problem url  : https://adventofcode.com/2023/day/8

type MapNode = {
	label: string;
	index: number;
	leftNode: MapNode | undefined;
	rightNode: MapNode | undefined;
}

function loadNodes(input: string) {
	const nodes = new Map<string, MapNode>();
	const cleanedUp = input.replaceAll(/[ ()]/g, "").split("\n");
	const getOrCreateNode = (label: string, index: number) => {
		let node = nodes.get(label);
		if (!node) {
			node = { label, index, leftNode: undefined, rightNode: undefined};
			nodes.set(label, node);
		}
		return node;
	}
	cleanedUp.forEach((line, index) => {
		const [label, left, right] = line.split(/[=,]/g);
		const node = getOrCreateNode(label, index);
		node.leftNode = getOrCreateNode(left, index);
		node.rightNode = getOrCreateNode(right, index);
	});
	return nodes;
}

async function p2023day8_part1(input: string, ...params: any[]) {
	const [directions, nodeInput] = input.split("\n\n");
	const nodes = loadNodes(nodeInput);
	let currNode = nodes.get("AAA");
	let steps = 0;
	let currDirection = 0;
	while (currNode && currNode.label !== "ZZZ") {
		currNode = directions[currDirection] === "L" ? currNode.leftNode : currNode.rightNode;
		steps++;
		currDirection = (currDirection + 1) % directions.length;
	}
	return steps.toString();
}

async function p2023day8_part2(input: string, ...params: any[]) {
	const [directions, nodeInput] = input.split("\n\n");
	const nodes = loadNodes(nodeInput);
	let currNodes = [...nodes.values()].filter((n) => n.label.endsWith("A")).sort((n1, n2) => n1.index - n2.index);
	const allEndInZ = (nodeList: MapNode[]) => nodeList.every((n) => n.label.endsWith("Z"));
	let steps = 0;
	let currDirection = 0;

	while (steps < 100000000 && !allEndInZ(currNodes)) {
		currNodes = currNodes.map((n) => directions[currDirection] === "L" ? n.leftNode! : n.rightNode!)
		steps++;
		currDirection = (currDirection + 1) % directions.length;
	}
	return steps.toString();
}

async function run() {
	const part1tests: TestCase[] = [
		{
		input: `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`,
		expected: "2"
		},
		{
		input: `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
		expected: "6",
		}
	];
	const part2tests: TestCase[] = [{
		input: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`,
		expected: "6",
	}];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2023day8_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2023day8_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day8_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day8_part2(input));
	const part2After = performance.now();

	logSolution(8, 2023, part1Solution, part2Solution);

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
