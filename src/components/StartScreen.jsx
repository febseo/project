import { useState } from 'react';
import './StartScreen.css';

const RADII = [
  { label: '500m', value: 500 },
  { label: '1km', value: 1000 },
  { label: '2km', value: 2000 },
  { label: '5km', value: 5000 },
];

const CATEGORIES = ['전체', '한식', '일식', '중식', '양식', '카페'];
const RATINGS = [
  { label: '제한 없음', value: 0 },
  { label: '3.5+', value: 3.5 },
  { label: '4.0+', value: 4.0 },
  { label: '4.5+', value: 4.5 },
];
const SIZES = [
  { label: '8강', value: 8 },
  { label: '16강', value: 16 },
];

export default function StartScreen({ onStart }) {
  const [filters, setFilters] = useState({
    radius: 1000,
    category: '전체',
    minRating: 0,
    size: 8,
  });
  const [locating, setLocating] = useState(false);
  const [location, setLocation] = useState(null);
  const [locError, setLocError] = useState(null);

  const handleLocate = () => {
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocError('위치 허용이 거부됐어요. 데모 모드로 진행합니다.');
        setLocating(false);
        setLocation({ lat: 37.5665, lng: 126.9780, demo: true });
      },
      { timeout: 8000 }
    );
  };

  const handleStart = () => {
    onStart(location, filters);
  };

  return (
    <div className="start-screen">
      <div className="start-hero">
        <div className="hero-emoji">🍽️</div>
        <h1 className="hero-title">식당 이상형 월드컵</h1>
        <p className="hero-sub">오늘 뭐 먹지? 토너먼트로 결정해요!</p>
      </div>

      <div className="start-card">
        <section className="filter-section">
          <h2 className="section-title">📍 위치</h2>
          {!location ? (
            <button className="locate-btn" onClick={handleLocate} disabled={locating}>
              {locating ? '위치 확인 중...' : '현재 위치 가져오기'}
            </button>
          ) : (
            <div className="location-confirmed">
              <span className="loc-icon">✅</span>
              <span>{location.demo ? '서울 중심부 (데모)' : `위도 ${location.lat.toFixed(4)}, 경도 ${location.lng.toFixed(4)}`}</span>
              <button className="relocate-btn" onClick={() => setLocation(null)}>다시</button>
            </div>
          )}
          {locError && <p className="loc-error">{locError}</p>}
        </section>

        <section className="filter-section">
          <h2 className="section-title">📏 검색 반경</h2>
          <div className="chip-group">
            {RADII.map((r) => (
              <button
                key={r.value}
                className={`chip ${filters.radius === r.value ? 'chip-active' : ''}`}
                onClick={() => setFilters((f) => ({ ...f, radius: r.value }))}
              >
                {r.label}
              </button>
            ))}
          </div>
        </section>

        <section className="filter-section">
          <h2 className="section-title">🍜 음식 카테고리</h2>
          <div className="chip-group">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`chip ${filters.category === c ? 'chip-active' : ''}`}
                onClick={() => setFilters((f) => ({ ...f, category: c }))}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <section className="filter-section">
          <h2 className="section-title">⭐ 최소 평점</h2>
          <div className="chip-group">
            {RATINGS.map((r) => (
              <button
                key={r.value}
                className={`chip ${filters.minRating === r.value ? 'chip-active' : ''}`}
                onClick={() => setFilters((f) => ({ ...f, minRating: r.value }))}
              >
                {r.label}
              </button>
            ))}
          </div>
        </section>

        <section className="filter-section">
          <h2 className="section-title">🏆 토너먼트 규모</h2>
          <div className="chip-group">
            {SIZES.map((s) => (
              <button
                key={s.value}
                className={`chip ${filters.size === s.value ? 'chip-active' : ''}`}
                onClick={() => setFilters((f) => ({ ...f, size: s.value }))}
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>

        <button
          className="start-btn"
          onClick={handleStart}
          disabled={!location}
        >
          {location ? '🎯 토너먼트 시작!' : '위치를 먼저 가져오세요'}
        </button>
      </div>
    </div>
  );
}
