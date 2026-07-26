import { View } from 'react-native';
import Slider from '@react-native-community/slider';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export function FeelingSlider({ value, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <ThemedText variant="subhead" color="secondary">
          Ressenti général
        </ThemedText>
        <ThemedText variant="subhead" weight="700" color="accent">
          {value}/10
        </ThemedText>
      </View>
      <Slider
        value={value}
        onValueChange={(v) => onChange(Math.round(v))}
        minimumValue={1}
        maximumValue={10}
        step={1}
        minimumTrackTintColor={colors.accent}
        maximumTrackTintColor={colors.fillSecondary}
        thumbTintColor={colors.accent}
      />
    </View>
  );
}
