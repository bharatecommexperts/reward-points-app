import { useState } from "react";
import { useLoaderData, useSubmit, useNavigation } from "react-router";
import { authenticate } from "../shopify.server";
import { getCurrencySymbol } from "../utils/currency.js";
import db from "../db.server";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;

  const shopData = await admin.graphql(`
    query { shop { currencyCode } }
  `);
  const shopJson = await shopData.json();
  const currencyCode = shopJson.data.shop.currencyCode || "INR";

  let settings = await db.rewardSettings.findUnique({
    where: { shop },
  });

  if (!settings) {
    settings = await db.rewardSettings.create({
      data: { shop },
    });
  }

  return { settings, currencyCode };
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
  const { settings, currencyCode } = useLoaderData();
  const symbol = getCurrencySymbol(currencyCode);
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSaving = navigation.state === "submitting";

  const [pointsPerRupee, setPointsPerRupee] = useState(
    String(settings.pointsPerRupee)
  );
  const [rupeesPerPoint, setRupeesPerPoint] = useState(
    String(settings.rupeesPerPoint)
  );
  const [minPointsToRedeem, setMinPointsToRedeem] = useState(
    String(settings.minPointsToRedeem)
  );

  const handleSave = () => {
    const formData = new FormData();
    formData.append("pointsPerRupee", pointsPerRupee);
    formData.append("rupeesPerPoint", rupeesPerPoint);
    formData.append("minPointsToRedeem", minPointsToRedeem);
    submit(formData, { method: "post" });
  };

  const styles = {
    page: {
      padding: "20px",
      maxWidth: "600px",
      margin: "0 auto",
      fontFamily: "system-ui, sans-serif",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "4px",
      color: "#1a1a1a",
    },
    subheading: {
      fontSize: "13px",
      color: "#888",
      marginBottom: "24px",
    },
    card: {
      background: "white",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      marginBottom: "16px",
    },
    fieldGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "6px",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "14px",
      boxSizing: "border-box",
      outline: "none",
    },
    helpText: {
      fontSize: "12px",
      color: "#666",
      marginTop: "4px",
    },
    button: {
      background: "#008060",
      color: "white",
      border: "none",
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: isSaving ? "not-allowed" : "pointer",
      opacity: isSaving ? 0.7 : 1,
    },
    currencyBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: "#f0f0f0",
      borderRadius: "20px",
      padding: "4px 12px",
      fontSize: "13px",
      color: "#555",
      marginBottom: "20px",
    },
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>⚙️ Reward Points Settings</h1>
      <p style={styles.subheading}>
        Configure how customers earn and redeem points
      </p>

      <div style={styles.card}>

        <div style={styles.currencyBadge}>
          💱 Store Currency: <strong>{currencyCode}</strong> ({symbol})
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Points earned per {symbol}1 spent
          </label>
          <input
            style={styles.input}
            type="number"
            value={pointsPerRupee}
            onChange={(e) => setPointsPerRupee(e.target.value)}
            step="0.1"
            min="0"
          />
          <p style={styles.helpText}>
            Example: 1 = customer gets 1 point per {symbol}1 spent
          </p>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Value of 1 point (in {symbol})
          </label>
          <input
            style={styles.input}
            type="number"
            value={rupeesPerPoint}
            onChange={(e) => setRupeesPerPoint(e.target.value)}
            step="0.01"
            min="0"
          />
          <p style={styles.helpText}>
            Example: 0.1 = 100 points = {symbol}10 discount
          </p>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Minimum points required to redeem
          </label>
          <input
            style={styles.input}
            type="number"
            value={minPointsToRedeem}
            onChange={(e) => setMinPointsToRedeem(e.target.value)}
            step="1"
            min="0"
          />
          <p style={styles.helpText}>
            Customer must have at least this many points to redeem
          </p>
        </div>

        <button
          style={styles.button}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "💾 Save Settings"}
        </button>

      </div>
    </div>
  );
}