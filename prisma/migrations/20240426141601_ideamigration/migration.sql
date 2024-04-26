/*
  Warnings:

  - You are about to drop the column `availability` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `discovery` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `expectations` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `User` table. All the data in the column will be lost.
  - Added the required column `currentPhase` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idea` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "availability",
DROP COLUMN "discovery",
DROP COLUMN "expectations",
DROP COLUMN "profileImage",
ADD COLUMN     "currentPhase" TEXT NOT NULL,
ADD COLUMN     "idea" TEXT NOT NULL;
