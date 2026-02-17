"use client";

import Image from "next/image";
import { useState } from "react";
import { FaTimes, FaEdit } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { ConfirmationModal } from "~/app/_components/ConfirmationModal";
import { CreateNewsModal } from "./CreateNewsModal";
import type { NewsPost, NewsImage } from "@prisma/client";

type NewsPostWithRelations = NewsPost & {
  images: NewsImage[];
  createdBy: { name: string | null; image: string | null };
};

interface NewsPostItemProps {
  post: NewsPostWithRelations;
}

export function NewsPostItem({ post }: NewsPostItemProps) {
  const { data: session } = useSession();
  const utils = api.useUtils();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const deletePost = api.news.delete.useMutation({
    onSuccess: async () => {
      await utils.news.getAll.invalidate();
      setIsDeleting(false);
      setIsConfirmOpen(false);
    },
    onError: (error) => {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post.");
      setIsDeleting(false);
    },
  });

  const canDelete = session?.user.role === "ADMIN" ||
            process.env.NODE_ENV === "development";

  const handleDelete = () => {
    setIsDeleting(true);
    deletePost.mutate({ id: post.id });
  };

  return (
    <div className="relative flex flex-col gap-4 rounded-xl bg-gray-100/50 p-6 shadow-sm transition hover:bg-gray-200/50 dark:bg-white/10 dark:hover:bg-white/20">
      {canDelete && (
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-muted-foreground hover:text-blue-500"
            aria-label="Edit post"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="text-muted-foreground hover:text-red-500"
            aria-label="Delete post"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">
          {post.title}
        </h2>
        <div className="text-sm text-muted-foreground">
          <span>{post.createdBy.name ?? "Unknown"}</span>
          <span className="mx-2">•</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              dateStyle: "long",
            })}
          </span>
        </div>
      </div>

      <p className="whitespace-pre-wrap text-foreground/90">
        {post.content}
      </p>

      {post.images.length > 0 && (
        <div className={`grid gap-4 ${post.images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
          {post.images.map((img) => (
            <div
              key={img.id}
              className="relative aspect-video w-full overflow-hidden rounded-md cursor-pointer transition hover:opacity-90"
              onClick={() => setSelectedImage(img.url)}
            >
              <Image
                src={img.url}
                alt="News image"
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 text-white/70 hover:text-white"
            aria-label="Close preview"
          >
            <FaTimes size={30} />
          </button>
          <div className="relative h-full w-full max-h-[90vh] max-w-7xl">
            <Image
              src={selectedImage}
              alt="Full size preview"
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <CreateNewsModal
          post={post}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete News Post"
        message="Are you sure you want to delete this news post? This action cannot be undone."
      />
    </div>
  );
}