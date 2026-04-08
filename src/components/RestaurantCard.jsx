import './RestaurantCard.css';

function StarRating({ rating }) {
  if (!rating) return null;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="stars">
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(empty)}
      <span className="rating-num"> {rating.toFixed(1)}</span>
    </span>
  );
}

export default function RestaurantCard({ restaurant, onClick, selected, dimmed }) {
  const { name, rating, address, category, photoUrl, emoji, color, isMock } = restaurant;

  return (
    <button
      className={`restaurant-card ${selected ? 'card-selected' : ''} ${dimmed ? 'card-dimmed' : ''}`}
      onClick={onClick}
      disabled={dimmed}
    >
      <div className="card-photo">
        {photoUrl ? (
          <img src={photoUrl} alt={name} className="card-img" />
        ) : (
          <div className="card-placeholder" style={{ background: color || '#333' }}>
            <span className="card-emoji">{emoji || '🍽️'}</span>
          </div>
        )}
        {selected && <div className="card-selected-overlay"><span>✓</span></div>}
      </div>
      <div className="card-info">
        <h3 className="card-name">{name}</h3>
        {rating != null && <StarRating rating={rating} />}
        <p className="card-category">{category}</p>
        <p className="card-address">{address}</p>
        {isMock && <span className="demo-badge">데모</span>}
      </div>
    </button>
  );
}
