import { z } from "zod";
import { randomUUID } from "crypto";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { env } from "~/env";
import { s3Client } from "~/server/api/routers/s3";

export const newsRouter = createTRPCRouter({
  // Procedure to get a presigned URL for uploading a file
  createPresignedUrl: protectedProcedure
    .input(z.object({ fileType: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const id = randomUUID();
      // A simple split might be risky if the file type is complex.
      // Consider a more robust way to get the extension.
      const ex = input.fileType.split("/")[1] ?? "";
      const key = `${id}.${ex}`;

      const command = new PutObjectCommand({
        Bucket: env.MINIO_NEWS_BUCKET_NAME,
        Key: key,
        ContentType: input.fileType,
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      console.log(url)

      return {
        url,
        key,
        imageUrl: `${env.MINIO_ENDPOINT}/${env.MINIO_NEWS_BUCKET_NAME}/${key}`,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        content: z.string().min(1, "Content is required"),
        imageUrls: z.array(z.string().url()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.newsPost.create({
        data: {
          title: input.title,
          content: input.content,
          createdById: ctx.session.user.id,
          images: {
            create: input.imageUrls.map((url) => ({ url })),
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Title is required"),
        content: z.string().min(1, "Content is required"),
        imageUrls: z.array(z.string().url()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.newsPost.findUnique({
        where: { id: input.id },
        include: { images: true },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "News post not found",
        });
      }

      const imagesToDelete = post.images.filter(
        (img) => !input.imageUrls.includes(img.url),
      );

      await Promise.all(
        imagesToDelete.map(async (image) => {
          const key = image.url.split("/").pop();
          if (key) {
            const command = new DeleteObjectCommand({
              Bucket: env.MINIO_NEWS_BUCKET_NAME,
              Key: key,
            });
            await s3Client.send(command).catch(console.error);
          }
        }),
      );

      return ctx.db.newsPost.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
          images: {
            deleteMany: {},
            create: input.imageUrls.map((url) => ({ url })),
          },
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.newsPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        createdBy: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.newsPost.findUnique({
        where: { id: input.id },
        include: { images: true },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "News post not found",
        });
      }

      await Promise.all(
        post.images.map(async (image) => {
          const key = image.url.split("/").pop();
          if (key) {
            const command = new DeleteObjectCommand({
              Bucket: env.MINIO_NEWS_BUCKET_NAME,
              Key: key,
            });
            await s3Client.send(command);
          }
        }),
      );

      return ctx.db.newsPost.delete({
        where: { id: input.id },
      });
    }),
});