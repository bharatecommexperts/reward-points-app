// app/routes/app.customers.jsx

import { useState } from "react";
import { useLoaderData, useSubmit, useNavigation } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

// LOADER: Saare customers ke points list karo
export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const customers = await db.customerPoints.findMany({
    where: { shop },
    orderBy: { updatedAt: "desc" },
  });

  return { customers };
};

// ACTION: Manual points adjust karo (add ya deduct)
export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const formData = await request.formData();
  const customerId = formData.get("customerId");
  const adjustAmount = parseInt(formData.get("adjustAmount"));
  const reason = formData.get("reason") || "Manual adjustment by admin";

  // Customer ke points update karo
  await db.customerPoints.upsert({
    where: { shop_customerId: { shop, customerId } },
    update: { totalPoints: { increment: adjustAmount } },
    create: { shop, customerId, totalPoints: Math.max(adjustAmount, 0) },
  });

  // History mein entry banao
  await db.pointsTransaction.create({
    data: {
      shop,
      customerId,
      type: adjustAmount >= 0 ? "earn" : "redeem",
      points: adjustAmount,
      description: reason,
    },
  });

  return { success: true };
};

export default function CustomersPage() {
  const { customers } = useLoaderData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSaving = navigation.state === "submitting";

  // Kis customer ka adjust form khula hai (ek time pe ek hi)
  const [activeCustomerId, setActiveCustomerId] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [reason, setReason] = useState("");

  const handleAdjustSubmit = (customerId) => {
    const formData = new FormData();
    formData.append("customerId", customerId);
    formData.append("adjustAmount", adjustAmount);
    formData.append("reason", reason);
    submit(formData, { method: "post" });
    setActiveCustomerId(null);
    setAdjustAmount("");
    setReason("");
  };

  return (
    <s-page heading="Customer Points">
      <s-section heading={`Total Customers: ${customers.length}`}>
        {customers.length === 0 ? (
          <s-text>No customers have earned points yet.</s-text>
        ) : (
          <s-table>
            <s-table-header-row>
              <s-table-header>Customer ID</s-table-header>
              <s-table-header>Total Points</s-table-header>
              <s-table-header>Last Updated</s-table-header>
              <s-table-header>Action</s-table-header>
            </s-table-header-row>
            <s-table-body>
              {customers.map((customer) => (
                <s-table-row key={customer.id}>
                  <s-table-cell>{customer.customerId}</s-table-cell>
                  <s-table-cell>{customer.totalPoints}</s-table-cell>
                  <s-table-cell>
                    {new Date(customer.updatedAt).toLocaleDateString()}
                  </s-table-cell>
                  <s-table-cell>
                    {activeCustomerId === customer.customerId ? (
                      <s-stack direction="block" gap="tight">
                        <s-text-field
                          label="Points (+ to add, - to deduct)"
                          type="number"
                          value={adjustAmount}
                          onChange={(e) => setAdjustAmount(e.target.value)}
                        />
                        <s-text-field
                          label="Reason"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        />
                        <s-button
                          variant="primary"
                          loading={isSaving ? "" : undefined}
                          onClick={() => handleAdjustSubmit(customer.customerId)}
                        >
                          Confirm
                        </s-button>
                        <s-button onClick={() => setActiveCustomerId(null)}>
                          Cancel
                        </s-button>
                      </s-stack>
                    ) : (
                      <s-button onClick={() => setActiveCustomerId(customer.customerId)}>
                        Adjust Points
                      </s-button>
                    )}
                  </s-table-cell>
                </s-table-row>
              ))}
            </s-table-body>
          </s-table>
        )}
      </s-section>
    </s-page>
  );
}