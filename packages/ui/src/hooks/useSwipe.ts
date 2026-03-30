/**
 * useSwipe hook - manages swipe/touch state
 */

import { useState, useCallback, useRef } from 'react';
import { Point, smoothBezier, recognizeGesture, mapGesture } from '@swype-calc/core';
import { GestureType } from '@swype-calc/core';

export interface UseSwipeOptions {
  onSwipeStart?: (point: Point) => void;
  onSwipeMove?: (points: Point[]) => void;
  onSwipeEnd?: (gesture: GestureType | null, points: Point[]) => void;
  smoothing?: boolean;
  sampleRate?: number;
}

export interface SwipeHandlers {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerLeave: (e: React.PointerEvent) => void;
  onPointerCancel: (e: React.PointerEvent) => void;
}

export const useSwipe = (options: UseSwipeOptions = {}): SwipeHandlers => {
  const {
    onSwipeStart,
    onSwipeMove,
    onSwipeEnd,
    smoothing = true,
    sampleRate = 16, // ~60fps
  } = options;

  const [isSwiping, setIsSwiping] = useState(false);
  const pointsRef = useRef<Point[]>([]);
  const lastSampleRef = useRef<number>(0);

  const startSwipe = useCallback(
    (e: React.PointerEvent) => {
      const point: Point = {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      };

      pointsRef.current = [point];
      setIsSwiping(true);
      lastSampleRef.current = Date.now();

      onSwipeStart?.(point);
    },
    [onSwipeStart]
  );

  const moveSwipe = useCallback(
    (e: React.PointerEvent) => {
      if (!isSwiping) return;

      const now = Date.now();
      if (now - lastSampleRef.current < sampleRate) {
        return; // Throttle sampling
      }

      const point: Point = {
        x: e.clientX,
        y: e.clientY,
        timestamp: now,
      };

      pointsRef.current.push(point);
      lastSampleRef.current = now;

      let currentPoints = pointsRef.current;
      if (smoothing && currentPoints.length >= 3) {
        currentPoints = smoothBezier(currentPoints);
      }

      onSwipeMove?.(currentPoints);
    },
    [isSwiping, onSwipeMove, smoothing, sampleRate]
  );

  const endSwipe = useCallback(
    (e: React.PointerEvent) => {
      if (!isSwiping) return;

      const point: Point = {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      };

      pointsRef.current.push(point);

      let finalPoints = pointsRef.current;
      if (smoothing && finalPoints.length >= 3) {
        finalPoints = smoothBezier(finalPoints);
      }

      const gesture = recognizeGesture(finalPoints);
      onSwipeEnd?.(gesture.type === 'unknown' ? null : gesture.type, finalPoints);

      setIsSwiping(false);
      pointsRef.current = [];
    },
    [isSwiping, onSwipeEnd, smoothing]
  );

  const cancelSwipe = useCallback(() => {
    if (!isSwiping) return;

    setIsSwiping(false);
    pointsRef.current = [];
  }, [isSwiping]);

  return {
    onPointerDown: startSwipe,
    onPointerMove: moveSwipe,
    onPointerUp: endSwipe,
    onPointerLeave: cancelSwipe,
    onPointerCancel: cancelSwipe,
  };
};

export default useSwipe;
