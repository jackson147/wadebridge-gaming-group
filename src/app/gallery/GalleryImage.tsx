"use client";

import Image from "next/image";
import { Fragment, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { ConfirmationModal } from "~/app/_components/ConfirmationModal";
import { api } from "~/trpc/react";
import type { GalleryPost } from "@prisma/client";
import { useSession } from "next-auth/react";

interface GalleryImageProps {
  galleryPost: GalleryPost;
  onClick: () => void;
}

export function GalleryImage({ galleryPost, onClick }: GalleryImageProps) {
  const utils = api.useUtils();
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const deleteGalleryPost = api.galleryPost.delete.useMutation({
    onSuccess: async () => {
      await utils.galleryPost.getAll.invalidate();
    },
    onError: (error: unknown) => {
      console.error("Failed to delete post:", error);
      alert("Failed to delete image. You may not be the owner.");
      setIsDeleting(false);
    },
  });

  const canDelete =
    session?.user.role === "ADMIN" ||
    session?.user?.id === galleryPost.createdById ||
    process.env.NODE_ENV === "development";

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
    deleteGalleryPost.mutate({ id: galleryPost.id });
  };

  return (
    <Fragment>
      <div className="group relative cursor-pointer" onClick={onClick}>
        <Image
          alt="gallery-image"
          src={galleryPost.imageUrl}
          width={400}
          height={400}
          className="aspect-square w-full rounded-md object-cover transition-transform group-hover:scale-105"
        />
        {canDelete && (
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-2 text-white opacity-70 transition-all hover:bg-red-600/80 disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
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
    </Fragment>
  );
}