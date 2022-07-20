-- CreateEnum
CREATE TYPE "LogCodeReason" AS ENUM ('REGISTRATION', 'PASSWORD_RESET', 'TRANSACTION_VERIFY');

-- CreateTable
CREATE TABLE "LogCode" (
    "codeId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "code" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP NOT NULL,
    "usedAt" TIMESTAMP,
    "codeReason" "LogCodeReason" NOT NULL,

    CONSTRAINT "LogCode_pkey" PRIMARY KEY ("codeId")
);

-- AddForeignKey
ALTER TABLE "LogCode" ADD CONSTRAINT "LogCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "SysUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
