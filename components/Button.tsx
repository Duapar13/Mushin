import { Pressable, PressableProps } from 'react-native';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';
import { Radius, Spacing } from '../constants/theme';

interface Props extends PressableProps {
  title: string;
  variant?: 'filled' | 'plain' | 'destructive';
}

export function Button({ title, variant = 'filled', style, ...rest }: Props) {
  const { colors } = useTheme();

  if (variant === 'plain') {
    return (
      <Pressable style={style} {...rest}>
        <ThemedText variant="body" weight="600" color="accent">
          {title}
        </ThemedText>
      </Pressable>
    );
  }

  const backgroundColor =
    variant === 'destructive' ? colors.accent : colors.text;
  const textColor = variant === 'destructive' ? '#FFFFFF' : colors.background;

  return (
    <Pressable
      style={(state) => [
        {
          backgroundColor,
          borderRadius: Radius.md,
          paddingVertical: Spacing.md,
          alignItems: 'center',
          opacity: state.pressed ? 0.7 : 1,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      <ThemedText variant="body" weight="600" style={{ color: textColor }}>
        {title}
      </ThemedText>
    </Pressable>
  );
}
