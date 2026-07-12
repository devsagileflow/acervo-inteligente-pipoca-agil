-- CreateTable
CREATE TABLE "analytics_event" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "pagePath" TEXT NOT NULL,
    "targetId" TEXT,
    "anonymousId" TEXT,
    "referrer" TEXT,
    "properties" JSONB,
    "occurredAt" TIMESTAMP(3),
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analytics_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analytics_event_eventName_createdAt_idx" ON "analytics_event"("eventName", "createdAt");

-- CreateIndex
CREATE INDEX "analytics_event_pagePath_createdAt_idx" ON "analytics_event"("pagePath", "createdAt");

-- CreateIndex
CREATE INDEX "analytics_event_anonymousId_createdAt_idx" ON "analytics_event"("anonymousId", "createdAt");

-- CreateIndex
CREATE INDEX "analytics_event_userId_createdAt_idx" ON "analytics_event"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "analytics_event" ADD CONSTRAINT "analytics_event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
