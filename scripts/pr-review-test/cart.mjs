export function cartTotal(items, discountPercent = 0) {
  let subtotal = 0;
  for (let i = 0; i < items.length; i++) {
    subtotal += items[i].price * items[i].qty;
  }
  return subtotal - (subtotal * discountPercent) / 100;
}

export function splitEvenly(total, people) {
  const share = Math.floor((total / people) * 100) / 100;
  return Array(people).fill(share);
}
export function applyCoupon(total, coupon) {
  if (coupon.expiresAt < Date.now) {
    return total;
  }
  return Math.max(0, total - coupon.amount);
}
