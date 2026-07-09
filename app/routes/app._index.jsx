import { useLoaderData } from "react-router";
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
      }
    }
  `);
  const shopJson = await shopData.json();
  const currencyCode = shopJson.data.shop.currencyCode || "INR";

  const totalCustomers = await db.customerPoints.count({
    where: { shop },
  });

  const totalPointsData = await db.customerPoints.aggregate({
    where: { shop },
    _sum: { totalPoints: true },
  });

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

  const settings = await db.rewardSettings.findUnique({
    where: { shop },
  });

  return {
    currencyCode,
    stats: {
      totalCustomers,
      totalPoints: totalPointsData._sum.totalPoints || 0,
      totalEarned: totalEarned._sum.points || 0,
      totalRedeemed: Math.abs(totalRedeemed._sum.points || 0),
    },
    recentTransactions,
    settings,
  };
};

export default function Index() {
  const { stats, recentTransactions, settings, currencyCode } = useLoaderData();
  const symbol = getCurrencySymbol(currencyCode);

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
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
    statIcon: { fontSize: "24px" },
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
    settingsTitle: {
      fontSize: "16px",
      fontWeight: "600",
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
    settingValue: { fontSize: "20px", fontWeight: "bold" },
    settingLabel: { fontSize: "11px", opacity: 0.8, marginTop: "4px" },
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

  const statCards = [
    {
      icon: "👥",
      label: "Total Customers",
      value: stats.totalCustomers,
      color: "#667eea",
    },
    {
      icon: "🎁",
      label: "Total Points Given",
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
      label: "Active Points",
      value: stats.totalPoints.toLocaleString(),
      color: "#e91e63",
    },
  ];

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🏆 MS Loyalty Dashboard</h1>
        <p style={styles.subtitle}>
          Manage your reward points program · Currency:{" "}
          <strong>{currencyCode} ({symbol})</strong>
        </p>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        {statCards.map((stat) => (
          <div
            key={stat.label}
            style={{ ...styles.statCard, borderLeftColor: stat.color }}
          >
            <span style={styles.statIcon}>{stat.icon}</span>
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
          <p style={styles.settingsTitle}>⚙️ Current Reward Rules</p>
          <div style={styles.settingsGrid}>
            <div style={styles.settingItem}>
              <div style={styles.settingValue}>
                {settings.pointsPerRupee}
              </div>
              <div style={styles.settingLabel}>
                Points per {symbol}1
              </div>
            </div>
            <div style={styles.settingItem}>
              <div style={styles.settingValue}>
                {symbol}{settings.rupeesPerPoint}
              </div>
              <div style={styles.settingLabel}>Value per Point</div>
            </div>
            <div style={styles.settingItem}>
              <div style={styles.settingValue}>
                {settings.minPointsToRedeem}
              </div>
              <div style={styles.settingLabel}>Min to Redeem</div>
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
                <th style={styles.th}>Customer ID</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Points</th>
                <th style={styles.th}>Value</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((t) => (
                <tr key={t.id}>
                  <td style={styles.td}>
                    ...{t.customerId.slice(-6)}
                  </td>
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
                        color:
                          t.type === "earn" ? "#28a745" : "#dc3545",
                      }}
                    >
                      {t.type === "earn" ? "+" : ""}
                      {t.points}
                    </strong>
                  </td>
                  <td style={styles.td}>
                    {formatMoney(
                      Math.abs(t.points) * (settings?.rupeesPerPoint || 0.1),
                      currencyCode
                    )}
                  </td>
                  <td style={styles.td}>
                    {t.description || "-"}
                  </td>
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