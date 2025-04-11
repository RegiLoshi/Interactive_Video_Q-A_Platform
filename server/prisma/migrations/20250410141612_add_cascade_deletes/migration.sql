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

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("survey_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey_Video" ADD CONSTRAINT "Survey_Video_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("survey_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey_Video" ADD CONSTRAINT "Survey_Video_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
