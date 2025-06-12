import { db } from "../src/libs/db.js";
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../src/libs/judge0.lib.js";

export const executeCode = async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs, problemId } =
    req.body;
  const userId = req.user.id;
  try {
    // 1. Validate Test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({
        error: "Invalid or missing test cases",
      });
    }

    // 2. Prepare each testcases for judge 0 batch submission
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // 3. Send this batch of submissions to Judge 0
    const submitResponse = await submitBatch(submissions);
    // console.log("submit response", submitResponse);

    const tokens = submitResponse.map((res) => res.token);
    // console.log("tokens ------", tokens)

    // 4. Poll Judge 0 for results of all submitted test cases
    const results = await pollBatchResults(tokens);
    // console.log("resultss from judge 0 -----", results);

    // 5 . Analyse Test Case Results
    let allTestCasePassed = true;
    const detailedResult = results.map((result, i) => {
      const stdout = result.stdout?.trim();
      const expectedOutput = expected_outputs[i].trim();
      const passed = stdout == expectedOutput;

      if (!passed) {
        allTestCasePassed = false;
      }

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expectedOutput ,
        stderr: result.stderr || null,
        compileOutput: result.compileOutput || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time}s` : undefined,
      };
      /*

        console.log(`Testcase #${i+1}`)
        console.log(`Input for test case ${i+1} : ${stdin[i]}`)
        console.log(`Expected output for testcase ${i+1} : ${expectedOutput}`) // this is output set by problem maker
        console.log(`Actual output for testcase ${i+1} : ${stdout}`) // this comes from judge0
        console.log(`Matched for testcase ${i+1} : ${passed}`)

        */
    });

    console.log("detailed result", detailedResult);

    // store this in Submission MODEL

    const submission = await db.submission.create({
      data: {
        problemId,
        userId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResult.map((r) => r.stdout)),
        stderr: detailedResult.some((r) => r.stderr)
          ? JSON.stringify(detailedResult.map((r) => r.stderr))
          : null,
        compileOutput: detailedResult.some((r) => r.compileOutput)
          ? JSON.stringify(detailedResult.map((r) => r.compileOutput))
          : null,
        status: allTestCasePassed ? "Accepted" : "Wrong Answer",
        memory: detailedResult.some((r) => r.memory)
          ? JSON.stringify(detailedResult.map((r) => r.memory))
          : null,
        time: detailedResult.some((r) => r.time)
          ? JSON.stringify(detailedResult.map((r) => r.time))
          : null,
      },
    });

    // if all test cases passed=true mark problem as solved for current user
    if (allTestCasePassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }

    // Save individual Test cases results using detailedResult
    const testCaseResults = detailedResult.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      stderr: result.stderr,
      expected: result.expected,
      compileOutput: result.compileOutput,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await db.testCaseResult.createMany({
      data: testCaseResults,
    });

    const submissionWithTestCase = await db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testCases: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Code executed succesfully",
      submission: submissionWithTestCase,
    });
  } catch (error) {
    console.error("Error occured executing code", error);
    res.status(500).json({
      error: "Some Error occured while executing code",
    });
  }
};
