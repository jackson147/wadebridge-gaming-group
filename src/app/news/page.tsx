"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { CreateNewsModal } from "./CreateNewsModal";
import { NewsPostItem } from "./NewsPostItem";
import { FaPlus } from "react-icons/fa";
import { Button } from "~/components/ui/button";

export default function NewsPage() {
  const { data: session } = useSession();
  const { data: newsPosts, isLoading } = api.news.getAll.useQuery();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const canCreate = session?.user.role === "ADMIN" ||
            process.env.NODE_ENV === "development";

  return (
    <main className="items-center">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-extrabold tracking-tight">
            News Feed
          </h1>
          {canCreate && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <FaPlus className="mr-2 size-5" />
              <span>Create Post</span>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center">Loading news...</div>
        ) : !newsPosts || newsPosts.length === 0 ? (
          <div className="text-center opacity-80">No news yet.</div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {newsPosts.map((post) => (
              <NewsPostItem key={post.id} post={post} />
            ))}
          </div>
        )}
        <CreateNewsModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </main>
  );
}