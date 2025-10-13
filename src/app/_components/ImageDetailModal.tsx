"use client";

import type { GalleryPost } from "@prisma/client";
import Image from "next/image";

interface ImageDetailModalProps {
  galleryPost: GalleryPost;
  onClose: () => void;
}

export function ImageDetailModal({ galleryPost, onClose }: ImageDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-[90vw] rounded-lg bg-gray-800 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 z-10 rounded-md bg-gray-700 px-3 py-1 text-sm font-semibold text-white transition hover:bg-gray-600"
          aria-label="Close image detail view"
        >
          Close
        </button>
        <Image
          alt="gallery-image-to-delete"
          src={galleryPost.imageUrl}
          width={1200}
          height={1200}
          className="max-h-[80vh] w-auto rounded-md object-contain"
        />
      </div>
    </div>
  );
}
