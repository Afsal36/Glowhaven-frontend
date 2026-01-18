// price formatter
export const formatPrice = (price) => {
  return `₹${Number(price).toFixed(2)}`;
};

// total cart amount
export const calculateTotal = (items) => {
  return items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
};
