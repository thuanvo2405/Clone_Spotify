import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn } from "@clerk/clerk-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HomeIcon,
  Library,
  MessageCircle,
  Search,
  BookHeadphones,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

const LeftSidebar = () => {
  const { albums, fetchAlbums, isLoading, searchSongs } = useMusicStore();
  const [searchInputToggle, setSearchInputToggle] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInput.trim() === "") {
      toast.error("Please enter the fill");
      return;
    }
    if (searchInput.trim()) {
      searchSongs(searchInput);
      navigate(`/search`);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
          <Link
            to={"/"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800",
              })
            )}
          >
            <HomeIcon className="mr-2 size-5" />
            <span className="hidden md:inline">Home</span>
          </Link>

          <SignedIn>
            <Link
              to={"/chat"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-start text-white hover:bg-zinc-800",
                })
              )}
            >
              <MessageCircle className="mr-2 size-5" />
              <span className="hidden md:inline">Message</span>
            </Link>
          </SignedIn>
          
          <Link
            to={"/playlist"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800",
              })
            )}
          >
            <BookHeadphones className="mr-2 size-5" />
            <span className="hidden md:inline">Playlist</span>
          </Link>
          {!searchInputToggle ? (
            <button
              onClick={() => setSearchInputToggle(true)}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-start text-white hover:bg-zinc-800",
                })
              )}
            >
              <Search className="mr-2 size-5" />
              <span className="hidden md:inline">Search</span>
            </button>
          ) : (
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 size-5" />
              <input
                autoFocus
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onBlur={() => setSearchInputToggle(false)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchInputToggle(false);
                }}
                placeholder="Search..."
                className="pl-10 pr-3 py-2 w-full rounded-md bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none"
              />
            </form>
          )}
        </div>
      </div>

      <div className="flex-1 rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-white px-2">
            <Library className="size-5 mr-2" />
            <span className="hidden md:inline">Albums</span>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh - 300px)]">
          <div className="space-y-2">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              albums.map((album) => (
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer:"
                >
                  <img
                    src={album.imageURL}
                    alt="Playlist img"
                    className="size-12 rounded-md flex-shrink-0 object-cover"
                  />
                  <div className="flex-1 mix-w-0 hidden md:block">
                    <p className="font-medium truncate">{album.title}</p>
                    <p className="text-sm text-zinc-400 truncate">
                      Album · {album.artist}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LeftSidebar;
