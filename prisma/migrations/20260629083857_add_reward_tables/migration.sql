CREATE TABLE "RewardSettings" (
    "id" SERIAL NOT NULL,
    "shop" TEXT NOT NULL,
    "pointsPerRupee" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "rupeesPerPoint" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "minPointsToRedeem" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RewardSettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CustomerPoints" (
    "id" SERIAL NOT NULL,
    "shop" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CustomerPoints_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PointsTransaction" (
    "id" SERIAL NOT NULL,
    "shop" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderId" TEXT,
    "type" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PointsTransaction_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RewardSettings_shop_key" ON "RewardSettings"("shop");
CREATE UNIQUE INDEX "CustomerPoints_shop_customerId_key" ON "CustomerPoints"("shop", "customerId");