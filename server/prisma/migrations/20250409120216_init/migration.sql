/*
  Warnings:

  - The values [USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Answer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `author_id` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `question_id` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `response_type` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `text_answer` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `video_url` on the `Answer` table. All the data in the column will be lost.
  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `author_id` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `shareable_link` on the `Question` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_of_birth` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hashed_password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Password_Reset_Token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Refresh_Token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserLikedCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_bookmarkedAnswerByUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_bookmarkedQuestionByUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_likedAnswerByUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_likedQuestionByUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_subsribedQuestions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `answer_Id` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionId` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surveyId` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_id` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surveyId` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('TECHNOLOGY', 'PROGRAMMING', 'WEB_DEVELOPMENT', 'MOBILE_DEVELOPMENT', 'DATA_SCIENCE', 'ARTIFICIAL_INTELLIGENCE', 'MACHINE_LEARNING', 'CYBERSECURITY', 'CLOUD_COMPUTING', 'MEDICINE');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ASKER', 'RESPONDER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_author_id_fkey";

-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_question_id_fkey";

-- DropForeignKey
ALTER TABLE "Password_Reset_Token" DROP CONSTRAINT "Password_Reset_Token_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_author_id_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Refresh_Token" DROP CONSTRAINT "Refresh_Token_user_id_fkey";

-- DropForeignKey
ALTER TABLE "_UserLikedCategories" DROP CONSTRAINT "_UserLikedCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserLikedCategories" DROP CONSTRAINT "_UserLikedCategories_B_fkey";

-- DropForeignKey
ALTER TABLE "_bookmarkedAnswerByUsers" DROP CONSTRAINT "_bookmarkedAnswerByUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_bookmarkedAnswerByUsers" DROP CONSTRAINT "_bookmarkedAnswerByUsers_B_fkey";

-- DropForeignKey
ALTER TABLE "_bookmarkedQuestionByUsers" DROP CONSTRAINT "_bookmarkedQuestionByUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_bookmarkedQuestionByUsers" DROP CONSTRAINT "_bookmarkedQuestionByUsers_B_fkey";

-- DropForeignKey
ALTER TABLE "_likedAnswerByUsers" DROP CONSTRAINT "_likedAnswerByUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_likedAnswerByUsers" DROP CONSTRAINT "_likedAnswerByUsers_B_fkey";

-- DropForeignKey
ALTER TABLE "_likedQuestionByUsers" DROP CONSTRAINT "_likedQuestionByUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_likedQuestionByUsers" DROP CONSTRAINT "_likedQuestionByUsers_B_fkey";

-- DropForeignKey
ALTER TABLE "_subsribedQuestions" DROP CONSTRAINT "_subsribedQuestions_A_fkey";

-- DropForeignKey
ALTER TABLE "_subsribedQuestions" DROP CONSTRAINT "_subsribedQuestions_B_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_pkey",
DROP COLUMN "author_id",
DROP COLUMN "id",
DROP COLUMN "question_id",
DROP COLUMN "response_type",
DROP COLUMN "text_answer",
DROP COLUMN "video_url",
ADD COLUMN     "answer_Id" INTEGER NOT NULL,
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "questionId" INTEGER NOT NULL,
ADD COLUMN     "surveyId" INTEGER NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL,
ALTER COLUMN "created_at" DROP DEFAULT,
ADD CONSTRAINT "Answer_pkey" PRIMARY KEY ("answer_Id");

-- AlterTable
ALTER TABLE "Question" DROP CONSTRAINT "Question_pkey",
DROP COLUMN "author_id",
DROP COLUMN "category_id",
DROP COLUMN "created_at",
DROP COLUMN "description",
DROP COLUMN "id",
DROP COLUMN "shareable_link",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "category" "Category" NOT NULL,
ADD COLUMN     "question_id" INTEGER NOT NULL,
ADD COLUMN     "surveyId" INTEGER NOT NULL,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("question_id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "date_of_birth",
DROP COLUMN "hashed_password",
DROP COLUMN "id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "role" DROP DEFAULT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");

-- DropTable
DROP TABLE "Categories";

-- DropTable
DROP TABLE "Password_Reset_Token";

-- DropTable
DROP TABLE "Refresh_Token";

-- DropTable
DROP TABLE "_UserLikedCategories";

-- DropTable
DROP TABLE "_bookmarkedAnswerByUsers";

-- DropTable
DROP TABLE "_bookmarkedQuestionByUsers";

-- DropTable
DROP TABLE "_likedAnswerByUsers";

-- DropTable
DROP TABLE "_likedQuestionByUsers";

-- DropTable
DROP TABLE "_subsribedQuestions";

-- DropEnum
DROP TYPE "Like_type";

-- DropEnum
DROP TYPE "Response_type";

-- CreateTable
CREATE TABLE "Survey" (
    "survey_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("survey_id")
);

-- CreateTable
CREATE TABLE "Survey_Video" (
    "servey_video_id" INTEGER NOT NULL,
    "question_link" TEXT NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "uploaderId" INTEGER NOT NULL,

    CONSTRAINT "Survey_Video_pkey" PRIMARY KEY ("servey_video_id")
);

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("survey_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey_Video" ADD CONSTRAINT "Survey_Video_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("survey_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey_Video" ADD CONSTRAINT "Survey_Video_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
