export const getProductBadge = (product) => {
  if (product.discount) {
    return { label: "Sale", color: "bg-green-500" };
  }

  if (product.isNew) {
    return { label: "✨New", color: "bg-blue-600" };
  }

  if (product.rating >= 4.8) {
    return { label: "🔥Hot", color: "bg-red-500" };
  }

  if (product.sales > 100) {
    return { label: "💸Best Seller", color: "bg-purple-600" };
  }

  return null;
};