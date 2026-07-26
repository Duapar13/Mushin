import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { CS2_MAPS, MatchResult, RankSystem, Session, SessionInput } from '../types';
import { RANK_SYSTEM_LABELS } from '../utils/rank';
import { FormRow } from './FormRow';
import { Input } from './Input';
import { Button } from './Button';
import { SegmentedControl } from './SegmentedControl';
import { ChipSelector } from './ChipSelector';
import { ThemedText } from './ThemedText';
import { Card } from './Card';
import { Spacing } from '../constants/theme';

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

const RANK_SYSTEM_OPTIONS: { label: string; value: RankSystem }[] = [
  { label: RANK_SYSTEM_LABELS.faceit, value: 'faceit' },
  { label: RANK_SYSTEM_LABELS.premier, value: 'premier' },
];

const FACEIT_LEVELS = Array.from({ length: 10 }, (_, i) => String(i + 1));

export function SessionForm({ initial, onSubmit, submitLabel, onDelete }: Props) {
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
  const [rankSystem, setRankSystem] = useState<RankSystem>(
    initial?.rankSystem ?? 'premier'
  );
  const [faceitLevel, setFaceitLevel] = useState(
    initial?.rankSystem === 'faceit' ? String(initial.rankValue) : '5'
  );
  const [premierElo, setPremierElo] = useState(
    initial?.rankSystem === 'premier' && initial.rankValue > 0
      ? String(initial.rankValue)
      : ''
  );
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [submitting, setSubmitting] = useState(false);

  const num = (v: string) => {
    const n = parseFloat(v.replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  };

  const resetForm = () => {
    setMap(CS2_MAPS[0]);
    setCustomMap('');
    setResult('win');
    setKills('');
    setDeaths('');
    setAssists('');
    setAdr('');
    setHsPercent('');
    setRankSystem('premier');
    setFaceitLevel('5');
    setPremierElo('');
    setNotes('');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const finalMap = map === 'Autre' ? customMap.trim() || 'Autre' : map;
      const input: SessionInput = {
        playedAt: initial ? initial.playedAt : new Date().toISOString(),
        map: finalMap,
        result,
        kills: Math.round(num(kills)),
        deaths: Math.round(num(deaths)),
        assists: Math.round(num(assists)),
        adr: num(adr),
        hsPercent: num(hsPercent),
        rankSystem,
        rankValue: rankSystem === 'faceit' ? num(faceitLevel) : num(premierElo),
        notes: notes.trim(),
      };
      await onSubmit(input);
      // Editing keeps the field values on screen; only a fresh "new session"
      // entry clears back to defaults so another one can be logged right away.
      if (!initial) resetForm();
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
        <FormRow label="Système de rang">
          <SegmentedControl
            options={RANK_SYSTEM_OPTIONS}
            value={rankSystem}
            onChange={setRankSystem}
          />
        </FormRow>
        {rankSystem === 'faceit' ? (
          <FormRow label="Niveau Faceit">
            <ChipSelector
              options={FACEIT_LEVELS}
              value={faceitLevel}
              onChange={setFaceitLevel}
            />
          </FormRow>
        ) : (
          <FormRow label="ELO Premier">
            <Input
              keyboardType="number-pad"
              value={premierElo}
              onChangeText={setPremierElo}
              placeholder="ex : 15000"
            />
          </FormRow>
        )}
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
