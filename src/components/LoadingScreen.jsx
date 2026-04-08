import './LoadingScreen.css';

export default function LoadingScreen({ message = '주변 식당을 불러오는 중...' }) {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner">
          <span>🍽️</span>
        </div>
        <p className="loading-message">{message}</p>
        <div className="loading-dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}
