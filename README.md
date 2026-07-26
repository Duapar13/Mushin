# Mushin (無心)

Application de tracking d'habitudes de jeu pour **Counter-Strike 2**, pensée pour analyser mes performances et rester en état de flow ("lock-in") pour progresser.

*Mushin* — l'esprit sans esprit — désigne l'état de flow où l'on joue en pilote automatique, sans réfléchir.

## Stack

- [Expo](https://expo.dev) (managed workflow, testable en live via Expo Go) + TypeScript strict
- [Expo Router](https://docs.expo.dev/router/introduction/) pour la navigation (tabs)
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) pour le stockage 100% local
- [react-native-gifted-charts](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts) + SVG custom pour les graphiques
- [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) pour les rappels de streak
- Police manuscrite [Dancing Script](https://fonts.google.com/specimen/Dancing+Script) pour le wordmark

## Design

- Style natif iOS, épuré, listes groupées, safe areas respectées
- Palette strictement noir & blanc, thème clair/sombre automatique (`useColorScheme`)
- Seule touche de couleur : le wordmark **Mushin** en rouge (`#A32D2D`), écriture manuscrite, présent sur le splash screen et en haut du Dashboard

## Fonctionnalités

- **Dashboard** — résumé 7 jours vs période précédente, streak, progression des objectifs, graphiques (win rate / K/D / ADR / HS% par semaine, corrélation sommeil × K/D, performance par map)
- **Nouvelle session** — formulaire complet (map, résultat, K/D/A, ADR, HS%, rang/ELO, durée, focus/tilt avant-après, sommeil, notes)
- **Historique** — sessions groupées par date, éditables et supprimables
- **Objectifs** — cibles personnalisées (win rate, K/D, ADR, HS%, rang) avec barres de progression
- Rappel quotidien local si aucune session n'a encore été loggée

Tout fonctionne offline, aucune donnée ne quitte le téléphone, pas de compte.

## Lancer le projet

```bash
npm install
npx expo start
```

Scanner le QR code avec l'app **Expo Go** sur iPhone.

## Historique de développement

Ce projet a été initialement scaffoldé avec l'assistance de [Claude Code](https://claude.com/claude-code).
