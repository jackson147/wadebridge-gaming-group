"use client";

import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import type { Post } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface GalleryImageProps {
  post: Post;
}

export function GalleryImage({ post }: GalleryImageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);

  const deletePost = api.post.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      console.error("Failed to delete post:", error);
      alert("Failed to delete image. You may not be the owner.");
      setIsDeleting(false);
    },
  });

  const canDelete = session?.user?.id === post.createdById;

  const handleDelete = () => {
    if (!canDelete) return;
    setIsDeleting(true);
    deletePost.mutate({ id: post.id });
  };

  return (
    <div className="group relative">
      <Image
        src={post.imageUrl}
        alt={post.name}
        width={400}
        height={400}
        className="aspect-square w-full rounded-md object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 rounded-b-md bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
        <p className="truncate font-semibold">{post.name}</p>
      </div>
      {canDelete && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-2 right-2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-red-600/80 disabled:opacity-50"
          aria-label="Delete image"
        >
          {isDeleting ? "..." : <FaTimes className="size-4" />}
        </button>
      )}
    </div>
  );
}