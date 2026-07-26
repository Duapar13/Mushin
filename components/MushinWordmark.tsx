import { Text, TextStyle } from 'react-native';
import { RED_ACCENT } from '../constants/theme';

interface Props {
  size?: number;
  style?: TextStyle;
}

export function MushinWordmark({ size = 40, style }: Props) {
  return (
    <Text
      style={[
        {
          fontFamily: 'DancingScript_700Bold',
          fontSize: size,
          color: RED_ACCENT,
          includeFontPadding: false,
        },
        style,
      ]}
    >
      Mushin
    </Text>
  );
}
