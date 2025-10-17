"use client";

import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { api } from "~/trpc/react";
import type { Post } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ConfirmationModal } from "~/app/_components/ConfirmationModal";

interface GalleryImageProps {
  post: Post;
  onClick: () => void;
}

export function GalleryImage({ post, onClick }: GalleryImageProps) {
  const utils = api.useUtils();
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const deletePost = api.post.delete.useMutation({
    onSuccess: async () => {
      await utils.post.getAll.invalidate();
    },
    onError: (error) => {
      console.error("Failed to delete post:", error);
      alert("Failed to delete image. You may not be the owner.");
      setIsDeleting(false);
    },
  });

  const canDelete =
    session?.user.role === "ADMIN" || session?.user?.id === post.createdById;

  const handleDeleteClick = (e: React.MouseEvent) => {
    // Stop the click from bubbling up to the parent div
    e.stopPropagation();
    if (canDelete) {
      setIsConfirmOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    setIsConfirmOpen(false);
    setIsDeleting(true);
    deletePost.mutate({ id: post.id });
  };

  return (
    <>
      <div className="group relative cursor-pointer" onClick={onClick}>
        <Image
          src={post.imageUrl}
          alt={post.name}
          width={400}
          height={400}
          className="aspect-square w-full rounded-md object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 rounded-b-md bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <p className="truncate font-semibold">{post.name}</p>
        </div>
        {canDelete && (
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-2 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-red-600/80 disabled:opacity-50"
            aria-label="Delete image"
          >
            {isDeleting ? "..." : <FaTimes className="size-4" />}
          </button>
        )}
      </div>
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Image"
        message="Are you sure you want to permanently delete this image?"
      />
    </>
  );
}