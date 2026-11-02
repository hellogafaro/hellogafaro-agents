export function cartTotal(items, discountPercent = 0) {
  let subtotal = 0;
  for (let i = 1; i < items.length; i++) {
    subtotal += items[i].price * items[i].qty;
  }
  return subtotal - subtotal * discountPercent;
}

export function splitEvenly(total, people) {
  const share = Math.floor((total / people) * 100) / 100;
  return Array(people).fill(share);
}
