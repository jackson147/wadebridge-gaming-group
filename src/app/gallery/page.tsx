import { UploadModal } from "~/app/_components/UploadModal";
import { api, HydrateClient } from "~/trpc/server";
import { GalleryImage } from "./GalleryImage";

// This is an async Server Component that fetches data directly
async function ImageGallery() {
  const allPosts = await api.post.getAll();

  if (allPosts.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold">No images yet!</h2>
        <p className="text-white/80">Be the first to upload one.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {allPosts.map((post) => <GalleryImage key={post.id} post={post} />)}
    </div>
  );
}

export default async function GalleryPage() {
  return (
    <HydrateClient>
      <main className="items-center text-white">
        <div className="container mx-auto flex flex-col items-center gap-8 px-4 py-16">
          <div className="flex w-full max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Image Gallery
            </h1>
            <div className="flex items-center justify-center">
              <div className="rounded-xl bg-white/10 p-4 text-white transition hover:bg-white/20">
                {/* The UploadModal is a Client Component with the upload button */}
                <UploadModal />
              </div>
            </div>
          </div>

          <div className="w-full max-w-5xl">
            <ImageGallery />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}