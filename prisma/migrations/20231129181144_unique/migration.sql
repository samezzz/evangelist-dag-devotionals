/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `LikedPost` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postId]` on the table `SavedPost` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LikedPost_postId_key" ON "LikedPost"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedPost_postId_key" ON "SavedPost"("postId");
