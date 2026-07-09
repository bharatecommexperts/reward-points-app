// app/routes/points.jsx
import db from "../db.server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, ngrok-skip-browser-warning",
};

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const customerId = url.searchParams.get("customerId");
  const shopDomain = url.searchParams.get("shop");

  if (!customerId || !shopDomain) {
    return Response.json(
      { error: "Missing required parameters" },
      { status: 400, headers: corsHeaders }
    );
  }

  const customerPoints = await db.customerPoints.findUnique({
    where: {
      shop_customerId: { shop: shopDomain, customerId },
    },
  });

  const settings = await db.rewardSettings.findUnique({
    where: { shop: shopDomain },
  });

  const totalPoints = customerPoints?.totalPoints || 0;
  const rupeesPerPoint = settings?.rupeesPerPoint || 0.1;
  const minPointsToRedeem = settings?.minPointsToRedeem || 100;
  const discountValue = totalPoints * rupeesPerPoint;

  return Response.json(
    {
      totalPoints,
      discountValue,
      minPointsToRedeem,
      canRedeem: totalPoints >= minPointsToRedeem,
    },
    { headers: corsHeaders }
  );
};