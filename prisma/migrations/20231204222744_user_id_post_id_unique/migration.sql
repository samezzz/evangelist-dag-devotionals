/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `LikedPost` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,postId]` on the table `SavedPost` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LikedPost_userId_postId_key" ON "LikedPost"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedPost_userId_postId_key" ON "SavedPost"("userId", "postId");
