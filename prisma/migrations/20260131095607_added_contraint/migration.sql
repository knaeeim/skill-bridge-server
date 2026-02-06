/*
  Warnings:

  - A unique constraint covering the columns `[studentId,tutorId,date,startTime]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TutorProfile" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_studentId_tutorId_date_startTime_key" ON "Booking"("studentId", "tutorId", "date", "startTime");
