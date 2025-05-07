import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { formatDuration } from "@/lib/formatDuration";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { Clock, Play } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import PlaylistForm from "./PlaylistForm";

const CreatePlaylist = () => {
  const [searchInput, setSearchInput] = useState("");
  const [toggleEditForm, setToggleEditForm] = useState(false);

  const { searchSongs, songsSearching } = useMusicStore();
  const {
    addSongToPlaylist,
    getSongsInPlaylist,
    songsInPlaylist,
    removeSongFromPlaylist,
    deletePlaylist,
    detailPlaylist,
    playlists,
    togglePlaylistVisibility,
    getDeatilPlaylist,
  } = usePlaylistStore();
  const { currentSong, isPlaying, playAlbum } = usePlayerStore();
  const handlePlaySong = (index: number) => {
    playAlbum(songsInPlaylist, index);
  };
  const { id } = useParams();
  const playlistId = id?.toString();
  const navigate = useNavigate();
  useEffect(() => {
    getSongsInPlaylist(playlistId!);
    getDeatilPlaylist(playlistId!);
  }, [getSongsInPlaylist, getDeatilPlaylist, playlistId]);

  console.log(playlists);
  console.log(detailPlaylist);
  const isOwner = playlists.some((item) => item._id === detailPlaylist?._id);
  console.log(isOwner);
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInput.trim() === "") {
      toast.error("Please enter the fill");
      return;
    }
    if (searchInput.trim()) {
      searchSongs(searchInput);
    }
  };

  const handleTogglePlaylistForm = () => {
    setToggleEditForm(!toggleEditForm);
  };

  return (
    <>
      {toggleEditForm ? (
        <PlaylistForm
          onToggleForm={handleTogglePlaylistForm}
          playlistId={playlistId!}
        />
      ) : null}
      <div className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
        <ScrollArea className="h-full">
          <div className="h-72 bg-neutral-800 flex items-end px-8 gap-8 py-6 relative">
            <div className="absolute top-4 right-4">
              {isOwner ? (
                <button
                  className="p-2 rounded-full bg-neutral-700/50 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300 group"
                  aria-label="Xóa playlist"
                  onClick={async () => {
                    try {
                      const res = await deletePlaylist(playlistId!);

                      if (res !== undefined) {
                        await navigate("/playlist");
                      } else {
                        console.error("Xóa playlist thất bại");
                      }
                    } catch (error) {
                      console.error("Đã xảy ra lỗi khi xóa playlist:", error);
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-800 text-xs text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Xóa playlist
                  </div>
                </button>
              ) : null}
            </div>

            <img
              className="h-52 w-52 object-cover shadow-2xl rounded-md cursor-pointer z-10"
              alt="playlist cover"
              src={detailPlaylist?.imageURL}
              onClick={isOwner ? handleTogglePlaylistForm : undefined}
            />

            <div className="flex-1 flex flex-col justify-end h-52">
              <span className="text-sm text-white/70 font-medium mb-2">
                {detailPlaylist?.isPublic ? "Public " : "Private "}
                Playlist
              </span>
              <h1 className="text-5xl font-bold text-white mb-2">
                {detailPlaylist?.title}
              </h1>
              <span className="text-white/80 text-sm">
                {detailPlaylist?.description}
              </span>
              <span className="text-white/90 text-sm font-semibold">
                device •{detailPlaylist?.user.fullName}
              </span>
              {isOwner ? (
                <div className="flex items-center space-x-4">
                  <Switch
                    id="statusPlaylist"
                    checked={detailPlaylist?.isPublic}
                    onCheckedChange={async () => {
                      await togglePlaylistVisibility(playlistId!);
                      await getDeatilPlaylist(playlistId!);
                    }}
                    className="h-7 w-14 rounded-full bg-neutral-600/50 data-[state=checked]:bg-green-500 transition-colors duration-200"
                  />
                  <Label
                    htmlFor="statusPlaylist"
                    className="text-lg font-semibold text-white/90 hover:text-white transition-colors cursor-pointer"
                  >
                    {detailPlaylist?.isPublic ? "Public" : "Private"}
                  </Label>
                </div>
              ) : null}
            </div>
          </div>
          <div className="p-8">
            {/* Table Section */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* Table Header */}
              <div className="grid grid-cols-[16px_4fr_2fr_1fr_100px] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
                <div></div>
              </div>

              {/* Songs List */}
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {songsInPlaylist?.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        onClick={() => handlePlaySong(index)}
                        className={`grid grid-cols-[16px_4fr_2fr_1fr_100px] gap-4 px-4 py-2 text-sm 
                        text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}
                      >
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isPlaying ? (
                            <div className="size-4 text-green-500">♫</div>
                          ) : (
                            <span className="group-hover:hidden">
                              {index + 1}
                            </span>
                          )}
                          {!isCurrentSong && (
                            <Play className="h-4 w-4 hidden group-hover:block" />
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <img
                            src={song.imageURL}
                            alt={song.title}
                            className="size-10"
                          />
                          <div>
                            <div className={`font-medium text-white`}>
                              {song.title}
                            </div>
                            <div>{song.artist}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {song.createdAt.split("T")[0]}
                        </div>
                        <div className="flex items-center">
                          {formatDuration(song.duration)}
                        </div>
                        <div className="flex items-center justify-end pr-2">
                          <button
                            className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 
                            transition-all duration-200 ease-in-out px-2 py-1 rounded-md hover:bg-red-500/20"
                            onClick={async (e) => {
                              e.stopPropagation();
                              await removeSongFromPlaylist(
                                playlistId!,
                                song._id
                              );
                              await getSongsInPlaylist(playlistId!);
                            }}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Suggested Songs Section */}
            <h2 className="text-xl font-bold text-white my-4">
              Seaching the songs for your playlist
            </h2>

            <div className="mb-6">
              <div className="relative w-full">
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <input
                    type="text"
                    placeholder="Looking"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full bg-neutral-800 text-white rounded px-4 py-2 pr-10 placeholder-white/60 focus:outline-none"
                  />
                </form>
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
                  ✕
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {songsSearching.map((song) => (
                <div
                  key={song._id}
                  className="flex items-center justify-between hover:bg-neutral-800 px-4 py-2 rounded"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={song.imageURL}
                      alt="cover"
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <div className="text-white font-medium text-sm">
                        {song.title}
                      </div>
                      <div className="text-white/70 text-xs">{song.artist}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-white/70 text-sm">
                      {formatDuration(song.duration)}
                    </span>
                    <button
                      className="bg-white text-black text-sm font-semibold cursor-pointer px-4 py-1 rounded-full hover:opacity-90"
                      onClick={async () => {
                        await addSongToPlaylist(playlistId!, song._id);
                        await getSongsInPlaylist(playlistId!);
                      }}
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default CreatePlaylist;
