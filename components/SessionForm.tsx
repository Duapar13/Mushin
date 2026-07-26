import { useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CS2_MAPS, MatchResult, Session, SessionInput } from '../types';
import { FormRow } from './FormRow';
import { Input } from './Input';
import { Button } from './Button';
import { SegmentedControl } from './SegmentedControl';
import { ChipSelector } from './ChipSelector';
import { ScaleSelector } from './ScaleSelector';
import { ThemedText } from './ThemedText';
import { Card } from './Card';
import { Spacing } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';

interface Props {
  initial?: Session;
  onSubmit: (input: SessionInput) => Promise<void>;
  submitLabel: string;
  onDelete?: () => Promise<void>;
}

const RESULT_OPTIONS: { label: string; value: MatchResult }[] = [
  { label: 'Victoire', value: 'win' },
  { label: 'Défaite', value: 'loss' },
  { label: 'Égalité', value: 'draw' },
];

export function SessionForm({ initial, onSubmit, submitLabel, onDelete }: Props) {
  const { colors } = useTheme();
  const [playedAt, setPlayedAt] = useState(
    initial ? new Date(initial.playedAt) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [map, setMap] = useState(initial?.map ?? CS2_MAPS[0]);
  const [customMap, setCustomMap] = useState(
    initial && !CS2_MAPS.includes(initial.map as any) ? initial.map : ''
  );
  const [result, setResult] = useState<MatchResult>(initial?.result ?? 'win');
  const [kills, setKills] = useState(String(initial?.kills ?? ''));
  const [deaths, setDeaths] = useState(String(initial?.deaths ?? ''));
  const [assists, setAssists] = useState(String(initial?.assists ?? ''));
  const [adr, setAdr] = useState(String(initial?.adr ?? ''));
  const [hsPercent, setHsPercent] = useState(String(initial?.hsPercent ?? ''));
  const [rank, setRank] = useState(initial?.rank ?? '');
  const [durationMinutes, setDurationMinutes] = useState(
    String(initial?.durationMinutes ?? '')
  );
  const [focusBefore, setFocusBefore] = useState(initial?.focusBefore ?? 3);
  const [focusAfter, setFocusAfter] = useState(initial?.focusAfter ?? 3);
  const [tiltBefore, setTiltBefore] = useState(initial?.tiltBefore ?? 1);
  const [tiltAfter, setTiltAfter] = useState(initial?.tiltAfter ?? 1);
  const [sleepHours, setSleepHours] = useState(
    String(initial?.sleepHours ?? '7')
  );
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [submitting, setSubmitting] = useState(false);

  const num = (v: string) => {
    const n = parseFloat(v.replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const finalMap = map === 'Autre' ? customMap.trim() || 'Autre' : map;
      const input: SessionInput = {
        playedAt: playedAt.toISOString(),
        map: finalMap,
        result,
        kills: Math.round(num(kills)),
        deaths: Math.round(num(deaths)),
        assists: Math.round(num(assists)),
        adr: num(adr),
        hsPercent: num(hsPercent),
        rank: rank.trim(),
        durationMinutes: Math.round(num(durationMinutes)),
        focusBefore,
        focusAfter,
        tiltBefore,
        tiltAfter,
        sleepHours: num(sleepHours),
        notes: notes.trim(),
      };
      await onSubmit(input);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.lg }}
      keyboardShouldPersistTaps="handled"
    >
      <Card style={{ gap: 0 }}>
        <ThemedText variant="headline" style={{ marginBottom: Spacing.sm }}>
          Session
        </ThemedText>

        <FormRow label="Date">
          <Button
            title={playedAt.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
            variant="plain"
            onPress={() => setShowDatePicker(true)}
          />
          {showDatePicker && (
            <DateTimePicker
              value={playedAt}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(_, date) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (date) setPlayedAt(date);
              }}
            />
          )}
        </FormRow>

        <FormRow label="Heure">
          <Button
            title={playedAt.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
            variant="plain"
            onPress={() => setShowTimePicker(true)}
          />
          {showTimePicker && (
            <DateTimePicker
              value={playedAt}
              mode="time"
              display="default"
              onChange={(_, date) => {
                setShowTimePicker(false);
                if (date) setPlayedAt(date);
              }}
            />
          )}
        </FormRow>

        <FormRow label="Map">
          <ChipSelector options={CS2_MAPS} value={map} onChange={setMap} />
          {map === 'Autre' && (
            <Input
              placeholder="Nom de la map"
              value={customMap}
              onChangeText={setCustomMap}
            />
          )}
        </FormRow>

        <FormRow label="Résultat">
          <SegmentedControl
            options={RESULT_OPTIONS}
            value={result}
            onChange={setResult}
          />
        </FormRow>
      </Card>

      <Card style={{ gap: 0 }}>
        <ThemedText variant="headline" style={{ marginBottom: Spacing.sm }}>
          Performance
        </ThemedText>
        <View style={{ flexDirection: 'row', gap: Spacing.md }}>
          <FormRow label="Kills" >
            <Input
              keyboardType="number-pad"
              value={kills}
              onChangeText={setKills}
              placeholder="0"
            />
          </FormRow>
          <FormRow label="Deaths">
            <Input
              keyboardType="number-pad"
              value={deaths}
              onChangeText={setDeaths}
              placeholder="0"
            />
          </FormRow>
          <FormRow label="Assists">
            <Input
              keyboardType="number-pad"
              value={assists}
              onChangeText={setAssists}
              placeholder="0"
            />
          </FormRow>
        </View>
        <View style={{ flexDirection: 'row', gap: Spacing.md }}>
          <FormRow label="ADR">
            <Input
              keyboardType="decimal-pad"
              value={adr}
              onChangeText={setAdr}
              placeholder="0"
            />
          </FormRow>
          <FormRow label="HS%">
            <Input
              keyboardType="decimal-pad"
              value={hsPercent}
              onChangeText={setHsPercent}
              placeholder="0"
            />
          </FormRow>
        </View>
        <FormRow label="Rang / ELO actuel">
          <Input
            value={rank}
            onChangeText={setRank}
            placeholder="ex : Elite Gold Master / 15 000"
          />
        </FormRow>
        <FormRow label="Durée de la session (minutes)">
          <Input
            keyboardType="number-pad"
            value={durationMinutes}
            onChangeText={setDurationMinutes}
            placeholder="0"
          />
        </FormRow>
      </Card>

      <Card style={{ gap: 0 }}>
        <ThemedText variant="headline" style={{ marginBottom: Spacing.sm }}>
          État mental
        </ThemedText>
        <FormRow label="Focus avant (1-5)">
          <ScaleSelector value={focusBefore} onChange={setFocusBefore} />
        </FormRow>
        <FormRow label="Focus après (1-5)">
          <ScaleSelector value={focusAfter} onChange={setFocusAfter} />
        </FormRow>
        <FormRow label="Tilt avant (1-5)">
          <ScaleSelector value={tiltBefore} onChange={setTiltBefore} />
        </FormRow>
        <FormRow label="Tilt après (1-5)">
          <ScaleSelector value={tiltAfter} onChange={setTiltAfter} />
        </FormRow>
        <FormRow label="Heures de sommeil avant la session">
          <Input
            keyboardType="decimal-pad"
            value={sleepHours}
            onChangeText={setSleepHours}
            placeholder="7"
          />
        </FormRow>
      </Card>

      <Card style={{ gap: Spacing.sm }}>
        <ThemedText variant="headline">Notes</ThemedText>
        <Input
          value={notes}
          onChangeText={setNotes}
          placeholder="Optionnel"
          multiline
          style={{ minHeight: 60 }}
        />
      </Card>

      <Button
        title={submitting ? 'Enregistrement…' : submitLabel}
        onPress={handleSubmit}
        disabled={submitting}
      />

      {onDelete && (
        <Button title="Supprimer la session" variant="destructive" onPress={onDelete} />
      )}
    </ScrollView>
  );
}
