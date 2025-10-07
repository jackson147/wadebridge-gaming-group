import Image from "next/image";
import { UploadModal } from "~/app/_components/UploadModal";
import { api } from "~/trpc/server";

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
      {allPosts.map((post) => (
        <div key={post.id} className="group relative">
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
        </div>
      ))}
    </div>
  );
}

export default async function GalleryPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
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
  );
}