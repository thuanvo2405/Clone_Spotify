import { Button } from "@/components/ui/button";
import SectionGridSkeleton from "@/pages/home/components/SectionGridSkeleton";
import { Playlist } from "@/types";
import { Link } from "react-router-dom";

type SectionGridProps = {
  title: string;
  playlists: Playlist[];
  isLoading: boolean;
};

const SectionPlaylistGrid = ({
  title,
  playlists,
  isLoading,
}: SectionGridProps) => {
  if (isLoading) return <SectionGridSkeleton />;
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        <Button
          className="text-sm text-zinc-400 hover:text-white"
          variant="link"
        >
          Show all
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {playlists.map((playlist) => (
          <Link
            to={`/playlist/${playlist._id}`}
            key={playlist._id}
            className="bg-zinc-800/40 p-4 rounded-mg hover:bg-zinc-700/40 transition-all group cursor-pointer"
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                <img
                  src={playlist.imageURL}
                  alt={playlist.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
            <h3 className="font-medium mb-2 truncate">{playlist.title}</h3>
            <p className="text-sm text-zinc-400 truncate">
              {playlist?.user.fullName}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SectionPlaylistGrid;
