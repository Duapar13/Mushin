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
- Palette noir & blanc selon le thème système (`useColorScheme`), avec le **rouge** (`#A32D2D`) comme accent de marque : wordmark, tab actif, barres de progression, points des graphiques
- Wordmark **Mushin** en écriture manuscrite, présent sur le splash screen et en haut du Dashboard

## Fonctionnalités

- **Dashboard** — résumé 7 jours vs période précédente, streak, progression des objectifs, graphiques (win rate / K/D / ADR / HS% par semaine, corrélation sommeil × K/D, performance par map)
- **Nouvelle session** — formulaire complet (map, résultat, K/D/A, ADR, HS%, rang Faceit ou Premier, ressenti /10, sommeil, notes)
- **Historique** — sessions groupées par date, éditables et supprimables
- **Objectifs** — cibles personnalisées (win rate, K/D, ADR, HS%, rang) avec barres de progression
- Rappel quotidien local si aucune session n'a encore été loggée

Tout fonctionne offline, aucune donnée ne quitte le téléphone, pas de compte.

## Stockage des données

Tout est stocké **localement sur le téléphone**, dans une base **SQLite** (`expo-sqlite`, fichier `mushin.db`), sans aucun backend ni synchronisation réseau. Le schéma (défini dans [`db/schema.ts`](db/schema.ts)) a deux tables :

**`sessions`** — une ligne par session loggée :

| Colonne | Type | Détail |
|---|---|---|
| `playedAt` | texte (ISO) | date + heure d'enregistrement de la session (auto, non éditable) |
| `map` | texte | map jouée |
| `result` | texte | `win` / `loss` / `draw` |
| `kills`, `deaths`, `assists` | entier | |
| `adr`, `hsPercent` | réel | |
| `rankSystem` | texte | `faceit` ou `premier` |
| `rankValue` | réel | niveau Faceit (1-10) ou ELO Premier |
| `feeling` | entier | ressenti général sur la game, 1-10 |
| `sleepHours` | réel | heures de sommeil avant la session |
| `notes` | texte | libre, optionnel |
| `createdAt`, `updatedAt` | texte (ISO) | horodatage d'enregistrement |

**`goals`** — une ligne par objectif défini (métrique visée, valeur cible, date de création).

Côté app, [`context/DataContext.tsx`](context/DataContext.tsx) charge toutes les sessions/objectifs en mémoire au démarrage et réexécute la requête après chaque écriture (ajout, édition, suppression) ; c'est cet unique contexte que consomment le Dashboard, l'Historique et les Objectifs — pas de requête SQL éparpillée dans les écrans. Enregistrer une session revient à : saisir le formulaire (`components/SessionForm.tsx`) → `INSERT` dans `sessions` (`db/sessions.ts`) → rechargement du contexte → l'app entière se met à jour.

La base évolue par migrations versionnées (`PRAGMA user_version`) : à l'installation d'une nouvelle version du schéma, `migrateDb` compare la version stockée à la version attendue et applique les changements nécessaires.

## Lancer le projet

```bash
npm install
npx expo start
```

Scanner le QR code avec l'app **Expo Go** sur iPhone.

> Depuis mi-2026, l'app Expo Go de l'App Store ne supporte que le SDK Expo 54 (les SDK plus récents restent bloqués en review Apple) — le projet est volontairement pinné sur cette version pour rester testable en live sans compte développeur Apple.

## Historique de développement

Ce projet a été initialement scaffoldé avec l'assistance de [Claude Code](https://claude.com/claude-code).
