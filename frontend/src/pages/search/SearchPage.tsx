import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDuration } from "@/lib/formatDuration";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Play } from "lucide-react";
import NotFound from "./components/NotFound";
const SearchPage = () => {
  const { isLoading, songsSearching } = useMusicStore();
  const { currentSong, isPlaying, setCurrentSong } = usePlayerStore();
  if (isLoading) return null;

  const handlePlaySong = (index: number) => {
    const song = songsSearching[index];
    setCurrentSong(song); // Cập nhật bài hát hiện tại từ state
  };

  return (
    <>
      <Topbar />
      {songsSearching.length !== 0 ? (
        <div className="h-full bg-black text-white mt-4">
          <ScrollArea className="h-full rounded-md">
            {/* Main Content */}
            <div className="relative min-h-full">
              {/* bg gradient */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-[#1DB954]/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative z-10">
                <div className="bg-black/50 backdrop-blur-md">
                  <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-8 py-4 text-sm text-zinc-400 border-b border-white/10">
                    <div className="font-semibold">#</div>
                    <div className="font-semibold">Title</div>
                    <div className="font-semibold">Released Date</div>
                    <div className="font-semibold">
                      <Clock className="h-5 w-5 text-zinc-400" />
                    </div>
                  </div>
                  {/* songs list */}
                  <div>
                    <div className="space-y-4 py-6 ">
                      {songsSearching?.map((song, index) => {
                        const isCurrentSong = currentSong?._id === song._id;
                        return (
                          <div
                            key={song._id}
                            onClick={() => handlePlaySong(index)}
                            className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-6 py-3 text-sm text-zinc-300 hover:bg-white/10 rounded-md group cursor-pointer transition duration-200`}
                          >
                            <div className="flex items-center justify-center">
                              {isCurrentSong && isPlaying ? (
                                <div className="text-green-500 text-xl">♫</div>
                              ) : (
                                <span className="group-hover:hidden">
                                  {index + 1}
                                </span>
                              )}
                              {!isCurrentSong && (
                                <Play className="h-4 w-4 hidden group-hover:block" />
                              )}
                            </div>

                            <div className="flex items-center gap-4">
                              <img
                                src={song.imageURL}
                                alt={song.title}
                                className="w-12 h-12 rounded-md object-cover"
                              />

                              <div>
                                <div className="font-medium text-white">
                                  {song.title}
                                </div>
                                <div className="text-sm text-zinc-400">
                                  {song.artist}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center text-zinc-400">
                              {song.createdAt.split("T")[0]}
                            </div>
                            <div className="flex items-center text-zinc-400">
                              {formatDuration(song.duration)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
};
export default SearchPage;
