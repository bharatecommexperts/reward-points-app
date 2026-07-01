// app/routes/webhooks.shop.redact.jsx

import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { shop } = await authenticate.webhook(request);

  console.log(`Shop redact request from ${shop}`);

  // Shop ka saara data delete karo
  await db.pointsTransaction.deleteMany({ where: { shop } });
  await db.customerPoints.deleteMany({ where: { shop } });
  await db.rewardSettings.deleteMany({ where: { shop } });

  console.log(`All data deleted for shop ${shop}`);

  return new Response(null, { status: 200 });
};