// src/components/UploadModal.tsx
"use client";

import imageCompression from "browser-image-compression";
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

export function UploadModal() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const utils = api.useUtils();

  const createPresignedUrl = api.galleryPost.createPresignedUrl.useMutation();
  const confirmUpload = api.galleryPost.confirmUpload.useMutation({
    onSuccess: async () => {
      // Invalidate the query to refetch the gallery data
      await utils.galleryPost.getAll.invalidate();

      // Reset state and close modal
      setFiles([]);
      setIsUploading(false);
      setIsOpen(false);
    },
    onError: (err) => {
      console.error("Upload confirmation failed:", err);
      setError("An error occurred after upload. Please try again.");
      setIsUploading(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
      setError(null); // Clear previous errors
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please select one or more files to upload.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const uploadPromises = files.map(async (file) => {
      const options = {
        maxSizeMB: 1, // (default: undefined)
        maxWidthOrHeight: 1920, // (default: undefined)
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);

        // 1. Get a presigned URL for the compressed file
        const { url, key } = await createPresignedUrl.mutateAsync({
          fileType: compressedFile.type,
        });

        // 2. Upload the file directly to Minio/S3 using the presigned URL
        const uploadResponse = await fetch(url, {
          method: "PUT",
          body: compressedFile,
          headers: {
            "Content-Type": compressedFile.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload to storage.`);
        }

        // 3. Notify your backend that the upload is complete
        await confirmUpload.mutateAsync({ key });
      } catch (err) {
        console.error(`Upload process failed:`, err);
        // We'll re-throw to be caught by Promise.allSettled
        throw new Error(`Failed to upload.`);
      }
    });

    const results = await Promise.allSettled(uploadPromises);
    const failedUploads = results.filter((r) => r.status === "rejected");

    if (failedUploads.length > 0) {
      setError(
        `${failedUploads.length} of ${files.length} uploads failed. Please try again.`,
      );
      setIsUploading(false);
    } else {
      // onSuccess of the mutation will handle the rest
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-white/10 p-4 text-white transition hover:bg-white/20"
      >
        <FaUpload className="size-5" />
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
                <DialogPanel className="relative w-full max-w-md transform overflow-hidden rounded-2xl border-2 border-white/10 bg-[#15162c] p-6 text-left align-middle text-white shadow-xl transition-all">
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
                    <div>
                      <label htmlFor="picture" className="font-semibold">Pictures</label>
                      <input id="picture" type="file" onChange={handleFileChange} accept="image/*" multiple className="mt-2 w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/10 file:text-white hover:file:bg-white/20"/>
                    </div>
                    {files.length > 0 && (
                      <div className="text-sm text-white/60">
                        <p>Selected: {files.length} file{files.length > 1 ? 's' : ''}</p>
                        <ul className="list-disc pl-5">
                          {files.map(f => <li key={f.name} className="truncate">{f.name}</li>)}
                        </ul>
                      </div>
                    )}
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
                        disabled={isUploading || files.length === 0}
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
