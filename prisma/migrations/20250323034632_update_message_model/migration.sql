/*
  Warnings:

  - You are about to drop the column `anwsered` on the `message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "message" DROP COLUMN "anwsered",
ADD COLUMN     "answered" BOOLEAN NOT NULL DEFAULT false;
