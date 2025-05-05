import cloudinary from "../config/cloudinary.js";
import { Playlist } from "../models/playlist.model.js";
import { Song } from "../models/song.model.js";
import { User } from "./../models/user.model.js";
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);
    throw new Error("Error uploading to cloudinay");
  }
};

export const createPlaylist = async (req, res) => {
  try {
    const userId = await User.findOne({ clerkID: req.auth.userId });
    if (!userId) {
      return res.status(404).json({ error: "User not found" });
    }
    const newPlaylist = new Playlist({
      title: "Danh sách phát mới",
      description: "",
      imageURL: "/defaultImagepPlaylist.png",
      user: userId._id,
      isPublic: true,
    });
    await newPlaylist.save();
    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const { playlistID } = req.params;
    const userID = req.auth.userId;
    const { title, description, imageURL } = req.body;

    const playlist = await Playlist.findById(playlistID);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    if (!playlist.user.equals(userID)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (title !== undefined) playlist.title = title;
    if (description !== undefined) playlist.description = description;
    if (imageURL !== undefined) playlist.imageURL = imageURL;

    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { playlistID } = req.body;
    const userID = req.auth.userId;

    const playlist = await Playlist.findById(playlistID);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    if (!playlist.user.equals(userID)) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    await Playlist.findByIdAndDelete(playlistID);
    res.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addSongPlaylist = async (req, res) => {
  try {
    const { playlistID, songID } = req.body;
    const clerkID = req.auth.userId;
    const user = await User.findOne({ clerkID });
    const playlist = await Playlist.findById(playlistID);
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
    if (!playlist.user.equals(user._id))
      return res.status(403).json({ error: "Unauthorized" });

    const song = await Song.findById(songID);
    if (!song) return res.status(404).json({ error: "Song not found" });

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistID,
      { $addToSet: { songs: songID } },
      { new: true }
    ).populate("songs");

    res.json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteSongPlaylist = async (req, res) => {
  try {
    const { playlistID, songID } = req.params;
    if (!req.auth.userId) {
      return res.status(401).json({ error: "Unauthorized (missing userId)" });
    }

    const user = await User.findOne({ clerkID: req.auth.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const playlist = await Playlist.findById(playlistID);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    if (!playlist.user.equals(user._id)) {
      return res
        .status(403)
        .json({ error: "Unauthorized access to this playlist" });
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistID,
      { $pull: { songs: songID } },
      { new: true }
    ).populate("songs");

    res.json(updatedPlaylist);
  } catch (error) {
    console.error("Error in deleteSongPlaylist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const changeVisibility = async (req, res) => {
  try {
    const { playlistID } = req.body;
    const userID = req.auth.userId;

    const playlist = await Playlist.findById(playlistID);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    if (!playlist.user.equals(userID)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    playlist.isPublic = !playlist.isPublic;
    await playlist.save();

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyPlayList = async (req, res) => {
  console.log(1);
  try {
    const userId = await User.findOne({ clerkID: req.auth.userId });
    if (!userId) {
      return res.status(404).json({ error: "User not found" });
    }
    const playlists = await Playlist.find({ user: userId._id })
      .populate("user", "fullName imageURL")
      .populate("songs", "title artist imageURL duration")
      .sort({ createdAt: -1 });

    res.json(playlists);
  } catch (error) {
    console.error("Error fetching playlists: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSongFromPlaylist = async (req, res) => {
  try {
    const { id: playlistID } = req.params;
    const playlist = await Playlist.findById(playlistID).populate("songs");

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.json(playlist.songs);
  } catch (error) {
    console.error("Error fetching songs in playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
