/**
 * Gesture recognizer from touch points
 */

import { Point, distanceBetween, pathLength } from './smoothing';

export type GestureType =
  | 'tap'
  | 'swipe-left'
  | 'swipe-right'
  | 'swipe-up'
  | 'swipe-down'
  | 'circle-clockwise'
  | 'circle-counterclockwise'
  | 'unknown';

export interface Gesture {
  type: GestureType;
  confidence: number;
  points: Point[];
  start: Point;
  end: Point;
  duration: number;
}

const SWIPE_THRESHOLD = 50; // Minimum distance for swipe
const SWIPE_CONFIDENCE_THRESHOLD = 0.6;
const CIRCLE_CONFIDENCE_THRESHOLD = 0.5;

/**
 * Recognize gesture from a series of points
 */
export function recognizeGesture(points: Point[]): Gesture {
  if (points.length < 2) {
    return {
      type: 'tap',
      confidence: 1,
      points,
      start: points[0],
      end: points[points.length - 1],
      duration: 0,
    };
  }

  const start = points[0];
  const end = points[points.length - 1];
  const duration = points[points.length - 1].timestamp
    ? points[points.length - 1].timestamp! - points[0].timestamp!
    : 0;

  const totalDistance = pathLength(points);
  const displacement = distanceBetween(start, end);

  // Check for tap (short distance, short duration)
  if (totalDistance < SWIPE_THRESHOLD) {
    return {
      type: 'tap',
      confidence: 1,
      points,
      start,
      end,
      duration,
    };
  }

  // Check for straight-line gestures (swipes)
  const swipeGesture = recognizeSwipe(points, start, end, totalDistance, displacement);
  if (swipeGesture.confidence >= SWIPE_CONFIDENCE_THRESHOLD) {
    return swipeGesture;
  }

  // Check for circular gestures
  const circleGesture = recognizeCircle(points, start, end);
  if (circleGesture.confidence >= CIRCLE_CONFIDENCE_THRESHOLD) {
    return circleGesture;
  }

  return {
    type: 'unknown',
    confidence: 0,
    points,
    start,
    end,
    duration,
  };
}

/**
 * Recognize swipe gestures
 */
function recognizeSwipe(
  points: Point[],
  start: Point,
  end: Point,
  totalDistance: number,
  displacement: number
): Gesture {
  // Calculate linearity: ratio of displacement to total path length
  const linearity = displacement / totalDistance;

  // Calculate direction
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  let gestureType: GestureType = 'unknown';
  let confidence = linearity;

  // Normalize angle to 0-360
  let normalizedAngle = angle;
  if (normalizedAngle < 0) {
    normalizedAngle += 360;
  }

  // Determine direction based on angle
  if (normalizedAngle >= 315 || normalizedAngle < 45) {
    gestureType = 'swipe-right';
    confidence *= Math.cos((normalizedAngle * Math.PI) / 180); // Boost confidence for straight horizontal
  } else if (normalizedAngle >= 45 && normalizedAngle < 135) {
    gestureType = 'swipe-down';
    confidence *= Math.sin((normalizedAngle * Math.PI) / 180);
  } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
    gestureType = 'swipe-left';
    confidence *= Math.abs(Math.cos((normalizedAngle * Math.PI) / 180));
  } else if (normalizedAngle >= 225 && normalizedAngle < 315) {
    gestureType = 'swipe-up';
    confidence *= Math.abs(Math.sin((normalizedAngle * Math.PI) / 180));
  }

  return {
    type: gestureType,
    confidence: Math.max(0, Math.min(1, confidence)),
    points,
    start,
    end,
    duration: points[points.length - 1].timestamp
      ? points[points.length - 1].timestamp! - points[0].timestamp!
      : 0,
  };
}

/**
 * Recognize circular gestures
 */
function recognizeCircle(points: Point[], start: Point, end: Point): Gesture {
  if (points.length < 8) {
    return {
      type: 'unknown',
      confidence: 0,
      points,
      start,
      end,
      duration: 0,
    };
  }

  // Calculate centroid
  let sumX = 0;
  let sumY = 0;
  for (const point of points) {
    sumX += point.x;
    sumY += point.y;
  }
  const centroid = {
    x: sumX / points.length,
    y: sumY / points.length,
  };

  // Calculate average radius
  let sumRadius = 0;
  for (const point of points) {
    sumRadius += distanceBetween(point, centroid);
  }
  const avgRadius = sumRadius / points.length;

  // Calculate radius variance (should be low for a circle)
  let varianceSum = 0;
  for (const point of points) {
    const radius = distanceBetween(point, centroid);
    varianceSum += Math.pow(radius - avgRadius, 2);
  }
  const radiusVariance = varianceSum / points.length;
  const circularity = 1 / (1 + radiusVariance / avgRadius);

  // Determine direction (clockwise or counter-clockwise)
  let crossProductSum = 0;
  for (let i = 1; i < points.length; i++) {
    const p1 = points[i - 1];
    const p2 = points[i];
    crossProductSum +=
      (p2.x - centroid.x) * (p1.y - centroid.y) -
      (p1.x - centroid.x) * (p2.y - centroid.y);
  }

  const isClockwise = crossProductSum < 0;
  const directionConfidence = Math.abs(crossProductSum) / (points.length * avgRadius * avgRadius);

  const gestureType: GestureType = isClockwise ? 'circle-clockwise' : 'circle-counterclockwise';

  // Check if start and end points are close (closed circle)
  const closureDistance = distanceBetween(start, end);
  const closureScore = 1 - Math.min(1, closureDistance / (avgRadius * 2));

  const confidence = (circularity * 0.5) + (closureScore * 0.3) + (directionConfidence * 0.2);

  return {
    type: gestureType,
    confidence: Math.max(0, Math.min(1, confidence)),
    points,
    start,
    end,
    duration: points[points.length - 1].timestamp
      ? points[points.length - 1].timestamp! - points[0].timestamp!
      : 0,
  };
}
