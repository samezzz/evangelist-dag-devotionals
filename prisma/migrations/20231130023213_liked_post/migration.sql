/*
  Warnings:

  - You are about to drop the `LikedPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LikedPost" DROP CONSTRAINT "LikedPost_userId_fkey";

-- DropTable
DROP TABLE "LikedPost";

-- CreateTable
CREATE TABLE "likedPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "likedPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "likedPost_postId_key" ON "likedPost"("postId");

-- AddForeignKey
ALTER TABLE "likedPost" ADD CONSTRAINT "likedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
