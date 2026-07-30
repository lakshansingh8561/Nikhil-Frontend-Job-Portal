import { useState } from "react";
import { FiCamera, FiPlus, FiTrash2 } from "react-icons/fi";

interface CompanyGalleryProps {
  officeImages: string[];
  onAddImage: (url: string) => void;
  onRemoveImage: (index: number) => void;
}

export const CompanyGallery = ({
  officeImages,
  onAddImage,
  onRemoveImage,
}: CompanyGalleryProps) => {
  const [imageUrlInput, setImageUrlInput] = useState("");

  const handleAdd = () => {
    if (imageUrlInput.trim()) {
      onAddImage(imageUrlInput.trim());
      setImageUrlInput("");
    }
  };

  return (
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-[#05264E] mb-2 flex items-center gap-2 border-b border-[#F0F4FC] pb-3">
        <FiCamera className="text-[#3C65F5]" /> Office & Culture Photos Gallery
      </h3>
      <p className="text-xs text-[#66789C] mb-6">
        Add high-resolution image URLs showcasing your workspace, team events, and office environment.
      </p>

      {/* Input Box */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          value={imageUrlInput}
          onChange={(e) => setImageUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="https://example.com/office-photo.jpg"
          className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
        />

        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-5 py-3 text-xs font-semibold text-white shadow-xs transition hover:bg-[#254BD6] shrink-0 cursor-pointer"
        >
          <FiPlus className="text-base" /> Add Image
        </button>
      </div>

      {/* Preview Grid */}
      {officeImages.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {officeImages.map((imgUrl, index) => (
            <div
              key={`${imgUrl}-${index}`}
              className="group relative h-36 w-full rounded-2xl border border-[#EAEFF7] bg-gray-100 overflow-hidden shadow-xs"
            >
              <img
                src={imgUrl}
                alt={`Office ${index + 1}`}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="rounded-full bg-red-600 p-2 text-white shadow-lg transition hover:bg-red-700 cursor-pointer"
                  title="Remove Image"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-[#F8FAFC] p-8 text-center">
          <FiCamera className="mx-auto text-3xl text-gray-300 mb-2" />
          <p className="text-xs font-semibold text-[#66789C]">
            No office images added yet. Add image URLs above to showcase your workplace!
          </p>
        </div>
      )}
    </div>
  );
};
