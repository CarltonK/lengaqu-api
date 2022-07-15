-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMINUSER', 'CUSUSER');

-- CreateTable
CREATE TABLE "SysUser" (
    "id" SERIAL NOT NULL,
    "identificationNumber" VARCHAR(50) NOT NULL,
    "mobileNumber" VARCHAR(50) NOT NULL,
    "emailAddress" VARCHAR(200) NOT NULL,
    "firstName" VARCHAR(200),
    "lastName" VARCHAR(200),
    "password" VARCHAR(200),
    "isVerified" SMALLINT DEFAULT 0,
    "isCompliant" SMALLINT DEFAULT 0,
    "isActive" SMALLINT DEFAULT 0,
    "deviceToken" VARCHAR(200),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockedOn" TIMESTAMP,
    "blockedBy" INTEGER,
    "referralCode" VARCHAR(50),
    "userType" "UserType"[],

    CONSTRAINT "SysUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SysUser_identificationNumber_key" ON "SysUser"("identificationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SysUser_mobileNumber_key" ON "SysUser"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SysUser_emailAddress_key" ON "SysUser"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "SysUser_referralCode_key" ON "SysUser"("referralCode");
