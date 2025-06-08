import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import {
  addProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylistDetails,
  getPlaylistDetails,
  removeProblemFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controllers.js";

const playlistRoutes = express.Router();

playlistRoutes.get("/", authMiddleware, getAllPlaylistDetails);
playlistRoutes.get("/:playlistId", authMiddleware, getPlaylistDetails);
playlistRoutes.post("/create-playlist", authMiddleware, createPlaylist);
playlistRoutes.post("/:playlistId/addProblem",authMiddleware,addProblemToPlaylist);
playlistRoutes.delete("/delete-playlist/:playlistId",authMiddleware,deletePlaylist);
playlistRoutes.put("/update-playlist/:playlistId",authMiddleware,updatePlaylist);
playlistRoutes.delete("/:playlistId/remove-problem",authMiddleware,removeProblemFromPlaylist);

export default playlistRoutes;
