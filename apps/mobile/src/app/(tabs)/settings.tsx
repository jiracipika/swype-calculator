'use client';

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useCalculator } from '@swype-calc/ui';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const { history, clearHistory } = useCalculator();

  const settings = [
    {
      id: 'haptics',
      title: 'Haptic Feedback',
      description: 'Vibrate on button press',
      enabled: true,
    },
    {
      id: 'sounds',
      title: 'Sound Effects',
      description: 'Play sounds on actions',
      enabled: false,
    },
    {
      id: 'darkMode',
      title: 'Dark Mode',
      description: 'Use dark color scheme',
      enabled: false,
    },
  ];

  const handleHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const toggleSetting = (id: string) => {
    handleHaptic();
    // TODO: Implement setting toggles
  };

  return (
    <View style={styles.container}>
      <View style={styles.background} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={styles.emoji}>⚙️</View>
            <View style={styles.title}>Settings</View>
          </View>
        </View>

        <ScrollView style={styles.settingsList}>
          {settings.map((setting) => (
            <TouchableOpacity
              key={setting.id}
              style={styles.settingItem}
              onPress={() => toggleSetting(setting.id)}
            >
              <View style={styles.settingContent}>
                <View style={styles.settingTitle}>{setting.title}</View>
                <View style={styles.settingDescription}>
                  {setting.description}
                </View>
              </View>
              <View
                style={[
                  styles.toggle,
                  setting.enabled ? styles.toggleEnabled : styles.toggleDisabled,
                ]}
              >
                <View
                  style={[
                    styles.toggleDot,
                    setting.enabled ? styles.toggleDotEnabled : null,
                  ]}
                />
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.section}>
            <View style={styles.sectionTitle}>Data</View>
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              handleHaptic();
              clearHistory();
            }}
          >
            <View style={styles.settingContent}>
              <View style={[styles.settingTitle, styles.dangerText]}>
                Clear History
              </View>
              <View style={styles.settingDescription}>
                Delete all calculation history
              </View>
            </View>
            <View style={styles.arrow}>→</View>
          </TouchableOpacity>

          <View style={styles.section}>
            <View style={styles.sectionTitle}>About</View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoLabel}>Version</View>
            <View style={styles.infoValue}>1.0.0</View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoLabel}>Build</View>
            <View style={styles.infoValue}>1</View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoLabel}>Platform</View>
            <View style={styles.infoValue}>iOS & Android</View>
          </View>
        </ScrollView>
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
  settingsList: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#8E8E93',
  },
  dangerText: {
    color: '#FF3B30',
  },
  arrow: {
    fontSize: 20,
    color: '#8E8E93',
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 2,
  },
  toggleEnabled: {
    backgroundColor: '#34C759',
  },
  toggleDisabled: {
    backgroundColor: '#E5E5EA',
  },
  toggleDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleDotEnabled: {
    marginLeft: 18,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  infoValue: {
    fontSize: 16,
    color: '#8E8E93',
  },
});
