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
  getInfoPlaylist,
  getPopularPlaylist,
} from "../controllers/playlist.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/:id/songs", getSongFromPlaylist); //done
router.get("/detail/:id", protectRoute, getInfoPlaylist);
// Playlist
router.post("/", protectRoute, createPlaylist); //done
router.put("/:playlistID", protectRoute, updatePlaylist); //doing
router.delete("/:playlistID", protectRoute, deletePlaylist); //done

router.post("/add-song", protectRoute, addSongPlaylist); //done
router.delete(
  "/:playlistID/delete-song/:songID",
  protectRoute,
  deleteSongPlaylist
); //done

// Thay đổi chế độ công khai
router.put("/:playlistID/visibility", protectRoute, changeVisibility); //done

// Lấy danh sách playlist của người dùng
router.get("/me", protectRoute, getMyPlayList); //done
router.get("/popular-playlist", getPopularPlaylist); //done

export default router;
