/*
  Warnings:

  - You are about to drop the column `name` on the `Post` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Post_name_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "name";
