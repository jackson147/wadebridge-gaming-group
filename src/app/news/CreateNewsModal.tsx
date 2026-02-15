"use client";

import imageCompression from "browser-image-compression";
import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { api } from "~/trpc/react";

interface CreateNewsModalProps {
  onClose: () => void;
  post?: {
    id: string;
    title: string;
    content: string;
    images: { url: string }[];
  };
}

export function CreateNewsModal({ onClose, post }: CreateNewsModalProps) {
  const utils = api.useUtils();
  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>(
    post?.images.map((img) => img.url) ?? [],
  );
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const getPresignedUrl = api.news.createPresignedUrl.useMutation();

  const createNews = api.news.create.useMutation({
    onSuccess: async () => {
      await utils.news.getAll.invalidate();
      onClose();
    },
  });

  const updateNews = api.news.update.useMutation({
    onSuccess: async () => {
      await utils.news.getAll.invalidate();
      onClose();
    },
  });

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setImageUrls([...imageUrls, imageUrlInput.trim()]);
      setImageUrlInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        const { url, imageUrl } = await getPresignedUrl.mutateAsync({
          fileType: compressedFile.type,
        });

        await fetch(url, {
          method: "PUT",
          body: compressedFile,
          headers: { "Content-Type": compressedFile.type },
        });

        uploadedUrls.push(imageUrl);
      }
    } catch (error) {
      console.error("Upload failed", error);
      setIsUploading(false);
      return;
    }

    const finalImageUrls = [...imageUrls, ...uploadedUrls];

    if (post) {
      updateNews.mutate({
        id: post.id,
        title,
        content,
        imageUrls: finalImageUrls,
      });
    } else {
      createNews.mutate({
        title,
        content,
        imageUrls: finalImageUrls,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg bg-gray-900 p-6 shadow-xl border border-gray-800 text-white">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{post ? "Edit News Post" : "Create News Post"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-32 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Upload Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-sm text-gray-300 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
            />

            {/* Image Preview List (URLs + Files) */}
            {(imageUrls.length > 0 || files.length > 0) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {imageUrls.map((url, idx) => (
                  <div key={`url-${idx}`} className="relative h-20 w-20 overflow-hidden rounded-md border border-gray-700">
                    <img src={url} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute right-0 top-0 bg-red-500 p-1 text-xs text-white"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                {files.map((file, idx) => (
                  <div key={`file-${idx}`} className="relative h-20 w-20 overflow-hidden rounded-md border border-gray-700">
                    <img src={URL.createObjectURL(file)} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="absolute right-0 top-0 bg-red-500 p-1 text-xs text-white"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-md px-4 py-2 hover:bg-gray-800 text-gray-300">Cancel</button>
            <button
              type="submit"
              disabled={createNews.isPending || updateNews.isPending || isUploading}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {createNews.isPending || updateNews.isPending || isUploading ? "Saving..." : post ? "Update Post" : "Post News"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}