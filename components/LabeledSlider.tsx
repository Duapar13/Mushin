import { View } from 'react-native';
import Slider from '@react-native-community/slider';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step: number;
  formatValue: (value: number) => string;
}

export function LabeledSlider({
  label,
  value,
  onChange,
  minimumValue,
  maximumValue,
  step,
  formatValue,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <ThemedText variant="subhead" color="secondary">
          {label}
        </ThemedText>
        <ThemedText variant="subhead" weight="700" color="accent">
          {formatValue(value)}
        </ThemedText>
      </View>
      <Slider
        value={value}
        onValueChange={onChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor={colors.accent}
        maximumTrackTintColor={colors.fillSecondary}
        thumbTintColor={colors.accent}
      />
    </View>
  );
}
