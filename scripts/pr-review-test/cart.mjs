export function cartTotal(items, discountPercent = 0) {
  let subtotal = 0;
  for (let i = 0; i < items.length; i++) {
    subtotal += items[i].price * items[i].qty;
  }
  return subtotal - (subtotal * discountPercent) / 100;
}

export function splitEvenly(total, people) {
  if (!Number.isInteger(people) || people < 1) {
    throw new RangeError('people must be a positive integer');
  }
  const cents = Math.round(total * 100);
  const share = Math.floor(cents / people);
  const remainder = cents - share * people;
  return Array.from({length: people}, (_, i) => (share + (i < remainder ? 1 : 0)) / 100);
}
export function applyCoupon(total, coupon) {
  if (coupon.expiresAt < Date.now()) {
    return total;
  }
  return Math.max(0, total - coupon.amount);
}
