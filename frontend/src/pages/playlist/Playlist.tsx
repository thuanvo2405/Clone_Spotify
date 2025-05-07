import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button"; // giả sử bạn đang dùng shadcn/ui
import { Plus } from "lucide-react"; // icon dấu cộng
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useNavigate } from "react-router-dom";
import SectionPlaylistGrid from "./components/SectionPlaylistGrid";
import { SignedIn } from "@clerk/clerk-react";

const Playlist = () => {
  const {
    createPlaylist,
    playlists,
    fetchMyPlaylists,
    isLoading,
    popularPlaylist,
    fetchPopularPlaylist,
  } = usePlaylistStore();

  const navigate = useNavigate();
  const handleCreatePlaylist = async () => {
    const res = await createPlaylist();
    const newPlaylistId = res?._id;
    if (newPlaylistId) {
      navigate(`/playlist/${newPlaylistId}`);
    }
  };

  useEffect(() => {
    fetchMyPlaylists();
    fetchPopularPlaylist();
  }, [fetchMyPlaylists, fetchPopularPlaylist]);

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between px-4 pt-4">
        <h1 className="text-2xl font-bold">Your Playlists</h1>

        <Button
          variant="default"
          className="flex items-center gap-2"
          onClick={handleCreatePlaylist}
        >
          <Plus className="w-4 h-4" />
          Add Playlist
        </Button>
      </div>

      <ScrollArea className="h-full rounded-md px-4 pb-4">
        <div className="space-y-8">
          <SignedIn>
            <SectionPlaylistGrid
              title="My Playlist"
              playlists={playlists}
              isLoading={isLoading}
            />
          </SignedIn>

          <SectionPlaylistGrid
            title="Most Popular"
            playlists={popularPlaylist}
            isLoading={isLoading}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default Playlist;
