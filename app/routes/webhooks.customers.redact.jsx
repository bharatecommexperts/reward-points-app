// app/routes/webhooks.customers.redact.jsx

import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { shop, payload } = await authenticate.webhook(request);

  const customerId = payload.customer?.id?.toString();

  console.log(`Redact request for customer ${customerId} from ${shop}`);

  if (customerId) {
    // Customer ke saare points aur transactions delete karo
    await db.pointsTransaction.deleteMany({
      where: { shop, customerId },
    });

    await db.customerPoints.deleteMany({
      where: { shop, customerId },
    });

    console.log(`Data deleted for customer ${customerId}`);
  }

  return new Response(null, { status: 200 });
};