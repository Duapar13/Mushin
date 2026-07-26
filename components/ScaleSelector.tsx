import { Pressable, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function ScaleSelector({ value, onChange, min = 1, max = 5 }: Props) {
  const { colors } = useTheme();
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {values.map((v) => {
        const selected = v === value;
        return (
          <Pressable
            key={v}
            onPress={() => onChange(v)}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selected ? colors.text : colors.fill,
            }}
          >
            <ThemedText
              variant="subhead"
              weight="600"
              style={{ color: selected ? colors.background : colors.text }}
            >
              {v}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}
