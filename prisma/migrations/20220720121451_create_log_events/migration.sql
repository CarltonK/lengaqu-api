-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('USER');

-- CreateTable
CREATE TABLE "LogEvents" (
    "eventId" SERIAL NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "desc" VARCHAR(200),
    "remarks" VARCHAR(200),
    "eventType" "EventType" NOT NULL,

    CONSTRAINT "LogEvents_pkey" PRIMARY KEY ("eventId")
);

-- AddForeignKey
ALTER TABLE "LogEvents" ADD CONSTRAINT "LogEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "SysUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
