// src/components/UploadModal.tsx
"use client";

import { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { FaUpload, FaTimes } from "react-icons/fa";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export function UploadModal() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  // This mutation likely exists in your app to get a presigned URL from the server
  const createPresignedUrl = api.post.createPresignedUrl.useMutation();
  const confirmUpload = api.post.confirmUpload.useMutation();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null); // Clear previous errors
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    if (!name) {
      setError("Please enter a name for the image.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // 1. Get a presigned URL from our tRPC backend
      const { url, key } = await createPresignedUrl.mutateAsync({
        fileType: file.type,
      });

      // 2. Upload the file directly to Minio/S3 using the presigned URL
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to storage.");
      }

      // 3. Notify your backend that the upload is complete
      await confirmUpload.mutateAsync({ key, name });

      // 4. Reset state, close modal, and refresh data
      setFile(null);
      setName("");
      setIsUploading(false);
      setIsOpen(false);
      router.refresh(); // Refreshes server components to show the new image
    } catch (err) {
      console.error(err);
      setError("An error occurred during upload. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <FaUpload />
        <span>Upload Image</span>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#15162c] border-2 border-white/10 p-6 text-left align-middle text-white shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    Upload a new image
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-white/70">
                      Select a file from your device to upload to the gallery.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="name" className="font-semibold">Name</label>
                      <input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg bg-white/10 p-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(280,100%,70%)]"
                        placeholder="A cool image"
                      />
                      <label htmlFor="picture" className="mt-2 font-semibold">Picture</label>
                      <input id="picture" type="file" onChange={handleFileChange} accept="image/*" className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/10 file:text-white hover:file:bg-white/20"/>
                    </div>
                    {file && <p className="text-sm text-white/60">Selected: {file.name}</p>}
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    <div className="mt-4 flex justify-end gap-2">
                       <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        disabled={isUploading}
                        className="rounded-xl bg-white/10 px-5 py-2.5 font-semibold transition hover:bg-white/20 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUploading || !file || !name}
                        className="rounded-xl bg-[hsl(280,100%,70%)]/80 px-5 py-2.5 font-semibold text-white transition hover:bg-[hsl(280,100%,70%)] disabled:opacity-50"
                      >
                        {isUploading ? "Uploading..." : "Upload"}
                      </button>
                    </div>
                  </form>
                   <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="absolute top-3 right-3 rounded-full p-1.5 transition hover:bg-white/10"
                      aria-label="Close"
                    >
                      <FaTimes className="size-4" />
                    </button>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
