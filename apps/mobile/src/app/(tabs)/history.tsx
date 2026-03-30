'use client';

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useCalculator } from '@swype-calc/ui';
import * as Haptics from 'expo-haptics';

export default function HistoryScreen() {
  const { history, useFromHistory, clearHistory } = useCalculator();

  const handleHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.container}>
      <View style={styles.background} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={styles.emoji}>📊</View>
            <View style={styles.title}>History</View>
          </View>
        </View>

        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyEmoji}>📭</View>
            <View style={styles.emptyText}>No calculations yet</View>
            <View style={styles.emptySubtext}>
              Start using the calculator to see your history here
            </View>
          </View>
        ) : (
          <ScrollView style={styles.historyList}>
            {history.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.historyItem}
                onPress={() => {
                  handleHaptic();
                  useFromHistory(item);
                }}
              >
                <View style={styles.historyExpression}>{item.expression}</View>
                <View style={styles.historyResult}>= {item.result}</View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {history.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              handleHaptic();
              clearHistory();
            }}
          >
            <View style={styles.clearButtonText}>Clear All</View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
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
  content: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 30,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(20px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 12,
  },
  historyExpression: {
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  historyResult: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
  },
  clearButton: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    textAlign: 'center',
  },
});
