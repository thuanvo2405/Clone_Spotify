import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { ImagePlus } from "lucide-react";
import { useState } from "react";

type PlaylistFormProps = {
  onToggleForm: () => void;
};

const PlaylistForm = ({ onToggleForm }: PlaylistFormProps) => {
  const [playlist, setPlaylist] = useState({
    title: "",
    description: "",
    imageURL: "",
  });

  const { updatePlaylist, fetchMyPlaylists } = usePlaylistStore();

  const hanldeUpdatePlaylist = async () => {
    await updatePlaylist("6818e40394ecbd6e56a57806", playlist);
    await fetchMyPlaylists();

    onToggleForm();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlaylist({ ...playlist, imageURL: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#121212] text-white rounded-xl w-full max-w-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Sửa thông tin chi tiết</h2>
          <button onClick={onToggleForm} className="text-2xl">
            &times;
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="relative bg-neutral-900 hover:bg-neutral-800 flex  justify-center items-center rounded-md w-40 h-40 overflow-hidden">
            {playlist.imageURL ? (
              <>
                <img
                  src={playlist.imageURL}
                  alt="playlist"
                  className="object-cover w-full h-full"
                />
                <label
                  htmlFor="image"
                  className="w-full h-full absolute flex justify-center items-center bottom-2 left-1/2 transform -translate-x-1/2 opacity-80 py-1 px-3 text-xs text-white cursor-pointer hover:bg-gray-600"
                ></label>
              </>
            ) : (
              <>
                <label
                  htmlFor="image"
                  className="cursor-pointer bg-gray-700 py-2 px-3  border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600"
                >
                  <ImagePlus className="h-full w-full  inline-block mr-2" />
                  Upload Image
                </label>
              </>
            )}
            <input
              type="file"
              id="image"
              className="sr-only"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex flex-col flex-1 gap-2">
            <input
              type="text"
              value={playlist.title}
              onChange={(e) =>
                setPlaylist((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              className="bg-neutral-800 text-white placeholder-neutral-400 px-4 py-2 rounded focus:outline-none"
            />
            <textarea
              className="bg-neutral-800 text-white placeholder-neutral-400 px-4 py-2 rounded focus:outline-none resize-none"
              value={playlist.description}
              onChange={(e) =>
                setPlaylist((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Thêm phần mô tả không bắt buộc"
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="bg-white text-black font-medium px-6 py-2 rounded-full hover:bg-gray-300 transition"
            onClick={hanldeUpdatePlaylist}
          >
            Lưu
          </button>
        </div>

        <p className="text-xs text-neutral-400 mt-4">
          Bằng cách tiếp tục, bạn đồng ý cho phép Spotify truy cập vào hình ảnh
          bạn đã chọn để tải lên. Vui lòng đảm bảo bạn có quyền tải lên hình
          ảnh.
        </p>
      </div>
    </div>
  );
};

export default PlaylistForm;
