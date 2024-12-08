import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2024;
const DAY = 7;

// solution path: /Users/todd/projects/advent-of-code/years/2024/07/index.ts
// data path    : /Users/todd/projects/advent-of-code/years/2024/07/data.txt
// problem url  : https://adventofcode.com/2024/day/7

function loadLine(line: string) {
  const parts = line.split(" ");
  const result = Number(parts.shift()?.replaceAll(":", ""));
  const inputs = parts.map(p => Number(p));
  return { result, inputs };
}

function loadData(input: string) {
  return input.split("\n").map(loadLine);
}

function getPossibilties(numbers: number[], operators: string[]) {
  const result = Array<Array<number|string>>();
  if (numbers.length === 2) {
    operators.forEach(op => {
      result.push([numbers[0], op, numbers[1]]);
    });
    return result;
  }
  const subPossibilities = getPossibilties(numbers.slice(1), operators);
  for (const sub of subPossibilities) {
    operators.forEach(op => {
      result.push([numbers[0], op, ...sub]);
    });
  }
  return result;
}

function hasSuccessfulComputation({ result, inputs }: { result: number, inputs: number[] }, operators = ["*", "+"]) {
  const possibilities = getPossibilties(inputs, operators);
  for (const poss of possibilities) {
    let currResult: number = poss.shift() as number;
    while (poss.length) {
      const operator = poss.shift();
      const operand = poss.shift() as number;
      if (operator === "+") {
        currResult += operand;
      } else if (operator === "*") {
        currResult *= operand;
      } else if (operator === "||") {
        currResult = Number(currResult.toString().concat(operand.toString()));
      }
      if (currResult > result) {
        break;
      }
    }
    if (currResult === result) {
      return true;
    }
  }
  return false;
}

async function p2024day7_part1(input: string, ...params: any[]) {
  const data = loadData(input);
  let result = 0;
  for (const line of data) {
    if (hasSuccessfulComputation(line))
      result += line.result;
  }
	return result.toString();
}

async function p2024day7_part2(input: string, ...params: any[]) {
  const data = loadData(input);
  let result = 0;
  for (const line of data) {
    if (hasSuccessfulComputation(line, ["||", "+", "*"]))
      result += line.result;
  }
	return result.toString();
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
			expected: "3749",
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
			expected: "11387",
		},
  ];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2024day7_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2024day7_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2024day7_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2024day7_part2(input));
	const part2After = performance.now();

	logSolution(7, 2024, part1Solution, part2Solution);

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
