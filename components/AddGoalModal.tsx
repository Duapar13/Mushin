import { useState } from 'react';
import { Modal, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoalInput, GoalMetric } from '../types';
import { GOAL_METRIC_LABELS } from '../utils/goalProgress';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Button } from './Button';
import { FormRow } from './FormRow';
import { Input } from './Input';
import { ChipSelector } from './ChipSelector';
import { Spacing } from '../constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: GoalInput) => Promise<void>;
}

const METRICS: GoalMetric[] = ['winRate', 'kd', 'adr', 'hsPercent', 'rank'];

const PLACEHOLDERS: Record<GoalMetric, string> = {
  winRate: '55',
  kd: '1.2',
  adr: '85',
  hsPercent: '50',
  rank: '',
};

export function AddGoalModal({ visible, onClose, onSubmit }: Props) {
  const [metric, setMetric] = useState<GoalMetric>('winRate');
  const [targetValue, setTargetValue] = useState('');
  const [targetLabel, setTargetLabel] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setMetric('winRate');
    setTargetValue('');
    setTargetLabel('');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit({
        metric,
        label: GOAL_METRIC_LABELS[metric],
        targetValue: parseFloat(targetValue.replace(',', '.')) || 0,
        targetLabel: targetLabel.trim(),
      });
      reset();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ThemedView variant="grouped" style={{ flex: 1 }}>
        <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: Spacing.lg,
              paddingTop: Spacing.md,
            }}
          >
            <Button title="Annuler" variant="plain" onPress={onClose} />
            <ThemedText variant="headline">Nouvel objectif</ThemedText>
            <View style={{ width: 60 }} />
          </View>

          <View style={{ padding: Spacing.lg, gap: Spacing.lg, flex: 1 }}>
            <FormRow label="Métrique">
              <ChipSelector
                options={METRICS.map((m) => GOAL_METRIC_LABELS[m])}
                value={GOAL_METRIC_LABELS[metric]}
                onChange={(label) =>
                  setMetric(
                    (Object.keys(GOAL_METRIC_LABELS) as GoalMetric[]).find(
                      (m) => GOAL_METRIC_LABELS[m] === label
                    ) ?? 'winRate'
                  )
                }
              />
            </FormRow>

            {metric === 'rank' ? (
              <FormRow label="Rang / ELO visé">
                <Input
                  value={targetLabel}
                  onChangeText={setTargetLabel}
                  placeholder="ex : Faceit Level 8 ou Premier 20 000"
                />
              </FormRow>
            ) : (
              <FormRow label={`Valeur cible ${metric === 'winRate' || metric === 'hsPercent' ? '(%)' : ''}`}>
                <Input
                  keyboardType="decimal-pad"
                  value={targetValue}
                  onChangeText={setTargetValue}
                  placeholder={PLACEHOLDERS[metric]}
                />
              </FormRow>
            )}

            <Button
              title={submitting ? 'Ajout…' : 'Ajouter l’objectif'}
              onPress={handleSubmit}
              disabled={submitting}
            />
          </View>
        </SafeAreaView>
      </ThemedView>
    </Modal>
  );
}
