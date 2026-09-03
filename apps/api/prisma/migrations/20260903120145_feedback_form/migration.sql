-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('STARS', 'SCALE_0_10', 'LIKE_DISLIKE', 'TEXT', 'MULTIPLE_CHOICE', 'SINGLE_CHOICE');

-- AlterEnum
ALTER TYPE "ContentType" ADD VALUE 'TRAIL';

-- CreateTable
CREATE TABLE "feedback_form" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "contentType" "ContentType",
    "contentId" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_question" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "label" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_question_option" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_question_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_response" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "userId" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_answer" (
    "id" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" JSONB,
    "selectedOptionIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feedback_form_isPublished_isActive_deletedAt_createdAt_idx" ON "feedback_form"("isPublished", "isActive", "deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "feedback_form_contentType_contentId_idx" ON "feedback_form"("contentType", "contentId");

-- CreateIndex
CREATE INDEX "feedback_question_formId_position_idx" ON "feedback_question"("formId", "position");

-- CreateIndex
CREATE INDEX "feedback_question_option_questionId_position_idx" ON "feedback_question_option"("questionId", "position");

-- CreateIndex
CREATE INDEX "feedback_response_formId_createdAt_idx" ON "feedback_response"("formId", "createdAt");

-- CreateIndex
CREATE INDEX "feedback_response_userId_createdAt_idx" ON "feedback_response"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "feedback_answer_responseId_idx" ON "feedback_answer"("responseId");

-- CreateIndex
CREATE INDEX "feedback_answer_questionId_idx" ON "feedback_answer"("questionId");

-- AddForeignKey
ALTER TABLE "feedback_question" ADD CONSTRAINT "feedback_question_formId_fkey" FOREIGN KEY ("formId") REFERENCES "feedback_form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_question_option" ADD CONSTRAINT "feedback_question_option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "feedback_question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_response" ADD CONSTRAINT "feedback_response_formId_fkey" FOREIGN KEY ("formId") REFERENCES "feedback_form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_response" ADD CONSTRAINT "feedback_response_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_answer" ADD CONSTRAINT "feedback_answer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "feedback_response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_answer" ADD CONSTRAINT "feedback_answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "feedback_question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
