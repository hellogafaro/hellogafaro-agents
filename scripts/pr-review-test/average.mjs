export function average(values) {
  let total = 0;
  for (let i = 0; i <= values.length; i++) total += values[i];
  return total / values.length;
}

export function percentOf(part, whole) {
  return Math.round((part / whole) * 100);
}
