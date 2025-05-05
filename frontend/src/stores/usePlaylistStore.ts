import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { Playlist, Song } from "@/types";

interface PlaylistStore {
  playlists: Playlist[];
  isLoading: boolean;
  error: string | null;
  songsInPlaylist: Song[];

  fetchMyPlaylists: () => Promise<void>;
  createPlaylist: () => Promise<Playlist | null>;
  updatePlaylist: (
    playlistID: string,
    data: Partial<Playlist>
  ) => Promise<void>;
  deletePlaylist: (playlistID: string) => Promise<void>;
  addSongToPlaylist: (playlistID: string, songID: string) => Promise<void>;
  removeSongFromPlaylist: (playlistID: string, songID: string) => Promise<void>;
  togglePlaylistVisibility: (playlistID: string) => Promise<void>;
  getSongsInPlaylist: (playlistID: string) => Promise<void>;
  reset: () => void;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  playlists: [],
  isLoading: false,
  error: null,
  songsInPlaylist: [],

  fetchMyPlaylists: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/playlists/me");
      set({ playlists: res.data });
    } catch (err: any) {
      set({ error: err.response?.data?.error || "Failed to load playlists" });
    } finally {
      set({ isLoading: false });
    }
  },

  createPlaylist: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post("/playlists");
      set((state) => ({
        playlists: [res.data, ...state.playlists],
      }));
      return res.data;
    } catch (err: any) {
      set({ error: err.response?.data?.error || "Failed to create playlist" });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updatePlaylist: async (playlistID, data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.put(`/playlists/${playlistID}`, data);
      set((state) => ({
        playlists: state.playlists.map((p) =>
          p._id === playlistID ? res.data : p
        ),
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.error || "Failed to update playlist" });
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlaylist: async (playlistID) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/playlists/${playlistID}`);
      set((state) => ({
        playlists: state.playlists.filter((p) => p._id !== playlistID),
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.error || "Failed to delete playlist" });
    } finally {
      set({ isLoading: false });
    }
  },

  addSongToPlaylist: async (playlistID: string, songID: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post(`/playlists/add-song`, {
        playlistID,
        songID,
      });
      set((state) => ({
        playlists: state.playlists.map((p) =>
          p._id === playlistID ? res.data : p
        ),
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.error || "Failed to add song to playlist",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  removeSongFromPlaylist: async (playlistID: string, songID: string) => {
    set({ isLoading: true, error: null });
    console.log(playlistID, songID);
    try {
      const res = await axiosInstance.delete(
        `/playlists/${playlistID}/delete-song/${songID}`,
        {
          data: { playlistID, songID },
        }
      );
      set((state) => ({
        playlists: state.playlists.map((p) =>
          p._id === playlistID ? res.data : p
        ),
      }));
    } catch (err: any) {
      set({
        error:
          err.response?.data?.error || "Failed to remove song from playlist",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  togglePlaylistVisibility: async (playlistID: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.put(
        `/playlists/${playlistID}/visibility`
      );
      set((state) => ({
        playlists: state.playlists.map((p) =>
          p._id === playlistID ? res.data : p
        ),
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.error || "Failed to change visibility",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  getSongsInPlaylist: async (playlistID: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/playlists/${playlistID}/songs`);
      set({ songsInPlaylist: res.data });
    } catch (err: any) {
      set({
        error: err.response?.data?.error || "Failed to load songs",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => {
    set({ playlists: [], isLoading: false, error: null });
  },
}));
