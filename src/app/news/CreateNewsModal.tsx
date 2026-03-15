"use client";

import imageCompression from "browser-image-compression";
import { useState } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

interface CreateNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: {
    id: string;
    title: string;
    content: string;
    images: { url: string }[];
  };
}

export function CreateNewsModal({ isOpen, onClose, post }: CreateNewsModalProps) {
  const utils = api.useUtils();
  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [imageUrls, setImageUrls] = useState<string[]>(
    post?.images.map((img) => img.url) ?? [],
  );
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const getPresignedUrl = api.news.createPresignedUrl.useMutation();

  const createNews = api.news.create.useMutation({
    onSuccess: async () => {
      await utils.news.getAll.invalidate();
      onClose();
    },
  });

  const updateNews = api.news.update.useMutation({
    onSuccess: async () => {
      await utils.news.getAll.invalidate();
      onClose();
    },
  });

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        const { url, imageUrl } = await getPresignedUrl.mutateAsync({
          fileType: compressedFile.type,
        });

        await fetch(url, {
          method: "PUT",
          body: compressedFile,
          headers: { "Content-Type": compressedFile.type },
        });

        uploadedUrls.push(imageUrl);
      }
    } catch (error) {
      console.error("Upload failed", error);
      setIsUploading(false);
      return;
    }

    const finalImageUrls = [...imageUrls, ...uploadedUrls];

    if (post) {
      updateNews.mutate({
        id: post.id,
        title,
        content,
        imageUrls: finalImageUrls,
      });
    } else {
      createNews.mutate({
        title,
        content,
        imageUrls: finalImageUrls,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{post ? "Edit News Post" : "Create News Post"}</DialogTitle>
          <DialogDescription>
            Fill in the details for the news post. You can upload images to
            accompany the post.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-input"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border-input"
              required
            />
          </div>
          <div>
            <Label htmlFor="picture-upload" className="text-sm font-medium">Images</Label>
            <Label
              htmlFor="picture-upload"
              className="relative mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-transparent p-8 text-center transition hover:bg-accent"
            >
              <FaUpload className="size-8 text-muted-foreground" />
              <span className="font-semibold text-muted-foreground">
                Click to upload or drag and drop
              </span>
              <p className="text-xs text-muted-foreground">
                Maximum file size 1MB per image
              </p>
              <Input
                id="picture-upload"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </Label>
            {(imageUrls.length > 0 || files.length > 0) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {imageUrls.map((url, idx) => (
                  <div key={`url-${idx}`} className="relative h-24 w-24">
                    <img src={url} alt="Preview" className="h-full w-full rounded-md object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-1 top-1 h-6 w-6"
                      onClick={() => handleRemoveImage(idx)}
                    >
                      <FaTimes className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {files.map((file, idx) => (
                  <div key={`file-${idx}`} className="relative h-24 w-24">
                    <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full rounded-md object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-1 top-1 h-6 w-6"
                      onClick={() => handleRemoveFile(idx)}
                    >
                      <FaTimes className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose} disabled={createNews.isPending || updateNews.isPending || isUploading}>Cancel</Button>
            <Button
              type="submit"
              disabled={createNews.isPending || updateNews.isPending || isUploading}
            >
              {createNews.isPending || updateNews.isPending || isUploading ? "Saving..." : post ? "Update Post" : "Post News"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}