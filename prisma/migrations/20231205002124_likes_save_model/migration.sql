/*
  Warnings:

  - The primary key for the `LikedPost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `LikedPost` table. All the data in the column will be lost.
  - The primary key for the `SavedPost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SavedPost` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "LikedPost_postId_key";

-- DropIndex
DROP INDEX "SavedPost_postId_key";

-- AlterTable
ALTER TABLE "LikedPost" DROP CONSTRAINT "LikedPost_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "LikedPost_pkey" PRIMARY KEY ("userId", "postId");

-- AlterTable
ALTER TABLE "SavedPost" DROP CONSTRAINT "SavedPost_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "SavedPost_pkey" PRIMARY KEY ("userId", "postId");

-- CreateIndex
CREATE INDEX "LikedPost_userId_idx" ON "LikedPost"("userId");

-- CreateIndex
CREATE INDEX "LikedPost_postId_idx" ON "LikedPost"("postId");

-- CreateIndex
CREATE INDEX "SavedPost_userId_idx" ON "SavedPost"("userId");

-- CreateIndex
CREATE INDEX "SavedPost_postId_idx" ON "SavedPost"("postId");
