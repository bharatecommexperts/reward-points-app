import db from "../db.server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, ngrok-skip-browser-warning",
};

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const customerId = url.searchParams.get("customerId");
  const shop = url.searchParams.get("shop");

  if (!customerId || !shop) {
    return Response.json(
      { error: "Missing parameters" },
      { status: 400, headers: corsHeaders }
    );
  }

  const transactions = await db.pointsTransaction.findMany({
    where: { shop, customerId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return Response.json({ transactions }, { headers: corsHeaders });
};