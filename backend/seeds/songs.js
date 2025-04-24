import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

const songs = [
  {
    title: "Stay With Me",
    artist: "Sarah Mitchell",
    imageURL: "/cover-images/1.jpg",
    audioURL: "/songs/1.mp3",
    duration: 46, // 0:46
  },
  {
    title: "Midnight Drive",
    artist: "The Wanderers",
    imageURL: "/cover-images/2.jpg",
    audioURL: "/songs/2.mp3",
    duration: 41, // 0:41
  },
  {
    title: "Lost in Tokyo",
    artist: "Electric Dreams",
    imageURL: "/cover-images/3.jpg",
    audioURL: "/songs/3.mp3",
    duration: 24, // 0:24
  },
  {
    title: "Summer Daze",
    artist: "Coastal Kids",
    imageURL: "/cover-images/4.jpg",
    audioURL: "/songs/4.mp3",
    duration: 24, // 0:24
  },
  {
    title: "Neon Lights",
    artist: "Night Runners",
    imageURL: "/cover-images/5.jpg",
    audioURL: "/songs/5.mp3",
    duration: 36, // 0:36
  },
  {
    title: "Mountain High",
    artist: "The Wild Ones",
    imageURL: "/cover-images/6.jpg",
    audioURL: "/songs/6.mp3",
    duration: 40, // 0:40
  },
  {
    title: "City Rain",
    artist: "Urban Echo",
    imageURL: "/cover-images/7.jpg",
    audioURL: "/songs/7.mp3",
    duration: 39, // 0:39
  },
  {
    title: "Desert Wind",
    artist: "Sahara Sons",
    imageURL: "/cover-images/8.jpg",
    audioURL: "/songs/8.mp3",
    duration: 28, // 0:28
  },
  {
    title: "Ocean Waves",
    artist: "Coastal Drift",
    imageURL: "/cover-images/9.jpg",
    audioURL: "/songs/9.mp3",
    duration: 28, // 0:28
  },
  {
    title: "Starlight",
    artist: "Luna Bay",
    imageURL: "/cover-images/10.jpg",
    audioURL: "/songs/10.mp3",
    duration: 30, // 0:30
  },
  {
    title: "Winter Dreams",
    artist: "Arctic Pulse",
    imageURL: "/cover-images/11.jpg",
    audioURL: "/songs/11.mp3",
    duration: 29, // 0:29
  },
  {
    title: "Purple Sunset",
    artist: "Dream Valley",
    imageURL: "/cover-images/12.jpg",
    audioURL: "/songs/12.mp3",
    duration: 17, // 0:17
  },
  {
    title: "Neon Dreams",
    artist: "Cyber Pulse",
    imageURL: "/cover-images/13.jpg",
    audioURL: "/songs/13.mp3",
    duration: 39, // 0:39
  },
  {
    title: "Moonlight Dance",
    artist: "Silver Shadows",
    imageURL: "/cover-images/14.jpg",
    audioURL: "/songs/14.mp3",
    duration: 27, // 0:27
  },
  {
    title: "Urban Jungle",
    artist: "City Lights",
    imageURL: "/cover-images/15.jpg",
    audioURL: "/songs/15.mp3",
    duration: 36, // 0:36
  },
  {
    title: "Crystal Rain",
    artist: "Echo Valley",
    imageURL: "/cover-images/16.jpg",
    audioURL: "/songs/16.mp3",
    duration: 39, // 0:39
  },
  {
    title: "Neon Tokyo",
    artist: "Future Pulse",
    imageURL: "/cover-images/17.jpg",
    audioURL: "/songs/17.mp3",
    duration: 39, // 0:39
  },
  {
    title: "Midnight Blues",
    artist: "Jazz Cats",
    imageURL: "/cover-images/18.jpg",
    audioURL: "/songs/18.mp3",
    duration: 29, // 0:29
  },
];

const seedSongs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing songs
    await Song.deleteMany({});

    // Insert new songs
    await Song.insertMany(songs);

    console.log("Songs seeded successfully!");
  } catch (error) {
    console.error("Error seeding songs:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedSongs();
