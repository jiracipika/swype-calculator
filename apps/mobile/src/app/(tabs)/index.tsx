'use client';

import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useCalculator } from '@swype-calc/ui';
import { Display, CalculatorGrid, createDefaultGridItems } from '@swype-calc/ui';
import { useSwipe } from '@swype-calc/ui';
import { Point } from '@swype-calc/core';
import { mapGesture } from '@swype-calc/core';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function CalculatorScreen() {
  const {
    expression,
    result,
    showResult,
    history,
    error,
    handleInput,
    calculate,
    clearExpression,
  } = useCalculator();

  const [swipePoints, setSwipePoints] = useState<Point[]>([]);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handleHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    runOnJS(() => {
      if (type === 'light') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (type === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    })();
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      setSwipePoints([]);
    })
    .onUpdate((event) => {
      const newPoint: Point = { x: event.absoluteX, y: event.absoluteY };
      setSwipePoints((prev) => [...prev, newPoint]);
    })
    .onEnd((event) => {
      if (swipePoints.length > 10) {
        const gesture = recognizeGesture(swipePoints);
        const operation = mapGesture(gesture);
        if (operation) {
          handleHaptic('medium');
          handleInput(operation);
        }
      }
      setSwipePoints([]);
    });

  const gridItems = createDefaultGridItems();

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        {/* Gradient background */}
        <View style={styles.background} />

        {/* Swipe trail */}
        {swipePoints.length > 0 && (
          <Animated.View style={[styles.trailContainer, animatedStyle]}>
            {swipePoints.map((point, index) => (
              <View
                key={index}
                style={[
                  styles.trailPoint,
                  {
                    left: point.x,
                    top: point.y,
                    opacity: index / swipePoints.length,
                  },
                ]}
              />
            ))}
          </Animated.View>
        )}

        {/* Calculator card */}
        <Animated.View style={[styles.calculatorCard, animatedStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <View style={styles.emoji}>🧮</View>
              <View style={styles.title}>Swype Calculator</View>
            </View>
          </View>

          {/* Display */}
          <View style={styles.displayContainer}>
            <Display
              expression={expression}
              result={result}
              showResult={showResult}
              style={styles.display}
            />
          </View>

          {/* Error message */}
          {error && (
            <View style={styles.errorContainer}>
              <View style={styles.errorText}>{error}</View>
            </View>
          )}

          {/* Calculator grid */}
          <View style={styles.gridContainer}>
            <CalculatorGrid
              items={gridItems}
              onButtonPress={(value) => {
                handleHaptic('light');
                handleInput(value);
              }}
              gap="8px"
              style={styles.grid}
            />
          </View>

          {/* Gesture hints */}
          <View style={styles.hintsContainer}>
            <View style={styles.hintsTitle}>Gesture Shortcuts:</View>
            <View style={styles.hintsGrid}>
              <View style={styles.hint}>→ +</View>
              <View style={styles.hint}>← -</View>
              <View style={styles.hint}>↑ ×</View>
              <View style={styles.hint}>↓ ÷</View>
              <View style={styles.hint}>↻ =</View>
              <View style={styles.hint}>↺ C</View>
            </View>
          </View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

function recognizeGesture(points: Point[]): any {
  if (points.length < 2) return null;

  const start = points[0];
  const end = points[points.length - 1];
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 50) {
    return { type: 'tap' };
  }

  // Check for circular gesture
  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  const avgRadius = points.reduce((sum, p) => {
    return sum + Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2);
  }, 0) / points.length;

  const variance = points.reduce((sum, p) => {
    const radius = Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2);
    return sum + (radius - avgRadius) ** 2;
  }, 0) / points.length;

  const isCircle = variance < 1000 && avgRadius > 30;

  if (isCircle) {
    // Determine direction
    const firstAngle = Math.atan2(points[0].y - centerY, points[0].x - centerX);
    const lastAngle = Math.atan2(
      points[points.length - 1].y - centerY,
      points[points.length - 1].x - centerX,
    );
    const angleDiff = lastAngle - firstAngle;

    if (angleDiff > Math.PI) {
      return { type: 'circle', direction: 'clockwise' };
    } else if (angleDiff < -Math.PI) {
      return { type: 'circle', direction: 'counter-clockwise' };
    }
    return { type: 'circle', direction: 'clockwise' };
  }

  // Direction gestures
  const angle = Math.atan2(dy, dx);
  const absAngle = Math.abs(angle);

  if (absAngle < Math.PI / 4) {
    return { type: 'swipe', direction: 'right' };
  } else if (absAngle > 3 * Math.PI / 4) {
    return { type: 'swipe', direction: 'left' };
  } else if (angle < 0) {
    return { type: 'swipe', direction: 'up' };
  } else {
    return { type: 'swipe', direction: 'down' };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667EEA',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
  },
  trailContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1000,
  },
  trailPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 122, 255, 0.6)',
  },
  calculatorCard: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 30,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(20px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  displayContainer: {
    marginBottom: 16,
  },
  display: {
    minHeight: 120,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    marginBottom: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
  },
  gridContainer: {
    marginBottom: 20,
  },
  grid: {
    borderRadius: 30,
  },
  hintsContainer: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(20px)',
  },
  hintsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  hintsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  hint: {
    fontSize: 12,
    color: 'rgba(28, 28, 30, 0.8)',
    marginBottom: 4,
    width: '32%',
    textAlign: 'center',
  },
});
