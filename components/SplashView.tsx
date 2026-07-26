import { View } from 'react-native';
import { MushinWordmark } from './MushinWordmark';
import { useTheme } from '../hooks/useTheme';

export function SplashView() {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MushinWordmark size={56} />
    </View>
  );
}
