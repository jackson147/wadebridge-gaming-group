import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { s3Client } from "~/server/api/routers/s3";
import { env } from "~/env";

export const postRouter = createTRPCRouter({
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
        Bucket: env.MINIO_BUCKET_NAME,
        Key: key,
        ContentType: input.fileType,
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      console.log(url)

      return { url, key };
    }),

  // Procedure to confirm upload and create a Post record
  confirmUpload: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const imageUrl = `${env.MINIO_ENDPOINT}/${env.MINIO_BUCKET_NAME}/${input.key}`;

      return ctx.db.post.create({
        data: {
          name: input.name,
          imageUrl,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  // Procedure to get all posts for the gallery view
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

});
