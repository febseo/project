import { useState } from 'react';
import RestaurantCard from './RestaurantCard';
import { getRoundName } from '../utils/tournament';
import './TournamentScreen.css';

export default function TournamentScreen({
  matches,
  currentMatchIndex,
  roundNumber,
  totalRounds,
  bracketSize,
  onSelect,
}) {
  const [selectedSide, setSelectedSide] = useState(null);

  const match = matches[currentMatchIndex];
  const { a, b } = match;
  const totalMatches = matches.length;
  const roundName = getRoundName(bracketSize / Math.pow(2, roundNumber - 1));

  // Auto-advance if one side is null (bye)
  if (!b) {
    setTimeout(() => onSelect(a), 300);
    return null;
  }

  const handleSelect = (restaurant, side) => {
    if (selectedSide) return;
    setSelectedSide(side);
    setTimeout(() => {
      setSelectedSide(null);
      onSelect(restaurant);
    }, 700);
  };

  const progress = ((roundNumber - 1) / totalRounds + currentMatchIndex / totalMatches / totalRounds);
  const progressPct = Math.round(progress * 100);

  return (
    <div className="tournament-screen">
      <div className="tournament-header">
        <div className="round-badge">{roundName}</div>
        <div className="match-progress">
          {currentMatchIndex + 1} / {totalMatches} 경기
        </div>
      </div>

      <div className="progress-bar-wrap">
        <div className="progress-bar" style={{ width: `${progressPct}%` }} />
      </div>

      <p className="pick-hint">마음에 드는 식당을 선택하세요!</p>

      <div className="battle-area">
        <RestaurantCard
          restaurant={a}
          onClick={() => handleSelect(a, 'a')}
          selected={selectedSide === 'a'}
          dimmed={selectedSide === 'b'}
        />

        <div className="vs-divider">
          <span className="vs-text">VS</span>
        </div>

        <RestaurantCard
          restaurant={b}
          onClick={() => handleSelect(b, 'b')}
          selected={selectedSide === 'b'}
          dimmed={selectedSide === 'a'}
        />
      </div>
    </div>
  );
}
