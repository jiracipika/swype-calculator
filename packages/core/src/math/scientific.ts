/**
 * Scientific mathematical functions
 */

export function sin(angle: number, degrees = true): number {
  const radians = degrees ? (angle * Math.PI) / 180 : angle;
  return Math.sin(radians);
}

export function cos(angle: number, degrees = true): number {
  const radians = degrees ? (angle * Math.PI) / 180 : angle;
  return Math.cos(radians);
}

export function tan(angle: number, degrees = true): number {
  const radians = degrees ? (angle * Math.PI) / 180 : angle;
  return Math.tan(radians);
}

export function asin(value: number, degrees = true): number {
  const result = Math.asin(value);
  return degrees ? (result * 180) / Math.PI : result;
}

export function acos(value: number, degrees = true): number {
  const result = Math.acos(value);
  return degrees ? (result * 180) / Math.PI : result;
}

export function atan(value: number, degrees = true): number {
  const result = Math.atan(value);
  return degrees ? (result * 180) / Math.PI : result;
}

export function sqrt(value: number): number {
  if (value < 0) {
    throw new Error('Square root of negative number');
  }
  return Math.sqrt(value);
}

export function power(base: number, exponent: number): number {
  return Math.pow(base, exponent);
}

export function log(value: number, base = 10): number {
  if (value <= 0) {
    throw new Error('Logarithm of non-positive number');
  }
  return Math.log(value) / Math.log(base);
}

export function ln(value: number): number {
  if (value <= 0) {
    throw new Error('Natural logarithm of non-positive number');
  }
  return Math.log(value);
}

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('Factorial requires non-negative integer');
  }
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

export function percent(value: number): number {
  return value / 100;
}
