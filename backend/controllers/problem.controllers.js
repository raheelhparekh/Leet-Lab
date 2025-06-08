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
            "Your language is not supported yet, Please try from Java,python, Js",
        });
      }

      // we are running testcases for all languages with thier testcases
      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);
      console.log(`results:`, results);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
          // console.log(`Testcase ${i + 1} failed for language ${language}`)
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

      return res.status(201).json({
        success: true,
        message: "Problem created successfully",
        problem: newProblem,
      });
    }
  } catch (error) {
    console.error(" error occured while creating the problem", error);
    return res.status(501).json({
      error: "Some error occurred while creating the problem",
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();

    if (!problems) {
      return res.status(404).json({
        error: "No Problems found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched all problems",
      problems,
    });
  } catch (error) {
    console.error("Error fetching all problems", error);
    return res.status(501).json({
      error: "Error fetching all problems",
    });
  }
};

export const deleteProblem = async (req, res) => {
  const problemId = req.params.id;

  try {
    const problem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      return res.status(401).json({
        error: "No problem found with this id",
      });
    }

    // checking user role if he is admin then only allow him to delete
    if (req.user.role !== "ADMIN") {
      console.log("Only Admin is allowed to update the problem");
      return res.status(403).json({
        error: "Only admins are allowed to update problem",
      });
    }

    await db.problem.delete({
      where: {
        id: problemId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Problem deleted succesfully",
    });
  } catch (error) {
    console.error("Error occured while deleting the problem", error);
    return res.status(501).json({
      error: "Error occured while deleting the problem",
    });
  }
};

export const updateProblem = async (req, res) => {
  const problemId = req.params.id;
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

  try {
    const problem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      return res.status(401).json({
        error: "No problem found with this id",
      });
    }

    if (req.user.role !== "ADMIN") {
      console.log("Only Admin is allowed to update the problem");
      return res.status(403).json({
        error: "Only admins are allowed to update problem",
      });
    }

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      console.log(`Language : ${language}`);
      console.log(`Solution Code : ${solutionCode}`);

      const languageId = getJudge0LanguageId(language);
      console.log(`Language id : ${languageId}`);

      if (!languageId) {
        return res.status(400).json({
          message:
            "Your language is not supported yet, Please try from Java,python, Js",
        });
      }

      // we are running testcases for all languages with thier testcases
      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);
      console.log(`results:`, results);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }

      // save problem in database
      const newProblem = await db.problem.update({
        where: {
          id: problemId,
        },
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

      return res.status(201).json({
        success: true,
        message: "Problem updated successfully",
        problem: newProblem,
      });
    }
  } catch (error) {
    console.error(" error occured while updating the problem", error);
    return res.status(501).json({
      error: "Some error occurred while updating the problem",
    });
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problem.findUnique({
      where: { id },
    });

    if (!problem) {
      return res.status(404).json({
        error: "No such problem with this Id. Problem Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problem fetched with this id",
      problem,
    });
  } catch (error) {
    console.error("Error fetching problem by this id", error);
    return res.status(501).json({
      error: "Error fetching problem with this id ",
    });
  }
};

export const getAllSolvedProblemsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const problem = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        solvedBy: {
          where: {
            userId: userId,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Solved Problems by user fetched succesfully !!",
      problem,
    });
  } catch (error) {
    console.error("Error finding all solved problem by user", error);
    return res.status(500).json({
      error: "Error finding all solved problem by user",
    });
  }
};
