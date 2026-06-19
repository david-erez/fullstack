import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import type { MediaFile } from '@core/domain/entities';
import { theme } from '@shared/theme';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = SCREEN_W - theme.spacing['4'] * 2 - theme.spacing['4'] * 2;

interface Props {
  media: MediaFile[];
  onPress?: (index: number) => void;
}

export function MediaGrid({ media, onPress }: Props) {
  const count = Math.min(media.length, 4);
  const items = media.slice(0, count);

  if (count === 1) {
    return (
      <TouchableOpacity onPress={() => onPress?.(0)} activeOpacity={0.9}>
        <Image
          source={{ uri: items[0].url }}
          style={styles.single}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  }

  if (count === 2) {
    return (
      <View style={styles.row}>
        {items.map((m, i) => (
          <TouchableOpacity key={m.mediaId} onPress={() => onPress?.(i)} style={styles.halfWrap}>
            <Image source={{ uri: m.url }} style={styles.half} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  if (count === 3) {
    return (
      <View style={styles.row}>
        <TouchableOpacity onPress={() => onPress?.(0)} style={styles.halfWrap}>
          <Image source={{ uri: items[0].url }} style={styles.half} resizeMode="cover" />
        </TouchableOpacity>
        <View style={[styles.halfWrap, styles.column]}>
          {items.slice(1).map((m, i) => (
            <TouchableOpacity key={m.mediaId} onPress={() => onPress?.(i + 1)} style={styles.quarterWrap}>
              <Image source={{ uri: m.url }} style={styles.quarter} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  // 4 items
  return (
    <View style={styles.grid2x2}>
      {items.map((m, i) => (
        <TouchableOpacity key={m.mediaId} onPress={() => onPress?.(i)} style={styles.gridItemWrap}>
          <Image source={{ uri: m.url }} style={styles.gridItem} resizeMode="cover" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const HALF = (CARD_W - theme.spacing['2']) / 2;
const QUARTER = (HALF - theme.spacing['2']) / 2;

const styles = StyleSheet.create({
  single: {
    width: '100%',
    height: 220,
    borderRadius: theme.radii.lg,
    marginBottom: theme.spacing['3'],
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing['2'],
    marginBottom: theme.spacing['3'],
  },
  halfWrap: { flex: 1 },
  half: {
    width: '100%',
    height: 160,
    borderRadius: theme.radii.md,
  },
  column: {
    gap: theme.spacing['2'],
  },
  quarterWrap: { flex: 1 },
  quarter: {
    width: '100%',
    height: (160 - theme.spacing['2']) / 2,
    borderRadius: theme.radii.md,
  },
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing['2'],
    marginBottom: theme.spacing['3'],
  },
  gridItemWrap: {
    width: HALF,
    height: 130,
  },
  gridItem: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radii.md,
  },
});
