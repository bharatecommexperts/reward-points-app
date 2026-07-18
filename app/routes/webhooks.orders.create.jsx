import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { shop, payload } = await authenticate.webhook(request);

  console.log("Order Created Webhook Received:", payload.id);

  const customerId = payload.customer?.id?.toString();
  const orderTotal = parseFloat(payload.total_price);
  const orderId = payload.id.toString();

  if (!customerId) {
    console.log("No customer ID found, skipping");
    return new Response(null, { status: 200 });
  }

  // ✅ Duplicate check — same order ke points already mile hain?
  const existingTransaction = await db.pointsTransaction.findFirst({
    where: { shop, orderId, type: "earn" },
  });

  if (existingTransaction) {
    console.log(`Points already given for order ${orderId} — skipping`);
    return new Response(null, { status: 200 });
  }

  let settings = await db.rewardSettings.findUnique({
    where: { shop },
  });

  if (!settings) {
    settings = await db.rewardSettings.create({
      data: { shop },
    });
  }

  const earnedPoints = Math.floor(orderTotal * settings.pointsPerRupee);

  if (earnedPoints <= 0) {
    return new Response(null, { status: 200 });
  }

  await db.customerPoints.upsert({
    where: { shop_customerId: { shop, customerId } },
    update: { totalPoints: { increment: earnedPoints } },
    create: { shop, customerId, totalPoints: earnedPoints },
  });

  await db.pointsTransaction.create({
    data: {
      shop,
      customerId,
      orderId,
      type: "earn",
      points: earnedPoints,
      description: `Order #${orderId} ke liye points`,
    },
  });

  console.log(`${earnedPoints} points added for customer ${customerId}`);
  return new Response(null, { status: 200 });
};