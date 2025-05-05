import express from "express";
import {
  createPlaylist,
  deletePlaylist,
  addSongPlaylist,
  deleteSongPlaylist,
  changeVisibility,
  getMyPlayList,
  updatePlaylist,
  getSongFromPlaylist,
} from "../controllers/playlist.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();
router.use(protectRoute);

router.get("/:id/songs", getSongFromPlaylist); //done

// Playlist
router.post("/", createPlaylist); //done
router.put("/:playlistID", updatePlaylist);
router.delete("/:playlistID", deletePlaylist);

router.post("/add-song", addSongPlaylist); //done
router.delete("/:playlistID/delete-song/:songID", deleteSongPlaylist); //done

// Thay đổi chế độ công khai
router.put("/:playlistID/visibility", changeVisibility);

// Lấy danh sách playlist của người dùng
router.get("/me", getMyPlayList); //done

export default router;
