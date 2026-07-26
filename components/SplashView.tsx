import { StyleProp, View, ViewStyle } from 'react-native';
import { MushinWordmark } from './MushinWordmark';
import { useTheme } from '../hooks/useTheme';

export function SplashView({ style }: { style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <MushinWordmark size={56} />
    </View>
  );
}
