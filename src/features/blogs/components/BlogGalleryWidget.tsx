import React from "react";

const galleryImages = [
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop&q=80",
];

export const BlogGalleryWidget: React.FC = () => {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-xs font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header with light divider line */}
      <h3 className="text-xl font-extrabold text-[#05264E] pb-3 mb-5 border-b border-slate-100 tracking-tight">
        Gallery
      </h3>

      {/* 3x3 Image Grid */}
      <div className="grid grid-cols-3 gap-3">
        {galleryImages.map((imgUrl, idx) => (
          <div
            key={idx}
            className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 group cursor-pointer"
          >
            <img
              src={imgUrl}
              alt={`Gallery item ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogGalleryWidget;
