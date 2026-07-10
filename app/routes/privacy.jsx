// app/routes/privacy.jsx
export default function PrivacyPolicy() {
  return (
    <div style={{
      maxWidth: "800px",
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: "system-ui, sans-serif",
      lineHeight: "1.6",
      color: "#333"
    }}>
      <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>
        Privacy Policy
      </h1>
      <p style={{ color: "#666", marginBottom: "32px" }}>
        Last updated: July 2026
      </p>

      <h2>1. Introduction</h2>
      <p>
        Bharat Loyalty Rewards ("we", "our", or "us") is committed to protecting
        your privacy. This Privacy Policy explains how we collect, use, and
        safeguard information when you use our Shopify app.
      </p>

      <h2>2. Information We Collect</h2>
      <p>We collect the following information:</p>
      <ul>
        <li>Customer ID (from Shopify)</li>
        <li>Order total amount</li>
        <li>Points earned and redeemed</li>
        <li>Store domain</li>
      </ul>

      <h2>3. How We Use Information</h2>
      <p>We use collected information to:</p>
      <ul>
        <li>Calculate and award reward points</li>
        <li>Track points history</li>
        <li>Generate discount codes for redemption</li>
        <li>Display points balance to customers</li>
      </ul>

      <h2>4. Data Storage</h2>
      <p>
        All data is stored securely in our database. We use
        industry-standard security measures to protect your data.
      </p>

      <h2>5. Data Sharing</h2>
      <p>
        We do not sell, trade, or share your personal information
        with third parties except as required by law.
      </p>

      <h2>6. GDPR Compliance</h2>
      <p>
        We comply with GDPR regulations. You have the right to:
      </p>
      <ul>
        <li>Access your personal data</li>
        <li>Request deletion of your data</li>
        <li>Data portability</li>
      </ul>

      <h2>7. Data Deletion</h2>
      <p>
        When you uninstall our app, all your store data is
        automatically deleted within 48 hours.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        For privacy concerns, contact us at:
        <a href="mailto:bharatecommexperts@gmail.com">
          bharatecommexperts@gmail.com
        </a>
      </p>
    </div>
  );
}