import { useLoaderData, useNavigate } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { formatMoney, getCurrencySymbol } from "../utils/currency.js";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;

  const shopData = await admin.graphql(`
    query {
      shop {
        currencyCode
        name
        primaryDomain { url }
      }
    }
  `);
  const shopJson = await shopData.json();
  const currencyCode = shopJson.data.shop.currencyCode || "INR";
  const shopName = shopJson.data.shop.name || shop;
  const shopUrl = shopJson.data.shop.primaryDomain?.url || "";

  const totalCustomers = await db.customerPoints.count({ where: { shop } });
  const totalEarned = await db.pointsTransaction.aggregate({
    where: { shop, type: "earn" },
    _sum: { points: true },
  });
  const totalRedeemed = await db.pointsTransaction.aggregate({
    where: { shop, type: "redeem" },
    _sum: { points: true },
  });
  const recentTransactions = await db.pointsTransaction.findMany({
    where: { shop },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  const settings = await db.rewardSettings.findUnique({ where: { shop } });

  // Onboarding steps check
  const hasSettings = !!settings;
  const hasCustomers = totalCustomers > 0;
  const isOnboardingComplete = hasSettings && hasCustomers;

  return {
    currencyCode,
    shopName,
    shopUrl,
    isOnboardingComplete,
    onboarding: {
      settingsConfigured: hasSettings,
      widgetEnabled: hasCustomers,
      firstOrderReceived: hasCustomers,
    },
    stats: {
      totalCustomers,
      totalEarned: totalEarned._sum.points || 0,
      totalRedeemed: Math.abs(totalRedeemed._sum.points || 0),
      totalPoints: 0,
    },
    recentTransactions,
    settings,
  };
};

export default function Index() {
  const {
    currencyCode,
    shopName,
    shopUrl,
    isOnboardingComplete,
    onboarding,
    stats,
    recentTransactions,
    settings,
  } = useLoaderData();

  const symbol = getCurrencySymbol(currencyCode);
  const navigate = useNavigate();

  const styles = {
    page: {
      padding: "24px",
      fontFamily: "system-ui, sans-serif",
      maxWidth: "1000px",
      margin: "0 auto",
    },
    header: { marginBottom: "24px" },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#1a1a1a",
      margin: "0 0 4px 0",
    },
    subtitle: { fontSize: "14px", color: "#666", margin: 0 },

    // Onboarding
    onboardingCard: {
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      borderRadius: "16px",
      padding: "28px",
      color: "white",
      marginBottom: "24px",
    },
    onboardingTitle: {
      fontSize: "22px",
      fontWeight: "bold",
      marginBottom: "6px",
    },
    onboardingSubtitle: {
      fontSize: "14px",
      opacity: 0.85,
      marginBottom: "24px",
    },
    stepsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "12px",
    },
    step: {
      background: "rgba(255,255,255,0.15)",
      borderRadius: "12px",
      padding: "16px",
      cursor: "pointer",
      transition: "background 0.2s",
      border: "1px solid rgba(255,255,255,0.2)",
    },
    stepDone: {
      background: "rgba(255,255,255,0.25)",
      borderRadius: "12px",
      padding: "16px",
      border: "1px solid rgba(255,255,255,0.4)",
    },
    stepIcon: { fontSize: "24px", marginBottom: "8px" },
    stepTitle: { fontSize: "14px", fontWeight: "700", marginBottom: "4px" },
    stepDesc: { fontSize: "12px", opacity: 0.8 },
    stepStatus: {
      display: "inline-block",
      marginTop: "8px",
      fontSize: "11px",
      fontWeight: "700",
      padding: "2px 8px",
      borderRadius: "20px",
      background: "rgba(255,255,255,0.2)",
    },
    stepStatusDone: {
      display: "inline-block",
      marginTop: "8px",
      fontSize: "11px",
      fontWeight: "700",
      padding: "2px 8px",
      borderRadius: "20px",
      background: "rgba(40,167,69,0.4)",
    },

    // Stats
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "16px",
      marginBottom: "24px",
    },
    statCard: {
      background: "white",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderLeft: "4px solid",
    },
    statNumber: {
      fontSize: "32px",
      fontWeight: "bold",
      margin: "8px 0 4px 0",
    },
    statLabel: { fontSize: "13px", color: "#666", margin: 0 },

    // Cards
    card: {
      background: "white",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      marginBottom: "16px",
    },
    cardTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#1a1a1a",
      marginBottom: "16px",
      paddingBottom: "12px",
      borderBottom: "1px solid #eee",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
      textAlign: "left",
      padding: "8px 12px",
      fontSize: "12px",
      fontWeight: "600",
      color: "#888",
      textTransform: "uppercase",
      borderBottom: "1px solid #eee",
    },
    td: {
      padding: "12px",
      fontSize: "14px",
      borderBottom: "1px solid #f5f5f5",
      color: "#333",
    },
    badge: {
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
    },
    settingsCard: {
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      borderRadius: "12px",
      padding: "24px",
      color: "white",
      marginBottom: "16px",
    },
    settingsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "12px",
    },
    settingItem: {
      background: "rgba(255,255,255,0.2)",
      borderRadius: "8px",
      padding: "12px",
      textAlign: "center",
    },
    quickLinks: { display: "flex", gap: "12px", flexWrap: "wrap" },
    quickLink: {
      background: "#f5f5f5",
      border: "1px solid #eee",
      borderRadius: "8px",
      padding: "12px 20px",
      fontSize: "14px",
      cursor: "pointer",
      textDecoration: "none",
      color: "#333",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    emptyState: {
      textAlign: "center",
      padding: "32px",
      color: "#888",
      fontSize: "14px",
    },
  };

  const onboardingSteps = [
    {
      icon: onboarding.settingsConfigured ? "✅" : "⚙️",
      title: "Configure Points Rules",
      desc: "Set how many points customers earn per purchase",
      status: onboarding.settingsConfigured ? "Done!" : "Action needed",
      done: onboarding.settingsConfigured,
      action: () => navigate("/app/settings"),
    },
    {
      icon: onboarding.widgetEnabled ? "✅" : "🎨",
      title: "Enable Widget on Store",
      desc: "Add reward widget to your theme so customers can see points",
      status: onboarding.widgetEnabled ? "Done!" : "Action needed",
      done: onboarding.widgetEnabled,
      action: () =>
        window.open(
          `${shopUrl}/admin/themes/current/editor`,
          "_blank"
        ),
    },
    {
      icon: onboarding.firstOrderReceived ? "✅" : "🛍️",
      title: "Receive First Order",
      desc: "Customer places an order and earns reward points",
      status: onboarding.firstOrderReceived
        ? `${stats.totalCustomers} customers!`
        : "Waiting...",
      done: onboarding.firstOrderReceived,
      action: null,
    },
  ];

  const statCards = [
    {
      icon: "👥",
      label: "Total Customers",
      value: stats.totalCustomers,
      color: "#667eea",
    },
    {
      icon: "🎁",
      label: "Points Earned",
      value: stats.totalEarned.toLocaleString(),
      color: "#28a745",
    },
    {
      icon: "🔄",
      label: "Points Redeemed",
      value: stats.totalRedeemed.toLocaleString(),
      color: "#fd7e14",
    },
    {
      icon: "💰",
      label: `Value Given (${symbol})`,
      value: formatMoney(stats.totalRedeemed * (settings?.rupeesPerPoint || 0.1), currencyCode),
      color: "#e91e63",
    },
  ];

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🏆 Bharat Loyalty Rewards</h1>
        <p style={styles.subtitle}>
          Welcome back! Managing rewards for{" "}
          <strong>{shopName}</strong> · {currencyCode} ({symbol})
        </p>
      </div>

      {/* Onboarding — sirf tab dikhao jab complete nahi hua */}
      {!isOnboardingComplete && (
        <div style={styles.onboardingCard}>
          <div style={styles.onboardingTitle}>
            🚀 Get Started — 3 Easy Steps
          </div>
          <div style={styles.onboardingSubtitle}>
            Complete these steps to start rewarding your customers
          </div>
          <div style={styles.stepsGrid}>
            {onboardingSteps.map((step, i) => (
              <div
                key={i}
                style={step.done ? styles.stepDone : styles.step}
                onClick={step.action || undefined}
              >
                <div style={styles.stepIcon}>{step.icon}</div>
                <div style={styles.stepTitle}>
                  Step {i + 1}: {step.title}
                </div>
                <div style={styles.stepDesc}>{step.desc}</div>
                <span
                  style={
                    step.done ? styles.stepStatusDone : styles.stepStatus
                  }
                >
                  {step.done ? "✓ " : ""}{step.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        {statCards.map((stat) => (
          <div
            key={stat.label}
            style={{ ...styles.statCard, borderLeftColor: stat.color }}
          >
            <span style={{ fontSize: "24px" }}>{stat.icon}</span>
            <p style={{ ...styles.statNumber, color: stat.color }}>
              {stat.value}
            </p>
            <p style={styles.statLabel}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Current Settings */}
      {settings && (
        <div style={styles.settingsCard}>
          <p
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            ⚙️ Current Reward Rules
          </p>
          <div style={styles.settingsGrid}>
            <div style={styles.settingItem}>
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                {settings.pointsPerRupee}
              </div>
              <div style={{ fontSize: "11px", opacity: 0.8, marginTop: "4px" }}>
                Points per {symbol}1
              </div>
            </div>
            <div style={styles.settingItem}>
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                {symbol}{settings.rupeesPerPoint}
              </div>
              <div style={{ fontSize: "11px", opacity: 0.8, marginTop: "4px" }}>
                Value per Point
              </div>
            </div>
            <div style={styles.settingItem}>
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                {settings.minPointsToRedeem}
              </div>
              <div style={{ fontSize: "11px", opacity: 0.8, marginTop: "4px" }}>
                Min to Redeem
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div style={styles.card}>
        <p style={styles.cardTitle}>📊 Recent Activity</p>
        {recentTransactions.length === 0 ? (
          <div style={styles.emptyState}>
            <p>🎯 No activity yet!</p>
            <p>Points will appear here when customers place orders.</p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Points</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((t) => (
                <tr key={t.id}>
                  <td style={styles.td}>...{t.customerId.slice(-6)}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        background:
                          t.type === "earn" ? "#d4edda" : "#f8d7da",
                        color:
                          t.type === "earn" ? "#155724" : "#721c24",
                      }}
                    >
                      {t.type === "earn" ? "✅ Earned" : "🔴 Redeemed"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <strong
                      style={{
                        color: t.type === "earn" ? "#28a745" : "#dc3545",
                      }}
                    >
                      {t.type === "earn" ? "+" : ""}
                      {t.points}
                    </strong>
                  </td>
                  <td style={styles.td}>{t.description || "-"}</td>
                  <td style={styles.td}>
                    {new Date(t.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick Links */}
      <div style={styles.card}>
        <p style={styles.cardTitle}>🔗 Quick Links</p>
        <div style={styles.quickLinks}>
          <a href="/app/settings" style={styles.quickLink}>
            ⚙️ Reward Settings
          </a>
          <a href="/app/customers" style={styles.quickLink}>
            👥 Manage Customers
          </a>
        </div>
      </div>
    </div>
  );
}