import db from "../db.server";

// CORS headers jo har response mein chahiye
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, ngrok-skip-browser-warning",
};

export const loader = async ({ request }) => {
  // OPTIONS preflight request handle karo (browser pehle yeh bhejta hai)
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
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

    return Response.json(
      {
        totalPoints,
        rupeesValue: totalPoints * rupeesPerPoint,
        minPointsToRedeem,
        canRedeem: totalPoints >= minPointsToRedeem,
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("Points route error:", error);
    return Response.json(
      { error: "Server error" },
      { status: 500, headers: corsHeaders }
    );
  }
};