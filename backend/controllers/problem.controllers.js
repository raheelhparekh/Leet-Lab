import { db } from "../src/libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../src/libs/judge0.lib.js";

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    hints,
    editorial,
    testCases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "You are not allowed to create a problem",
    });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      console.log(`Language : ${language}`);
      console.log(`Solution Code : ${solutionCode}`);

      const languageId = getJudge0LanguageId(language);
      console.log(`Language id : ${languageId}`);

      if (!languageId) {
        return res.status(400).json({
          message:
            "Your language is not supported yet, Please try from Java,python, Js, C++",
        });
      }

      // we are running testcases for all languages with thier testcases
      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin_input: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);
      console.log(`results:${results}`);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }

      // save problem in database
      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          hints,
          editorial,
          testCases,
          codeSnippets,
          referenceSolutions,
          userId: req.user.id,
        },
      });

      return res.status(201).json({ success: true, newProblem });
    }
  } catch (error) {
    console.error(" error occured while creating the problem", error);
    return res.status(501).json({
      error: "Some error occurred while creating the problem",
    });
  }
};

export const getAllProblems = async (req, res) => {};

export const deleteProblem = async (req, res) => {};

export const updateProblem = async (req, res) => {};

export const getProblemById = async (req, res) => {};

export const getAllSolvedProblemsByUser = async (req, res) => {};
