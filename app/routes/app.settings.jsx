// app/routes/app.settings.jsx

import { useState } from "react";
import { useLoaderData, useSubmit, useNavigation } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  let settings = await db.rewardSettings.findUnique({
    where: { shop },
  });

  if (!settings) {
    settings = await db.rewardSettings.create({
      data: { shop },
    });
  }

  return { settings };
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const formData = await request.formData();
  const pointsPerRupee = parseFloat(formData.get("pointsPerRupee"));
  const rupeesPerPoint = parseFloat(formData.get("rupeesPerPoint"));
  const minPointsToRedeem = parseInt(formData.get("minPointsToRedeem"));

  await db.rewardSettings.update({
    where: { shop },
    data: { pointsPerRupee, rupeesPerPoint, minPointsToRedeem },
  });

  return { success: true };
};

export default function SettingsPage() {
  const { settings } = useLoaderData();
  const submit = useSubmit();
  const navigation = useNavigation();

  const [pointsPerRupee, setPointsPerRupee] = useState(
    String(settings.pointsPerRupee)
  );
  const [rupeesPerPoint, setRupeesPerPoint] = useState(
    String(settings.rupeesPerPoint)
  );
  const [minPointsToRedeem, setMinPointsToRedeem] = useState(
    String(settings.minPointsToRedeem)
  );

  const isSaving = navigation.state === "submitting";

  const handleSave = () => {
    const formData = new FormData();
    formData.append("pointsPerRupee", pointsPerRupee);
    formData.append("rupeesPerPoint", rupeesPerPoint);
    formData.append("minPointsToRedeem", minPointsToRedeem);
    submit(formData, { method: "post" });
  };

  return (
    <s-page heading="Reward Points Settings">
      <s-section heading="Earning Rules">
        <s-stack direction="block" gap="base">
          <s-text-field
            label="Points earned per ₹1 spent"
            type="number"
            value={pointsPerRupee}
            onChange={(e) => setPointsPerRupee(e.target.value)}
            details="Example: 1 means customer gets 1 point for every ₹1 spent"
          />

          <s-text-field
            label="Value of 1 point (in ₹)"
            type="number"
            value={rupeesPerPoint}
            onChange={(e) => setRupeesPerPoint(e.target.value)}
            details="Example: 0.1 means 100 points = ₹10 discount"
          />

          <s-text-field
            label="Minimum points required to redeem"
            type="number"
            value={minPointsToRedeem}
            onChange={(e) => setMinPointsToRedeem(e.target.value)}
            details="Customer must have at least this many points to redeem"
          />

          <s-button variant="primary" onClick={handleSave} loading={isSaving ? "" : undefined}>
            Save Settings
          </s-button>
        </s-stack>
      </s-section>
    </s-page>
  );
}