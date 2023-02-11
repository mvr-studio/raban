/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,slug]` on the table `Board` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceId,slug]` on the table `EventState` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workspaceId` to the `EventState` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Board_slug_key";

-- DropIndex
DROP INDEX "EventState_slug_key";

-- AlterTable
ALTER TABLE "Board" ALTER COLUMN "data" SET DEFAULT '{}';

-- AlterTable
ALTER TABLE "EventState" ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Board_workspaceId_slug_key" ON "Board"("workspaceId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "EventState_workspaceId_slug_key" ON "EventState"("workspaceId", "slug");

-- AddForeignKey
ALTER TABLE "EventState" ADD CONSTRAINT "EventState_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
