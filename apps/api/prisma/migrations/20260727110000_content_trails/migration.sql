-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('VIDEO');

-- CreateTable
CREATE TABLE "video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "youtubeUrl" TEXT NOT NULL,
    "durationInSeconds" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trail" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trail_item" (
    "id" TEXT NOT NULL,
    "trailId" TEXT NOT NULL,
    "contentType" "ContentType" NOT NULL,
    "contentId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trail_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trail_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trailId" TEXT NOT NULL,
    "completionPercentage" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "lastViewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trail_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trail_item_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trailId" TEXT NOT NULL,
    "trailItemId" TEXT,
    "contentType" "ContentType" NOT NULL,
    "contentId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trail_item_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "video_title_idx" ON "video"("title");

-- CreateIndex
CREATE INDEX "video_isActive_deletedAt_createdAt_idx" ON "video"("isActive", "deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "trail_isPublished_deletedAt_createdAt_idx" ON "trail"("isPublished", "deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "trail_isActive_deletedAt_createdAt_idx" ON "trail"("isActive", "deletedAt", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "trail_item_trailId_position_active_key" ON "trail_item"("trailId", "position") WHERE "deletedAt" IS NULL;

-- CreateIndex
CREATE INDEX "trail_item_trailId_deletedAt_position_idx" ON "trail_item"("trailId", "deletedAt", "position");

-- CreateIndex
CREATE INDEX "trail_item_contentType_contentId_idx" ON "trail_item"("contentType", "contentId");

-- CreateIndex
CREATE UNIQUE INDEX "trail_progress_userId_trailId_key" ON "trail_progress"("userId", "trailId");

-- CreateIndex
CREATE INDEX "trail_progress_userId_updatedAt_idx" ON "trail_progress"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "trail_progress_trailId_isCompleted_idx" ON "trail_progress"("trailId", "isCompleted");

-- CreateIndex
CREATE UNIQUE INDEX "trail_item_progress_userId_trailItemId_key" ON "trail_item_progress"("userId", "trailItemId");

-- CreateIndex
CREATE INDEX "trail_item_progress_userId_trailId_viewedAt_idx" ON "trail_item_progress"("userId", "trailId", "viewedAt");

-- CreateIndex
CREATE INDEX "trail_item_progress_trailId_contentType_contentId_idx" ON "trail_item_progress"("trailId", "contentType", "contentId");

-- CreateIndex
CREATE INDEX "trail_item_progress_contentType_contentId_idx" ON "trail_item_progress"("contentType", "contentId");

-- AddForeignKey
ALTER TABLE "trail_item" ADD CONSTRAINT "trail_item_trailId_fkey" FOREIGN KEY ("trailId") REFERENCES "trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trail_progress" ADD CONSTRAINT "trail_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trail_progress" ADD CONSTRAINT "trail_progress_trailId_fkey" FOREIGN KEY ("trailId") REFERENCES "trail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trail_item_progress" ADD CONSTRAINT "trail_item_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trail_item_progress" ADD CONSTRAINT "trail_item_progress_trailId_fkey" FOREIGN KEY ("trailId") REFERENCES "trail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trail_item_progress" ADD CONSTRAINT "trail_item_progress_trailItemId_fkey" FOREIGN KEY ("trailItemId") REFERENCES "trail_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;