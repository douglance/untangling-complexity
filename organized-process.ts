type MaintainableProcessInput = {
  a: number;
  b: number;
  c: number;
};

function addAndSquare(a: number, b: number) {
  let sum = a + b;
  return sum * sum;
}
function subtractOrZero(a: number, b: number) {
  let difference = a - b;
  return difference > 0 ? difference : 0;
}
function isEven(n: number) {
  return n % 2 === 0;
}
function maintainableProcess({ a, b, c }: MaintainableProcessInput) {
  let x = addAndSquare(a, b);
  let y = subtractOrZero(b, c);
  let z = isEven(c);
  return [x, y, z];
}
maintainableProcess({ a: 5, b: 10, c: 15 });
