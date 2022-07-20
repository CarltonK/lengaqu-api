-- DropForeignKey
ALTER TABLE "LogCode" DROP CONSTRAINT "LogCode_userId_fkey";

-- AddForeignKey
ALTER TABLE "LogCode" ADD CONSTRAINT "LogCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "SysUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
