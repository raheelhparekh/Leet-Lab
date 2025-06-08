import { db } from "../src/libs/db.js";

export const getAllPlaylistDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        error: "unauthorised user or incorrect user",
      });
    }

    const playlists = await db.playlist.findMany({
      where: {
        userId: userId,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "All playlist of user fetched successfully!",
      playlists,
    });
  } catch (error) {}
};

export const getPlaylistDetails = async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const userId = req.user.id;

    if (!playlistId) {
      return res.status(400).json({
        error: "Playlist ID is required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        error: "unauthorised user or incorrect user",
      });
    }

    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: userId,
        
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!playlist) {
      return res.status(404).json({
        error: "Playlist not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Playlist details fetched successfully!",
      playlist,
    });
  } catch (error) {
    console.error("Error occured while fetching playlist details", error);
    return res.status(500).json({
      error: "Error occured while fetching playlist details",
    });
  }
};

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;

    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        error: "unauthorised user or incorrect user",
      });
    }

    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });

    if (!playlist) {
      return res.status(400).json({
        error: " could not create a playlist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Playlist created succesfully",
      playlist,
    });
  } catch (error) {
    console.error("Error occured while creating playlist", error);
    return res.status(500).json({
      error: "Error occured while creating playlist",
    });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  const playlistId = req.params.playlistId;
  const { problemIds } = req.body;

//   console.log("Adding problems to playlist:", { playlistId, problemIds });

  const userId = req.user.id;

  try {
    if (!userId) {
      return res.status(400).json({
        error: "unauthorised user or incorrect user",
      });
    }

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({
        error: "Invalid problem IDs provided",
      });
    }

    console.log(problemIds.map((id) => ({playlistId :playlistId, problemId: id, })));

    const problemInPlaylist = await db.problemInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playlistId: playlistId,
        problemId,
      })),
    });

    if (!problemInPlaylist) {
      return res.status(400).json({
        error: "Could not add problems to playlist",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Problems added to playlist successfully",
      problemInPlaylist,
    });
  } catch (error) {
    console.error("Error occurred while adding problems to playlist", error);
    return res.status(500).json({
      error: "Error occurred while adding problems to playlist",
    });
  }
};

export const deletePlaylist = async (req, res) => {
  const playlistId = req.params.playlistId;
  const userId = req.user.id;

  try {
    if (!userId) {
      return res.status(400).json({
        error: "unauthorised user or incorrect user",
      });
    }

    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: userId,
      },
    });

    if (!playlist) {
      return res.status(404).json({
        error: "Playlist not found",
      });
    }

    await db.playlist.delete({
      where: {
        id: playlistId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    console.error("Error occurred while deleting playlist", error);
    return res.status(500).json({
      error: "Error occurred while deleting playlist",
    });
  }
};

export const updatePlaylist = async (req, res) => {
  const playlistId = req.params.playlistId;
  const { name, description } = req.body;

  const userId = req.user.id;

  try {
    if (!userId) {
      return res.status(400).json({
        error: "unauthorised user or incorrect user",
      });
    }

    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: userId,
      },
    });

    if (!playlist) {
      return res.status(404).json({
        error: "Playlist not found",
      });
    }

    const updatedPlaylist = await db.playlist.update({
      where: {
        id: playlistId,
      },
      data: {
        name,
        description,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Playlist updated successfully",
      updatedPlaylist,
    });
  } catch (error) {
    console.error("Error occurred while updating playlist", error);
    return res.status(500).json({
      error: "Error occurred while updating playlist",
    });
  }
};

export const removeProblemFromPlaylist = async (req, res) => {
  const playlistId = req.params.playlistId;
  const { problemIds } = req.body;

  const userId = req.user.id;

  try {
    if (!userId) {
      return res.status(400).json({
        error: "unauthorised user or incorrect user",
      });
    }

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({
        error: "Invalid problem IDs provided",
      });
    }

    const deletedProblem = await db.problemInPlaylist.deleteMany({
      where: {
        playlistId: playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Problem removed from playlist successfully",
      deletedProblem,
    });
  } catch (error) {
    console.error("Error occurred while removing problem from playlist", error);
    return res.status(500).json({
      error: "Error occurred while removing problem from playlist",
    });
  }
};
