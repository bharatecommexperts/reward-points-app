// app/routes/privacy.jsx

export default function PrivacyPolicy() {
  const styles = {
    page: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "40px 24px",
      fontFamily: "system-ui, sans-serif",
      color: "#333",
      lineHeight: "1.7",
    },
    header: {
      borderBottom: "2px solid #667eea",
      paddingBottom: "20px",
      marginBottom: "32px",
    },
    logo: {
      fontSize: "24px",
      fontWeight: "800",
      color: "#667eea",
      marginBottom: "8px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#1a1a1a",
      margin: "0 0 8px",
    },
    updated: {
      fontSize: "14px",
      color: "#888",
    },
    h2: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#1a1a1a",
      marginTop: "32px",
      marginBottom: "12px",
    },
    p: {
      marginBottom: "16px",
      fontSize: "15px",
    },
    ul: {
      paddingLeft: "24px",
      marginBottom: "16px",
    },
    li: {
      marginBottom: "8px",
      fontSize: "15px",
    },
    contact: {
      background: "#f8f9ff",
      border: "1px solid #667eea",
      borderRadius: "12px",
      padding: "20px 24px",
      marginTop: "32px",
    },
    footer: {
      marginTop: "40px",
      paddingTop: "20px",
      borderTop: "1px solid #eee",
      fontSize: "13px",
      color: "#888",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.logo}>🏆 Bharat Loyalty Rewards</div>
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.updated}>Last updated: July 2026</p>
      </div>

      <p style={styles.p}>
        Bharat Loyalty Rewards ("we", "our", or "us") is a Shopify application
        that helps merchants reward their customers with loyalty points. This
        Privacy Policy explains how we collect, use, and protect information
        when you use our app.
      </p>

      <h2 style={styles.h2}>1. Information We Collect</h2>
      <p style={styles.p}>
        When you install and use Bharat Loyalty Rewards, we collect the
        following information:
      </p>
      <ul style={styles.ul}>
        <li style={styles.li}>
          <strong>Shop Information:</strong> Your Shopify store domain, shop
          name, and currency settings.
        </li>
        <li style={styles.li}>
          <strong>Customer Data:</strong> Customer IDs and order totals to
          calculate and assign reward points.
        </li>
        <li style={styles.li}>
          <strong>Order Data:</strong> Order IDs and total amounts to determine
          points earned per purchase.
        </li>
        <li style={styles.li}>
          <strong>Points Data:</strong> Points balance and transaction history
          for each customer.
        </li>
      </ul>

      <h2 style={styles.h2}>2. How We Use Your Information</h2>
      <p style={styles.p}>We use the collected information to:</p>
      <ul style={styles.ul}>
        <li style={styles.li}>
          Calculate and assign reward points based on customer purchases.
        </li>
        <li style={styles.li}>
          Generate discount codes when customers redeem their points.
        </li>
        <li style={styles.li}>
          Display points balance and transaction history to customers.
        </li>
        <li style={styles.li}>
          Provide merchants with analytics about their loyalty program.
        </li>
        <li style={styles.li}>
          Send webhook notifications for order events (orders/create).
        </li>
      </ul>

      <h2 style={styles.h2}>3. Data Storage</h2>
      <p style={styles.p}>
        All data is stored securely in our database hosted on Neon (PostgreSQL).
        We store:
      </p>
      <ul style={styles.ul}>
        <li style={styles.li}>Customer reward points balances</li>
        <li style={styles.li}>Points transaction history</li>
        <li style={styles.li}>Reward program settings per store</li>
        <li style={styles.li}>
          Shopify session tokens (for authentication only)
        </li>
      </ul>
      <p style={styles.p}>
        We do <strong>not</strong> store sensitive customer information such as
        email addresses, phone numbers, payment details, or shipping addresses.
      </p>

      <h2 style={styles.h2}>4. Data Sharing</h2>
      <p style={styles.p}>
        We do not sell, trade, or transfer your information to third parties.
        We only share data with:
      </p>
      <ul style={styles.ul}>
        <li style={styles.li}>
          <strong>Shopify:</strong> To authenticate your store and create
          discount codes via the Shopify Admin API.
        </li>
        <li style={styles.li}>
          <strong>Neon (Database Provider):</strong> For secure data storage.
        </li>
        <li style={styles.li}>
          <strong>Render (Hosting Provider):</strong> For app hosting and
          processing.
        </li>
      </ul>

      <h2 style={styles.h2}>5. GDPR Compliance</h2>
      <p style={styles.p}>
        We are committed to GDPR compliance. As a Shopify app, we support:
      </p>
      <ul style={styles.ul}>
        <li style={styles.li}>
          <strong>Right to Access:</strong> Merchants can request all customer
          data we store via the customers/data_request webhook.
        </li>
        <li style={styles.li}>
          <strong>Right to Erasure:</strong> Customer data is permanently
          deleted upon request via the customers/redact webhook.
        </li>
        <li style={styles.li}>
          <strong>Shop Data Deletion:</strong> All shop data is deleted within
          48 hours of app uninstall via the shop/redact webhook.
        </li>
      </ul>

      <h2 style={styles.h2}>6. Data Retention</h2>
      <p style={styles.p}>
        We retain customer points and transaction data for as long as the app
        is installed on your store. When you uninstall the app, all associated
        data is deleted within 48 hours.
      </p>

      <h2 style={styles.h2}>7. Security</h2>
      <p style={styles.p}>
        We implement industry-standard security measures to protect your data:
      </p>
      <ul style={styles.ul}>
        <li style={styles.li}>All data transmission is encrypted via HTTPS/SSL.</li>
        <li style={styles.li}>
          Shopify webhook requests are verified using HMAC signatures.
        </li>
        <li style={styles.li}>
          Database access is restricted and encrypted at rest.
        </li>
        <li style={styles.li}>
          API keys and secrets are stored as environment variables, never in
          code.
        </li>
      </ul>

      <h2 style={styles.h2}>8. Merchant Responsibilities</h2>
      <p style={styles.p}>
        As a merchant using our app, you are responsible for:
      </p>
      <ul style={styles.ul}>
        <li style={styles.li}>
          Informing your customers about the loyalty points program.
        </li>
        <li style={styles.li}>
          Complying with applicable privacy laws in your jurisdiction.
        </li>
        <li style={styles.li}>
          Updating your store's privacy policy to mention the use of our app.
        </li>
      </ul>

      <h2 style={styles.h2}>9. Changes to This Policy</h2>
      <p style={styles.p}>
        We may update this Privacy Policy from time to time. We will notify
        merchants of significant changes by updating the "Last updated" date at
        the top of this page.
      </p>

      <div style={styles.contact}>
        <h2 style={{ ...styles.h2, marginTop: 0 }}>10. Contact Us</h2>
        <p style={styles.p}>
          If you have any questions about this Privacy Policy or our data
          practices, please contact us:
        </p>
        <p style={{ ...styles.p, marginBottom: 0 }}>
          <strong>Email:</strong> bharatecommexperts@gmail.com
          <br />
          <strong>App:</strong> Bharat Loyalty Rewards
          <br />
          <strong>Developer:</strong> Bharat Ecomm Experts
        </p>
      </div>

      <div style={styles.footer}>
        © 2026 Bharat Loyalty Rewards · All rights reserved ·{" "}
        <a href="/privacy" style={{ color: "#667eea" }}>
          Privacy Policy
        </a>
      </div>
    </div>
  );
}