/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `LikedPost` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `SavedPost` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "LikedPost_userId_postId_key";

-- DropIndex
DROP INDEX "SavedPost_userId_postId_key";

-- CreateIndex
CREATE UNIQUE INDEX "LikedPost_id_key" ON "LikedPost"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SavedPost_id_key" ON "SavedPost"("id");
