/*
  Warnings:

  - A unique constraint covering the columns `[id,userId,postId]` on the table `LikedPost` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,userId,postId]` on the table `SavedPost` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "LikedPost_id_key";

-- DropIndex
DROP INDEX "SavedPost_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "LikedPost_id_userId_postId_key" ON "LikedPost"("id", "userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedPost_id_userId_postId_key" ON "SavedPost"("id", "userId", "postId");
