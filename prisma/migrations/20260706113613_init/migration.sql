/*
  Warnings:

  - You are about to alter the column `createdAt` on the `CustomerPoints` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("timestamp(3)")` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `CustomerPoints` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("timestamp(3)")` to `DateTime`.
  - You are about to alter the column `createdAt` on the `PointsTransaction` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("timestamp(3)")` to `DateTime`.
  - You are about to alter the column `createdAt` on the `RewardSettings` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("timestamp(3)")` to `DateTime`.
  - You are about to alter the column `pointsPerRupee` on the `RewardSettings` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("double precision")` to `Float`.
  - You are about to alter the column `rupeesPerPoint` on the `RewardSettings` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("double precision")` to `Float`.
  - You are about to alter the column `updatedAt` on the `RewardSettings` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("timestamp(3)")` to `DateTime`.
  - You are about to alter the column `expires` on the `Session` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("timestamp(3)")` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CustomerPoints" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_CustomerPoints" ("createdAt", "customerId", "id", "shop", "totalPoints", "updatedAt") SELECT "createdAt", "customerId", "id", "shop", "totalPoints", "updatedAt" FROM "CustomerPoints";
DROP TABLE "CustomerPoints";
ALTER TABLE "new_CustomerPoints" RENAME TO "CustomerPoints";
CREATE UNIQUE INDEX "CustomerPoints_shop_customerId_key" ON "CustomerPoints"("shop", "customerId");
CREATE TABLE "new_PointsTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderId" TEXT,
    "type" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_PointsTransaction" ("createdAt", "customerId", "description", "id", "orderId", "points", "shop", "type") SELECT "createdAt", "customerId", "description", "id", "orderId", "points", "shop", "type" FROM "PointsTransaction";
DROP TABLE "PointsTransaction";
ALTER TABLE "new_PointsTransaction" RENAME TO "PointsTransaction";
CREATE TABLE "new_RewardSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "pointsPerRupee" REAL NOT NULL DEFAULT 1,
    "rupeesPerPoint" REAL NOT NULL DEFAULT 0.1,
    "minPointsToRedeem" INTEGER NOT NULL DEFAULT 100,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_RewardSettings" ("createdAt", "id", "minPointsToRedeem", "pointsPerRupee", "rupeesPerPoint", "shop", "updatedAt") SELECT "createdAt", "id", "minPointsToRedeem", "pointsPerRupee", "rupeesPerPoint", "shop", "updatedAt" FROM "RewardSettings";
DROP TABLE "RewardSettings";
ALTER TABLE "new_RewardSettings" RENAME TO "RewardSettings";
CREATE UNIQUE INDEX "RewardSettings_shop_key" ON "RewardSettings"("shop");
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" DATETIME,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "refreshToken" TEXT,
    "refreshTokenExpires" DATETIME
);
INSERT INTO "new_Session" ("accessToken", "accountOwner", "collaborator", "email", "emailVerified", "expires", "firstName", "id", "isOnline", "lastName", "locale", "refreshToken", "refreshTokenExpires", "scope", "shop", "state", "userId") SELECT "accessToken", "accountOwner", "collaborator", "email", "emailVerified", "expires", "firstName", "id", "isOnline", "lastName", "locale", "refreshToken", "refreshTokenExpires", "scope", "shop", "state", "userId" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
