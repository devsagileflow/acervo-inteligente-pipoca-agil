-- AlterTable
ALTER TABLE "trail" ADD COLUMN     "specs" TEXT[] DEFAULT ARRAY[]::TEXT[];
