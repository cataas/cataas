/*
  Warnings:

  - Added the required column `size` to the `Cat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cat" ADD COLUMN     "size" INTEGER NOT NULL;
