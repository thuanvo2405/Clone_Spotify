import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { config } from "dotenv";

config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing data
    await Album.deleteMany({});
    await Song.deleteMany({});

    // First, create all songs
    const createdSongs = await Song.insertMany([
      {
        title: "City Rain",
        artist: "Urban Echo",
        imageURL: "/cover-images/7.jpg",
        audioURL: "/songs/7.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 39, // 0:39
      },
      {
        title: "Neon Lights",
        artist: "Night Runners",
        imageURL: "/cover-images/5.jpg",
        audioURL: "/songs/5.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 36, // 0:36
      },
      {
        title: "Urban Jungle",
        artist: "City Lights",
        imageURL: "/cover-images/15.jpg",
        audioURL: "/songs/15.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 36, // 0:36
      },
      {
        title: "Neon Dreams",
        artist: "Cyber Pulse",
        imageURL: "/cover-images/13.jpg",
        audioURL: "/songs/13.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 39, // 0:39
      },
      {
        title: "Summer Daze",
        artist: "Coastal Kids",
        imageURL: "/cover-images/4.jpg",
        audioURL: "/songs/4.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 24, // 0:24
      },
      {
        title: "Ocean Waves",
        artist: "Coastal Drift",
        imageURL: "/cover-images/9.jpg",
        audioURL: "/songs/9.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 28, // 0:28
      },
      {
        title: "Crystal Rain",
        artist: "Echo Valley",
        imageURL: "/cover-images/16.jpg",
        audioURL: "/songs/16.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 39, // 0:39
      },
      {
        title: "Starlight",
        artist: "Luna Bay",
        imageURL: "/cover-images/10.jpg",
        audioURL: "/songs/10.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 30, // 0:30
      },
      {
        title: "Stay With Me",
        artist: "Sarah Mitchell",
        imageURL: "/cover-images/1.jpg",
        audioURL: "/songs/1.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 46, // 0:46
      },
      {
        title: "Midnight Drive",
        artist: "The Wanderers",
        imageURL: "/cover-images/2.jpg",
        audioURL: "/songs/2.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 41, // 0:41
      },
      {
        title: "Moonlight Dance",
        artist: "Silver Shadows",
        imageURL: "/cover-images/14.jpg",
        audioURL: "/songs/14.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 27, // 0:27
      },
      {
        title: "Lost in Tokyo",
        artist: "Electric Dreams",
        imageURL: "/cover-images/3.jpg",
        audioURL: "/songs/3.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 24, // 0:24
      },
      {
        title: "Neon Tokyo",
        artist: "Future Pulse",
        imageURL: "/cover-images/17.jpg",
        audioURL: "/songs/17.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 39, // 0:39
      },
      {
        title: "Purple Sunset",
        artist: "Dream Valley",
        imageURL: "/cover-images/12.jpg",
        audioURL: "/songs/12.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 17, // 0:17
      },
    ]);

    // Create albums with references to song IDs
    const albums = [
      {
        title: "Urban Nights",
        artist: "Various Artists",
        imageURL: "/albums/1.jpg",
        releaseYear: 2024,
        songs: createdSongs.slice(0, 4).map((song) => song._id),
      },
      {
        title: "Coastal Dreaming",
        artist: "Various Artists",
        imageURL: "/albums/2.jpg",
        releaseYear: 2024,
        songs: createdSongs.slice(4, 8).map((song) => song._id),
      },
      {
        title: "Midnight Sessions",
        artist: "Various Artists",
        imageURL: "/albums/3.jpg",
        releaseYear: 2024,
        songs: createdSongs.slice(8, 11).map((song) => song._id),
      },
      {
        title: "Eastern Dreams",
        artist: "Various Artists",
        imageURL: "/albums/4.jpg",
        releaseYear: 2024,
        songs: createdSongs.slice(11, 14).map((song) => song._id),
      },
    ];

    // Insert all albums
    const createdAlbums = await Album.insertMany(albums);

    // Update songs with their album references
    for (let i = 0; i < createdAlbums.length; i++) {
      const album = createdAlbums[i];
      const albumSongs = albums[i].songs;

      await Song.updateMany(
        { _id: { $in: albumSongs } },
        { albumId: album._id }
      );
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
