-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT,
ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
