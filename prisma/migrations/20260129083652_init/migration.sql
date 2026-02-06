/*
  Warnings:

  - The `dayOfWeek` column on the `Availability` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `categoryId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TutorCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subject` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "dayOfWeek" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateEnum
CREATE TYPE "Subjects" AS ENUM ('MATH', 'SCIENCE', 'ENGLISH', 'HISTORY', 'COMPUTER_SCIENCE', 'ART', 'MUSIC', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "TutorCategory" DROP CONSTRAINT "TutorCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "TutorCategory" DROP CONSTRAINT "TutorCategory_tutorId_fkey";

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "dayOfWeek",
ADD COLUMN     "dayOfWeek" "dayOfWeek"[];

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "categoryId",
ADD COLUMN     "subject" "Subjects" NOT NULL;

-- AlterTable
ALTER TABLE "TutorProfile" ADD COLUMN     "subjects" "Subjects"[];

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "TutorCategory";
