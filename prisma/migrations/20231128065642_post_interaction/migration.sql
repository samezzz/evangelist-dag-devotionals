/*
  Warnings:

  - You are about to drop the `PostLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostSave` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Posts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostLike" DROP CONSTRAINT "PostLike_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostLike" DROP CONSTRAINT "PostLike_userId_fkey";

-- DropForeignKey
ALTER TABLE "PostSave" DROP CONSTRAINT "PostSave_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostSave" DROP CONSTRAINT "PostSave_userId_fkey";

-- DropTable
DROP TABLE "PostLike";

-- DropTable
DROP TABLE "PostSave";

-- DropTable
DROP TABLE "Posts";

-- CreateTable
CREATE TABLE "LikedPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "LikedPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "SavedPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LikedPost" ADD CONSTRAINT "LikedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
