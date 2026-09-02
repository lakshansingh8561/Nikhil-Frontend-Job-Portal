import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiArrowLeft, FiCheck, FiPlus, FiTrash2, FiCopy, FiImage, FiAlignLeft, FiAlignRight } from "react-icons/fi";
import { useCreateBlogMutation, useGetBlogCategoriesQuery, useUploadBlogMediaMutation } from "../api/blogsApi";
import { useAppSelector } from "../../../hooks/useAppSelector";

interface ContentImageItem {
  url: string;
  public_id?: string;
  fileName?: string;
}

export const CreateBlogPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const rolePath = user?.role === "ADMIN" ? "/admin" : user?.role === "RECRUITER" ? "/recruiter" : "/job-seeker";

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  
  // Cover Photo
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  
  // Multiple Content Images
  const [uploadedImages, setUploadedImages] = useState<ContentImageItem[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const { data: categories } = useGetBlogCategoriesQuery();
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const [uploadMedia] = useUploadBlogMediaMutation();

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("Cover image file size cannot exceed 10MB");
        return;
      }
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setErrorMsg("");
    }
  };

  const handleContentImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingMedia(true);
    setErrorMsg("");

    try {
      const newUploaded: ContentImageItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await uploadMedia(formData).unwrap();
        if (res?.url) {
          newUploaded.push({
            url: res.url,
            public_id: res.public_id,
            fileName: file.name,
          });
        }
      }

      setUploadedImages((prev) => [...prev, ...newUploaded]);
    } catch (err: any) {
      console.error("Content media upload error:", err);
      setErrorMsg(err?.data?.message || err?.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const insertImageWithOptions = (
    imageUrl: string,
    styleChoice: "full" | "medium" | "small" | "left" | "right",
    fileName?: string
  ) => {
    let classNames = "w-full rounded-2xl my-6 object-cover";
    if (styleChoice === "medium") classNames = "w-3/4 mx-auto block rounded-2xl my-6 object-cover";
    if (styleChoice === "small") classNames = "w-1/2 mx-auto block rounded-2xl my-6 object-cover";
    if (styleChoice === "left") classNames = "w-full sm:w-1/2 sm:float-left sm:mr-6 mb-4 rounded-2xl object-cover";
    if (styleChoice === "right") classNames = "w-full sm:w-1/2 sm:float-right sm:ml-6 mb-4 rounded-2xl object-cover";

    const imgTag = `\n<img src="${imageUrl}" alt="${fileName || "Blog Image"}" class="${classNames}" />\n`;
    setContent((prev) => prev + imgTag);
  };

  const copyImageTag = (imageUrl: string, index: number) => {
    const imgTag = `<img src="${imageUrl}" class="w-full rounded-2xl my-6" />`;
    navigator.clipboard.writeText(imgTag);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const removeContentImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim() || !category) {
      setErrorMsg("Please fill in all required fields (Title, Excerpt, Category, Content)");
      return;
    }

    if (!coverFile) {
      setErrorMsg("Please select a cover image for the blog post");
      return;
    }

    try {
      setErrorMsg("");
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("excerpt", excerpt.trim());
      formData.append("content", content.trim());
      formData.append("category", category);
      formData.append("status", status);

      if (tagsInput.trim()) {
        const parsedTags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
        formData.append("tags", JSON.stringify(parsedTags));
      }

      formData.append("coverImage", coverFile);

      await createBlog(formData).unwrap();
      navigate(`${rolePath}/blogs`);
    } catch (err: any) {
      console.error("Failed to create blog:", err);
      setErrorMsg(err?.data?.message || err?.message || "Failed to create blog post. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`${rolePath}/blogs`)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            <FiArrowLeft className="text-base" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#05264E]">Create New Blog Post</h1>
            <p className="text-xs text-slate-500">Publish career advice, news, or industry insights.</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-[#05264E] uppercase tracking-wider mb-2">
            Blog Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. 21 Job Interview Tips: How To Make a Great Impression"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-[#05264E] focus:outline-none focus:border-[#3C65F5] transition"
            required
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-bold text-[#05264E] uppercase tracking-wider mb-2">
            Short Excerpt / Summary <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            placeholder="A brief 1-2 sentence summary of your article shown on blog cards..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-[#05264E] focus:outline-none focus:border-[#3C65F5] transition resize-none"
            required
          />
        </div>

        {/* Category & Tags Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#05264E] uppercase tracking-wider mb-2">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-[#05264E] focus:outline-none focus:border-[#3C65F5] transition"
              required
            >
              <option value="">Select Category</option>
              {categories?.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
              <option value="Career">Career</option>
              <option value="Interview">Interview</option>
              <option value="Job Search">Job Search</option>
              <option value="Workplace">Workplace</option>
              <option value="Technology">Technology</option>
              <option value="Remote Work">Remote Work</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#05264E] uppercase tracking-wider mb-2">
              Tags (Comma Separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Interview, Career, Resume"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-[#05264E] focus:outline-none focus:border-[#3C65F5] transition"
            />
          </div>
        </div>

        {/* 1. Primary Cover Image Upload */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <label className="block text-xs font-extrabold text-[#05264E] uppercase tracking-wider">
            1. Main Cover Photo <span className="text-rose-500">*</span>
          </label>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-dashed border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer shadow-xs">
              <FiUpload className="text-base text-[#3C65F5]" />
              <span>{coverFile ? "Change Cover Image" : "Upload Main Cover Photo"}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverChange}
                className="hidden"
              />
            </label>
            {coverFile && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <FiCheck /> {coverFile.name} ({(coverFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            )}
          </div>

          {coverPreview && (
            <div className="mt-3 relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 bg-white">
              <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* 2. Multiple Article Content Images Upload with Personal Size & Placement Choice */}
        <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="block text-xs font-extrabold text-[#05264E] uppercase tracking-wider">
                2. Article Content Photos & Custom Size Placement
              </label>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Upload photos, pick your personal choice of size (Full, 75%, 50%, Float Left/Right) and insert anywhere in your article!
              </p>
            </div>

            <label className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#3C65F5] text-white text-xs font-bold hover:bg-[#254BD6] transition cursor-pointer shadow-xs">
              <FiPlus className="text-base" />
              <span>{isUploadingMedia ? "Uploading Images..." : "Upload Photos"}</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleContentImagesUpload}
                disabled={isUploadingMedia}
                className="hidden"
              />
            </label>
          </div>

          {/* Uploaded Gallery Grid with Size & Alignment Insertion */}
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {uploadedImages.map((img, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-indigo-100 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="w-full h-40 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={img.url} alt={`Content Image ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Insert Into Article With Personal Size Choice:
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => insertImageWithOptions(img.url, "full", img.fileName)}
                        className="px-2 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        title="Insert Full Width Image"
                      >
                        <FiImage /> 100% Width
                      </button>

                      <button
                        type="button"
                        onClick={() => insertImageWithOptions(img.url, "medium", img.fileName)}
                        className="px-2 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        title="Insert 75% Centered Image"
                      >
                        75% Center
                      </button>

                      <button
                        type="button"
                        onClick={() => insertImageWithOptions(img.url, "small", img.fileName)}
                        className="px-2 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        title="Insert 50% Centered Image"
                      >
                        50% Center
                      </button>

                      <button
                        type="button"
                        onClick={() => insertImageWithOptions(img.url, "left", img.fileName)}
                        className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        title="Float Left with Text Wrap"
                      >
                        <FiAlignLeft /> Float Left
                      </button>

                      <button
                        type="button"
                        onClick={() => insertImageWithOptions(img.url, "right", img.fileName)}
                        className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        title="Float Right with Text Wrap"
                      >
                        <FiAlignRight /> Float Right
                      </button>

                      <button
                        type="button"
                        onClick={() => copyImageTag(img.url, idx)}
                        className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {copiedIndex === idx ? (
                          <span className="text-emerald-600 font-bold">Copied!</span>
                        ) : (
                          <>
                            <FiCopy /> Copy Tag
                          </>
                        )}
                      </button>
                    </div>

                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeContentImage(idx)}
                        className="text-[11px] text-rose-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <FiTrash2 className="text-xs" /> Remove Photo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Article Body Content Textarea */}
        <div>
          <label className="block text-xs font-bold text-[#05264E] uppercase tracking-wider mb-2">
            Blog Body Content <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={14}
            placeholder="Write your blog article here using paragraphs or HTML formatting..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-[#05264E] focus:outline-none focus:border-[#3C65F5] transition font-sans"
            required
          />
        </div>

        {/* Status & Submit Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <label className="text-xs font-bold text-[#05264E] uppercase tracking-wider">Status:</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatus("published")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  status === "published"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Publish Immediately
              </button>
              <button
                type="button"
                onClick={() => setStatus("draft")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  status === "draft"
                    ? "bg-amber-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Save as Draft
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`${rolePath}/blogs`)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-[#3C65F5] text-white text-xs font-bold hover:bg-[#254BD6] transition cursor-pointer shadow-md disabled:opacity-50"
            >
              {isLoading ? "Uploading & Saving..." : status === "published" ? "Publish Blog" : "Save Draft"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPage;
