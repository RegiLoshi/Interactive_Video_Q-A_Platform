/*
  Warnings:

  - The primary key for the `Answer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Survey` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Survey_Video` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_surveyId_fkey";

-- DropForeignKey
ALTER TABLE "Survey" DROP CONSTRAINT "Survey_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Survey_Video" DROP CONSTRAINT "Survey_Video_surveyId_fkey";

-- DropForeignKey
ALTER TABLE "Survey_Video" DROP CONSTRAINT "Survey_Video_uploaderId_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_pkey",
ALTER COLUMN "answer_Id" DROP DEFAULT,
ALTER COLUMN "answer_Id" SET DATA TYPE TEXT,
ALTER COLUMN "authorId" SET DATA TYPE TEXT,
ALTER COLUMN "questionId" SET DATA TYPE TEXT,
ALTER COLUMN "surveyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Answer_pkey" PRIMARY KEY ("answer_Id");
DROP SEQUENCE "answer_answer_id_seq";

-- AlterTable
ALTER TABLE "Question" DROP CONSTRAINT "Question_pkey",
ALTER COLUMN "authorId" SET DATA TYPE TEXT,
ALTER COLUMN "question_id" DROP DEFAULT,
ALTER COLUMN "question_id" SET DATA TYPE TEXT,
ALTER COLUMN "surveyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("question_id");
DROP SEQUENCE "question_question_id_seq";

-- AlterTable
ALTER TABLE "Survey" DROP CONSTRAINT "Survey_pkey",
ALTER COLUMN "survey_id" DROP DEFAULT,
ALTER COLUMN "survey_id" SET DATA TYPE TEXT,
ALTER COLUMN "authorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Survey_pkey" PRIMARY KEY ("survey_id");
DROP SEQUENCE "survey_survey_id_seq";

-- AlterTable
ALTER TABLE "Survey_Video" DROP CONSTRAINT "Survey_Video_pkey",
ALTER COLUMN "servey_video_id" DROP DEFAULT,
ALTER COLUMN "servey_video_id" SET DATA TYPE TEXT,
ALTER COLUMN "surveyId" SET DATA TYPE TEXT,
ALTER COLUMN "uploaderId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Survey_Video_pkey" PRIMARY KEY ("servey_video_id");
DROP SEQUENCE "survey_video_servey_video_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "user_id" DROP DEFAULT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");
DROP SEQUENCE "user_user_id_seq";

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("survey_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey_Video" ADD CONSTRAINT "Survey_Video_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("survey_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey_Video" ADD CONSTRAINT "Survey_Video_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
