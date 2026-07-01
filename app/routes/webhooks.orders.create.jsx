// app/routes/webhooks.orders.create.jsx

import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  // Step 1: Webhook ko verify karo (security check - Shopify se hi aaya hai ya nahi)
  const { shop, payload } = await authenticate.webhook(request);

  console.log("Order Created Webhook Received:", payload.id);

  // Step 2: Order ka customer ID aur total price nikalo
  const customerId = payload.customer?.id?.toString();
  const orderTotal = parseFloat(payload.total_price);
  const orderId = payload.id.toString();

  // Agar guest checkout hai (customer login nahi tha), to skip karo
  if (!customerId) {
    console.log("No customer ID found, skipping points calculation");
    return new Response(null, { status: 200 });
  }

  // Step 3: Shop ke Reward Settings nikalo (agar nahi hai to default banao)
  let settings = await db.rewardSettings.findUnique({
    where: { shop },
  });

  if (!settings) {
    settings = await db.rewardSettings.create({
      data: { shop }, // default values schema mein already defined hain
    });
  }

  // Step 4: Points calculate karo
  // Example: pointsPerRupee = 1 means 1 point per ₹1 spent
  const earnedPoints = Math.floor(orderTotal * settings.pointsPerRupee);

  if (earnedPoints <= 0) {
    return new Response(null, { status: 200 });
  }

  // Step 5: Customer ke total points update karo (ya naya record banao)
  await db.customerPoints.upsert({
    where: {
      shop_customerId: { shop, customerId }, // composite unique key
    },
    update: {
      totalPoints: { increment: earnedPoints }, // existing points mein add karo
    },
    create: {
      shop,
      customerId,
      totalPoints: earnedPoints,
    },
  });

  // Step 6: Transaction history mein entry banao
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