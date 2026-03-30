/**
 * Touch trail smoothing using Bézier curves
 */

export interface Point {
  x: number;
  y: number;
  timestamp?: number;
}

/**
 * Apply Bézier curve smoothing to a set of points
 */
export function smoothBezier(points: Point[], tension = 0.5): Point[] {
  if (points.length < 3) {
    return points;
  }

  const smoothed: Point[] = [points[0]];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[Math.min(points.length - 1, i + 1)];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1 = {
      x: p1.x + (p2.x - p0.x) * tension * 0.5,
      y: p1.y + (p2.y - p0.y) * tension * 0.5,
    };

    const cp2 = {
      x: p2.x - (p3.x - p1.x) * tension * 0.5,
      y: p2.y - (p3.y - p1.y) * tension * 0.5,
    };

    // Add intermediate points along the curve
    const segments = 5;
    for (let j = 1; j <= segments; j++) {
      const t = j / segments;
      const point = cubicBezier(p1, cp1, cp2, p2, t);
      smoothed.push(point);
    }
  }

  smoothed.push(points[points.length - 1]);
  return smoothed;
}

/**
 * Calculate a point on a cubic Bézier curve
 */
function cubicBezier(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number
): Point {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
  };
}

/**
 * Apply moving average smoothing (simpler, faster)
 */
export function smoothMovingAverage(points: Point[], windowSize = 3): Point[] {
  if (points.length < windowSize) {
    return points;
  }

  const smoothed: Point[] = [];
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < points.length; i++) {
    let sumX = 0;
    let sumY = 0;
    let count = 0;

    for (let j = -halfWindow; j <= halfWindow; j++) {
      const index = i + j;
      if (index >= 0 && index < points.length) {
        sumX += points[index].x;
        sumY += points[index].y;
        count++;
      }
    }

    smoothed.push({
      x: sumX / count,
      y: sumY / count,
    });
  }

  return smoothed;
}

/**
 * Resample points to uniform distance
 */
export function resamplePoints(points: Point[], distance = 10): Point[] {
  if (points.length < 2) {
    return points;
  }

  const resampled: Point[] = [points[0]];
  let accumulatedDistance = 0;

  for (let i = 1; i < points.length; i++) {
    const d = distanceBetween(points[i - 1], points[i]);
    accumulatedDistance += d;

    while (accumulatedDistance >= distance) {
      const ratio = (accumulatedDistance - distance) / d;
      const newPoint = {
        x: points[i].x + (points[i - 1].x - points[i].x) * ratio,
        y: points[i].y + (points[i - 1].y - points[i].y) * ratio,
      };
      resampled.push(newPoint);
      accumulatedDistance -= distance;
    }
  }

  resampled.push(points[points.length - 1]);
  return resampled;
}

/**
 * Calculate distance between two points
 */
export function distanceBetween(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Calculate total length of a path
 */
export function pathLength(points: Point[]): number {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    length += distanceBetween(points[i - 1], points[i]);
  }
  return length;
}
