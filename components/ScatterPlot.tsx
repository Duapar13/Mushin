import { View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';
import { ThemedText } from './ThemedText';

interface Point {
  x: number;
  y: number;
}

interface Props {
  points: Point[];
  xLabel: string;
  yLabel: string;
  height?: number;
}

const PADDING = 28;

export function ScatterPlot({ points, xLabel, yLabel, height = 200 }: Props) {
  const { colors } = useTheme();
  const width = 320;

  if (points.length < 2) {
    return (
      <View style={{ height, alignItems: 'center', justifyContent: 'center' }}>
        <ThemedText color="tertiary" variant="footnote">
          Pas encore assez de données
        </ThemedText>
      </View>
    );
  }

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = 0;
  const yMax = Math.max(...ys) * 1.15 || 1;

  const scaleX = (v: number) =>
    PADDING + ((v - xMin) / (xMax - xMin || 1)) * (width - PADDING * 2);
  const scaleY = (v: number) =>
    height - PADDING - ((v - yMin) / (yMax - yMin || 1)) * (height - PADDING * 2);

  return (
    <View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Line
          x1={PADDING}
          y1={height - PADDING}
          x2={width - PADDING}
          y2={height - PADDING}
          stroke={colors.separator}
          strokeWidth={1}
        />
        <Line
          x1={PADDING}
          y1={PADDING}
          x2={PADDING}
          y2={height - PADDING}
          stroke={colors.separator}
          strokeWidth={1}
        />
        {points.map((p, i) => (
          <Circle
            key={i}
            cx={scaleX(p.x)}
            cy={scaleY(p.y)}
            r={4}
            fill={colors.text}
            opacity={0.75}
          />
        ))}
        <SvgText
          x={PADDING}
          y={height - 8}
          fontSize={10}
          fill={colors.textSecondary}
        >
          {xMin.toFixed(0)}
        </SvgText>
        <SvgText
          x={width - PADDING}
          y={height - 8}
          fontSize={10}
          fill={colors.textSecondary}
          textAnchor="end"
        >
          {xMax.toFixed(0)}
        </SvgText>
      </Svg>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <ThemedText variant="caption" color="tertiary">
          {yLabel} (haut) · {xLabel} (bas)
        </ThemedText>
      </View>
    </View>
  );
}
