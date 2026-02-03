/*
  Warnings:

  - The values [HISTORY,COMPUTER_SCIENCE,ART,MUSIC] on the enum `Subjects` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Subjects_new" AS ENUM ('MATH', 'ENGLISH', 'SCIENCE', 'CALCULUS', 'ALGEBRA', 'GEOMETRY', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'ICT', 'ACCOUNTING', 'FINANCE', 'ECONOMICS', 'MARKETING', 'PROGRAMMING', 'WEB_DEVELOPMENT', 'DATA_SCIENCE', 'IELTS', 'ADMISSION_TEST');
ALTER TABLE "TutorProfile" ALTER COLUMN "subjects" TYPE "Subjects_new"[] USING ("subjects"::text::"Subjects_new"[]);
ALTER TABLE "Booking" ALTER COLUMN "subject" TYPE "Subjects_new" USING ("subject"::text::"Subjects_new");
ALTER TYPE "Subjects" RENAME TO "Subjects_old";
ALTER TYPE "Subjects_new" RENAME TO "Subjects";
DROP TYPE "public"."Subjects_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_bookingId_fkey";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
