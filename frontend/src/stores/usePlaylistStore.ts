import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { Playlist, Song } from "@/types";
import toast from "react-hot-toast";

interface UpdatePlaylistData {
  title?: string;
  description?: string;
  imageFile?: File;
}

interface PlaylistStore {
  playlists: Playlist[];
  isLoading: boolean;
  error: string | null;
  songsInPlaylist: Song[];
  detailPlaylist: Playlist | null;
  popularPlaylist: Playlist[];

  fetchMyPlaylists: () => Promise<void>;
  fetchPopularPlaylist: () => Promise<void>;
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
  getDeatilPlaylist: (playlistID: string) => Promise<void>;

  reset: () => void;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  playlists: [],
  isLoading: false,
  error: null,
  songsInPlaylist: [],
  detailPlaylist: null,
  popularPlaylist: [],

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

  fetchPopularPlaylist: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/playlists/popular-playlist");
      set({ popularPlaylist: res.data });
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

  updatePlaylist: async (playlistID: string, data: UpdatePlaylistData) => {
    set({ isLoading: true, error: null });

    if (!playlistID || !data) {
      set({ error: "Playlist ID and data are required" });
      set({ isLoading: false });
      return;
    }

    const formData = new FormData();
    if (data.title !== undefined && data.title.trim() !== "") {
      formData.append("title", data.title);
    }
    if (data.description !== undefined && data.description.trim() !== "") {
      formData.append("description", data.description);
    }

    if (data.imageFile) formData.append("imageFile", data.imageFile);

    try {
      const res = await axiosInstance.put(
        `/playlists/${playlistID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      set((state) => ({
        playlists: state.playlists.map((p) =>
          p._id === playlistID ? res.data : p
        ),
      }));
    } catch (err: any) {
      // Xử lý lỗi
      set({
        error: err.response?.data?.error || "Failed to update playlist",
      });
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
      toast.error(err.response?.data?.error);
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
      toast.error(err.response?.data?.error);
    } finally {
      set({ isLoading: false });
    }
  },

  removeSongFromPlaylist: async (playlistID: string, songID: string) => {
    set({ isLoading: true, error: null });
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
      toast.error(err.response?.data?.error);
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
        detailPlaylist:
          state.detailPlaylist?._id === playlistID
            ? res.data
            : state.detailPlaylist,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.error || "Failed to change visibility",
      });
      toast.error(err.response?.data?.error);
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

  getDeatilPlaylist: async (playlistID: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/playlists/detail/${playlistID}`);
      set({ detailPlaylist: res.data });
      console.log(res);
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
