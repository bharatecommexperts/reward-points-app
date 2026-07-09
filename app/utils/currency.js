// app/utils/currency.js

export const getCurrencySymbol = (currencyCode) => {
  const symbols = {
    INR: "₹",
    USD: "$",
    GBP: "£",
    EUR: "€",
    AED: "AED",
    AUD: "A$",
    CAD: "C$",
    SGD: "S$",
    JPY: "¥",
    MYR: "RM",
    BDT: "৳",
    PKR: "₨",
    LKR: "Rs",
    NPR: "Rs",
  };
  return symbols[currencyCode] || currencyCode;
};

export const formatMoney = (amount, currencyCode) => {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${getCurrencySymbol(currencyCode)}${parseFloat(amount).toFixed(2)}`;
  }
};