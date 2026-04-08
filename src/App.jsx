import { useState } from 'react';
import StartScreen from './components/StartScreen';
import LoadingScreen from './components/LoadingScreen';
import TournamentScreen from './components/TournamentScreen';
import ResultScreen from './components/ResultScreen';
import { loadGoogleMapsApi, searchRestaurants, normalizePlace, normalizeMock } from './services/placesApi';
import { MOCK_RESTAURANTS } from './services/mockData';
import { createBracket, createMatches } from './utils/tournament';
import './App.css';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const initialTournament = {
  matches: [],
  matchIndex: 0,
  roundWinners: [],
  roundNumber: 1,
  totalRounds: 3,
  bracketSize: 8,
  winner: null,
};

export default function App() {
  const [screen, setScreen] = useState('start');
  const [loadingMsg, setLoadingMsg] = useState('주변 식당을 불러오는 중...');
  const [t, setT] = useState(initialTournament); // tournament state

  const handleStart = async (location, filters) => {
    setScreen('loading');

    let restaurants = [];

    if (API_KEY && !location.demo) {
      try {
        setLoadingMsg('Google Places API로 주변 식당 검색 중...');
        const maps = await loadGoogleMapsApi(API_KEY);
        setLoadingMsg('식당 정보를 불러오는 중...');
        const raw = await searchRestaurants(maps, location, filters.radius, filters.category);
        restaurants = raw
          .filter((p) => filters.minRating === 0 || (p.rating ?? 0) >= filters.minRating)
          .map(normalizePlace);
      } catch (err) {
        console.warn('Places API 실패:', err);
      }
    }

    if (restaurants.length < 4) {
      setLoadingMsg('데모 데이터로 진행합니다...');
      let mock = MOCK_RESTAURANTS
        .filter((r) => filters.minRating === 0 || r.rating >= filters.minRating)
        .filter((r) => filters.category === '전체' || r.category === filters.category)
        .map(normalizeMock);
      if (mock.length < 4) mock = MOCK_RESTAURANTS.map(normalizeMock);
      restaurants = mock;
    }

    await new Promise((r) => setTimeout(r, 600));

    const bracket = createBracket(restaurants, filters.size);
    const size = bracket.length;
    const firstMatches = createMatches(bracket);
    const totalRounds = Math.ceil(Math.log2(size));

    setT({
      matches: firstMatches,
      matchIndex: 0,
      roundWinners: [],
      roundNumber: 1,
      totalRounds,
      bracketSize: size,
      winner: null,
    });
    setScreen('tournament');
  };

  const handleSelect = (selected) => {
    setT((prev) => {
      const newWinners = [...prev.roundWinners, selected];
      const nextIndex = prev.matchIndex + 1;
      const roundDone = nextIndex >= prev.matches.length;

      if (!roundDone) {
        return { ...prev, matchIndex: nextIndex, roundWinners: newWinners };
      }

      // Round complete
      if (newWinners.length === 1) {
        // We have a final winner — flip screen after state settles
        setTimeout(() => setScreen('result'), 0);
        return { ...prev, matchIndex: nextIndex, roundWinners: newWinners, winner: newWinners[0] };
      }

      // Advance to next round
      return {
        ...prev,
        matches: createMatches(newWinners),
        matchIndex: 0,
        roundWinners: [],
        roundNumber: prev.roundNumber + 1,
      };
    });
  };

  const handleRestart = () => {
    setT(initialTournament);
    setScreen('start');
  };

  const safeIndex = Math.min(t.matchIndex, t.matches.length - 1);

  return (
    <div className="app">
      <div className="bg-gradient" />
      {screen === 'start' && <StartScreen onStart={handleStart} />}
      {screen === 'loading' && <LoadingScreen message={loadingMsg} />}
      {screen === 'tournament' && t.matches.length > 0 && safeIndex >= 0 && (
        <TournamentScreen
          matches={t.matches}
          currentMatchIndex={safeIndex}
          roundNumber={t.roundNumber}
          totalRounds={t.totalRounds}
          bracketSize={t.bracketSize}
          onSelect={handleSelect}
        />
      )}
      {screen === 'result' && t.winner && (
        <ResultScreen winner={t.winner} onRestart={handleRestart} />
      )}
    </div>
  );
}
