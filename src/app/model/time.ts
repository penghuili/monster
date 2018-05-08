export function now(): number {
  return new Date().getTime();
}
export function createDate(year: number, month: number, day: number): number {
  const n = new Date();
  n.setFullYear(year);
  n.setMonth(month);
  n.setDate(day);
  return n.getTime();
}
export function add0(a: number): string {
  return a >= 0 && a <= 9 ? `0${a}` : a.toString();
}
