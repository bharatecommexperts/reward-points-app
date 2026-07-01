// app/routes/webhooks.customers.data_request.jsx

import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { shop, payload } = await authenticate.webhook(request);

  // Customer ne apna data maanga hai
  const customerId = payload.customer?.id?.toString();

  console.log(`Data request received for customer ${customerId} from ${shop}`);

  // Yahan hum customer ka data collect karke unhe provide kar sakte hain
  // App Store ke liye sirf 200 return karna zaroori hai
  // Real production mein: email bhejna padega customer ko unka data

  if (customerId) {
    const points = await db.customerPoints.findUnique({
      where: { shop_customerId: { shop, customerId } },
    });

    const transactions = await db.pointsTransaction.findMany({
      where: { shop, customerId },
    });

    // Production mein: yeh data customer ko email karo
    console.log("Customer data:", { points, transactions });
  }

  return new Response(null, { status: 200 });
};