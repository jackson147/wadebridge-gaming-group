// src/components/UploadModal.tsx
"use client";

import imageCompression from "browser-image-compression";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { FaFileImage, FaUpload } from "react-icons/fa";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <FaUpload className="mr-2 size-5" />
          <span>Upload Image</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a new image</DialogTitle>
          <DialogDescription>
            Select a file from your device to upload to the gallery.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <label
            htmlFor="picture"
            className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-background p-8 text-center transition hover:bg-accent"
          >
            <FaUpload className="size-8 text-muted-foreground" />
            <span className="font-semibold text-muted-foreground">
              Click to upload or drag and drop
            </span>
            <p className="text-xs text-muted-foreground">
              Maximum file size 1MB
            </p>
            <Input
              id="picture"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
          {files.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <p>
                Selected: {files.length} file{files.length > 1 ? "s" : ""}
              </p>
              <ul className="mt-2 grid gap-2">
                {files.map((f, index) => (
                  <li key={f.name} className="truncate">
                    {f.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading || files.length === 0}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
