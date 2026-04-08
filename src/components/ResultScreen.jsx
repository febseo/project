import './ResultScreen.css';

function StarRating({ rating }) {
  if (!rating) return null;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="result-stars">
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(empty)}
      <span className="result-rating-num"> {rating.toFixed(1)}</span>
    </span>
  );
}

export default function ResultScreen({ winner, onRestart }) {
  const { name, rating, address, category, photoUrl, emoji, color, lat, lng, isMock } = winner;

  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(name)}`;
  const kakaoMapUrl = `https://map.kakao.com/?q=${encodeURIComponent(name)}`;
  const googleMapUrl = `https://www.google.com/maps/search/${encodeURIComponent(name)}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '🍽️ 식당 이상형 월드컵 결과',
          text: `오늘의 식당은 "${name}"! 같이 가자~`,
          url: window.location.href,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(
        `🍽️ 식당 이상형 월드컵 결과\n오늘의 식당은 "${name}"!\n${naverMapUrl}`
      );
      alert('클립보드에 복사됐어요!');
    }
  };

  return (
    <div className="result-screen">
      <div className="result-confetti" aria-hidden="true">
        {['🎉', '🎊', '✨', '🏆', '⭐'].map((e, i) => (
          <span key={i} className="confetti-piece" style={{ '--i': i }}>{e}</span>
        ))}
      </div>

      <div className="result-header">
        <div className="trophy-icon">🏆</div>
        <h1 className="result-title">오늘의 식당!</h1>
        <p className="result-subtitle">이상형 월드컵 우승</p>
      </div>

      <div className="winner-card">
        <div className="winner-photo">
          {photoUrl ? (
            <img src={photoUrl} alt={name} className="winner-img" />
          ) : (
            <div className="winner-placeholder" style={{ background: color || '#333' }}>
              <span className="winner-emoji">{emoji || '🍽️'}</span>
            </div>
          )}
          <div className="winner-crown">👑</div>
        </div>

        <div className="winner-info">
          <h2 className="winner-name">{name}</h2>
          {rating != null && <StarRating rating={rating} />}
          <p className="winner-category">{category}</p>
          <p className="winner-address">📍 {address}</p>
          {isMock && <span className="demo-note">※ 데모 데이터입니다</span>}
        </div>
      </div>

      <div className="map-links">
        <p className="map-title">지도에서 확인하기</p>
        <div className="map-btn-group">
          <a href={naverMapUrl} target="_blank" rel="noreferrer" className="map-btn naver">
            <span>N</span> 네이버지도
          </a>
          <a href={kakaoMapUrl} target="_blank" rel="noreferrer" className="map-btn kakao">
            <span>K</span> 카카오맵
          </a>
          <a href={googleMapUrl} target="_blank" rel="noreferrer" className="map-btn google">
            <span>G</span> 구글맵
          </a>
        </div>
      </div>

      <div className="result-actions">
        <button className="share-btn" onClick={handleShare}>
          📤 공유하기
        </button>
        <button className="restart-btn" onClick={onRestart}>
          🔄 다시하기
        </button>
      </div>
    </div>
  );
}
