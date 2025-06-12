import { db } from "../src/libs/db.js";

// get all submissions of user
export const getAllSubmissionsForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        error: "user not authenticcated or not found",
      });
    }

    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "All Submissions fetched for user successfully",
      submissions,
    });
  } catch (error) {
    console.error("Error fetching all submissions for the user", error);
    return res.status(500).json({
      error: "Error fetching all submissions for user ",
    });
  }
};

// get all submissions of user for this problem
export const getSubmissionForProblem = async (req, res) => {
  try {
    const problemId = req.params.id;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        error: "user not authenticcated or not found",
      });
    }

    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Fetched submisison for this problem succesfully",
      submissions,
    });
  } catch (error) {
    console.error("Error fetching submission for this problem Id", error);
    return res.status(500).json({
      error: "Error fetching submission for this problem Id",
    });
  }
};

// get all submissions for this problem count -> includes all users
export const getAllSubmissionsForProblem = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        error: "User unauthorised or not found",
      });
    }

    const submissions = await db.submission.count({
      where: {
        problemId: problemId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Submissions Fetched Count Succesfully ",
      submissions
    });
  } catch (error) {
    console.error(
      "Error occured while getting all submission count for problem",
      error,
    );
    return res.status(500).json({
      error: "Error occured while getting all submission count for problem",
    });
  }
};