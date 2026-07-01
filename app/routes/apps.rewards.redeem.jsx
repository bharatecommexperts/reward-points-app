import db from "../db.server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, ngrok-skip-browser-warning",
};

export const loader = async () => {
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const action = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { customerId, shop } = body;

    if (!customerId || !shop) {
      return Response.json(
        { error: "Missing required parameters" },
        { status: 400, headers: corsHeaders }
      );
    }

    const customerPoints = await db.customerPoints.findUnique({
      where: { shop_customerId: { shop, customerId } },
    });

    const settings = await db.rewardSettings.findUnique({
      where: { shop },
    });

    if (!customerPoints || !settings) {
      return Response.json(
        { error: "Customer or settings not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    const totalPoints = customerPoints.totalPoints;
    const minPoints = settings.minPointsToRedeem;

    if (totalPoints < minPoints) {
      return Response.json(
        { error: `You need at least ${minPoints} points to redeem` },
        { status: 400, headers: corsHeaders }
      );
    }

    const discountValue = totalPoints * settings.rupeesPerPoint;
    const discountCode = `REWARD-${customerId.slice(-6)}-${Date.now().toString(36).toUpperCase()}`;

    const sessionRecord = await db.session.findFirst({
      where: { shop },
    });

    if (!sessionRecord) {
      return Response.json(
        { error: "Shop session not found" },
        { status: 401, headers: corsHeaders }
      );
    }

    // GraphQL se Basic Code Discount create karo
    const graphqlQuery = `
      mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
        discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
          codeDiscountNode {
            id
            codeDiscount {
              ... on DiscountCodeBasic {
                codes(first: 1) {
                  nodes {
                    code
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      basicCodeDiscount: {
        title: discountCode,
        code: discountCode,
        startsAt: new Date().toISOString(),
        usageLimit: 1,
        customerGets: {
          value: {
            discountAmount: {
              amount: discountValue.toFixed(2),
              appliesOnEachItem: false,
            },
          },
          items: {
            all: true,
          },
        },
        customerSelection: {
          all: true,
        },
      },
    };

    const graphqlResponse = await fetch(
      `https://${shop}/admin/api/2026-07/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": sessionRecord.accessToken,
        },
        body: JSON.stringify({ query: graphqlQuery, variables }),
      }
    );

    const graphqlData = await graphqlResponse.json();
    console.log("GraphQL response:", JSON.stringify(graphqlData));

    const userErrors = graphqlData?.data?.discountCodeBasicCreate?.userErrors;
    if (userErrors && userErrors.length > 0) {
      console.error("Discount errors:", userErrors);
      return Response.json(
        { error: userErrors[0].message },
        { status: 500, headers: corsHeaders }
      );
    }

    const createdCode = graphqlData?.data?.discountCodeBasicCreate
      ?.codeDiscountNode?.codeDiscount?.codes?.nodes?.[0]?.code;

    if (!createdCode) {
      return Response.json(
        { error: "Failed to create discount code" },
        { status: 500, headers: corsHeaders }
      );
    }

    // Points deduct karo
    await db.customerPoints.update({
      where: { shop_customerId: { shop, customerId } },
      data: { totalPoints: 0 },
    });

    // Transaction history
    await db.pointsTransaction.create({
      data: {
        shop,
        customerId,
        type: "redeem",
        points: -totalPoints,
        description: `Redeemed for discount code ${createdCode}`,
      },
    });

    return Response.json(
      {
        success: true,
        discountCode: createdCode,
        discountValue: discountValue.toFixed(2),
        pointsUsed: totalPoints,
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("Redeem error:", error);
    return Response.json(
      { error: "Server error", details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
};