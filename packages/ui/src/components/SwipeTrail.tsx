/**
 * SwipeTrail component - renders swipe trail using Canvas API
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { Point } from '@swype-calc/core';

export interface SwipeTrailProps {
  points: Point[];
  color?: string;
  lineWidth?: number;
  smoothing?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const SwipeTrail: React.FC<SwipeTrailProps> = ({
  points,
  color = 'rgba(0, 122, 255, 0.6)',
  lineWidth = 4,
  smoothing = true,
  className = '',
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawTrail = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set styles
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw the trail
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    if (smoothing && points.length > 2) {
      // Draw smoothed curve using quadratic Bézier curves
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      // Draw last segment
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    } else {
      // Draw straight lines
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
    }

    ctx.stroke();

    // Draw endpoint glow
    if (points.length > 0) {
      const lastPoint = points[points.length - 1];
      const gradient = ctx.createRadialGradient(
        lastPoint.x,
        lastPoint.y,
        0,
        lastPoint.x,
        lastPoint.y,
        lineWidth * 3
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, lineWidth * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, [points, color, lineWidth, smoothing]);

  useEffect(() => {
    drawTrail();
  }, [drawTrail]);

  const getCanvasSize = useCallback(() => {
    if (points.length === 0) {
      return { width: 0, height: 0 };
    }

    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const padding = lineWidth * 6;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;

    return {
      width: Math.max(width, 100),
      height: Math.max(height, 100),
    };
  }, [points, lineWidth]);

  const canvasSize = getCanvasSize();

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      className={className}
      style={{
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

export default SwipeTrail;
