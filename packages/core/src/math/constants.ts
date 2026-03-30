/**
 * Mathematical constants
 */

export const PI = Math.PI;
export const E = Math.E;
export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

export function getConstant(name: string): number | undefined {
  const constants: Record<string, number> = {
    π: PI,
    pi: PI,
    PI: PI,
    e: E,
    E: E,
    φ: GOLDEN_RATIO,
    phi: GOLDEN_RATIO,
    Φ: GOLDEN_RATIO,
  };
  return constants[name];
}
