import React from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';
import { theme } from '@shared/theme';

interface Props {
  text: string;
  style?: StyleProp<TextStyle>;
  onHashtagPress?: (tag: string) => void;
}

export function HashtagText({ text, style, onHashtagPress }: Props) {
  const parts = text.split(/(#\w+)/g);

  return (
    <Text style={style}>
      {parts.map((part, i) => {
        if (part.startsWith('#')) {
          const tag = part.slice(1);
          return (
            <Text
              key={i}
              style={{ color: theme.colors.primary, fontFamily: theme.typography.fontBodyMedium }}
              onPress={() => onHashtagPress?.(tag)}
            >
              {part}
            </Text>
          );
        }
        return <Text key={i}>{part}</Text>;
      })}
    </Text>
  );
}
