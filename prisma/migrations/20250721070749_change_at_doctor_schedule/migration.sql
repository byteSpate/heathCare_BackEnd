/*
  Warnings:

  - You are about to drop the `docotorSchedules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "docotorSchedules" DROP CONSTRAINT "docotorSchedules_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "docotorSchedules" DROP CONSTRAINT "docotorSchedules_scheduleId_fkey";

-- DropTable
DROP TABLE "docotorSchedules";

-- CreateTable
CREATE TABLE "doctorSchedules" (
    "doctorId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "appointmentId" TEXT NOT NULL,

    CONSTRAINT "doctorSchedules_pkey" PRIMARY KEY ("doctorId","scheduleId")
);

-- AddForeignKey
ALTER TABLE "doctorSchedules" ADD CONSTRAINT "doctorSchedules_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctorSchedules" ADD CONSTRAINT "doctorSchedules_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
