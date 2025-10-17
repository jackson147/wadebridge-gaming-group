"use client";

import type { Post } from "@prisma/client";
import { useState } from "react";
import { UploadModal } from "~/app/_components/UploadModal";
import { api } from "~/trpc/react";
import { GalleryImage } from "./GalleryImage";
import { ImageDetailModal } from "~/app/_components/ImageDetailModal";
import { useSession } from "next-auth/react";

function ImageGallery() {
  const { data: allPosts, isLoading } = api.post.getAll.useQuery();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { data: session } = useSession();

  if (allPosts &&allPosts.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold">No images yet!</h2>
        <p className="text-white/80">Be the first to upload one.</p>
      </div>
    );
  }

  if (isLoading) return <div>Loading...</div>;
  if (!allPosts) return <div>Something went wrong</div>;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {allPosts.map((post) => (
          <GalleryImage
            key={post.id}
            post={post}
            onClick={() => setSelectedPost(post)}
          />
        ))}
      </div>
      {selectedPost && (
        <ImageDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
}

export default function GalleryPage() {
  const { data: session } = useSession();

  return (
    <main className="items-center text-white">
      <div className="container mx-auto flex flex-col items-center gap-8 px-4 py-16">
        <div className="flex w-full max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Image Gallery
          </h1>
          {session?.user.role === "ADMIN" && (
            <UploadModal />
          )}
        </div>

        <div className="w-full max-w-5xl">
          <ImageGallery />
        </div>
      </div>
    </main>
  );
}