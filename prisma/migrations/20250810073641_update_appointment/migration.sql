/*
  Warnings:

  - You are about to drop the column `docotorId` on the `appointments` table. All the data in the column will be lost.
  - Added the required column `doctorId` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_docotorId_fkey";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "docotorId",
ADD COLUMN     "doctorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
