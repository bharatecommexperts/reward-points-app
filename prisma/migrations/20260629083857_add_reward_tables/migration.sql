-- CreateTable
CREATE TABLE "RewardSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "pointsPerRupee" REAL NOT NULL DEFAULT 1,
    "rupeesPerPoint" REAL NOT NULL DEFAULT 0.1,
    "minPointsToRedeem" INTEGER NOT NULL DEFAULT 100,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CustomerPoints" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PointsTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderId" TEXT,
    "type" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "RewardSettings_shop_key" ON "RewardSettings"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerPoints_shop_customerId_key" ON "CustomerPoints"("shop", "customerId");
