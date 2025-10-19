"use client";

import type { GalleryPost } from "@prisma/client";
import { Fragment, useState } from "react";
import { UploadModal } from "~/app/_components/UploadModal";
import { api } from "~/trpc/react";
import { GalleryImage } from "./GalleryImage";
import { ImageDetailModal } from "~/app/_components/ImageDetailModal";
import { useSession } from "next-auth/react";
function ImageGallery() {
  const { data: allGalleryPosts, isLoading } = api.galleryPost.getAll.useQuery();
  const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);

  const handleImageClick = (post: GalleryPost) => {
    if (window.innerWidth >= 640) { // Tailwind's `sm` breakpoint
      setSelectedPost(post);
    }
  };

  if (allGalleryPosts &&allGalleryPosts.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold">No images yet!</h2>
        <p className="text-white/80">Be the first to upload one.</p>
      </div>
    );
  }

  if (isLoading) return <div>Loading...</div>;
  if (!allGalleryPosts) return <div>Something went wrong</div>;

  return (
    <Fragment>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {allGalleryPosts.map((gPost: GalleryPost) => (
          <GalleryImage
            key={gPost.id}
            galleryPost={gPost}
            onClick={() => handleImageClick(gPost)}
          />
        ))}
      </div>
      {selectedPost && (
        <ImageDetailModal
          galleryPost={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </Fragment>
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
          {(session?.user.role === "ADMIN" ||
            process.env.NODE_ENV === "development") && (
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