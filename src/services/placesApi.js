const CATEGORY_KEYWORDS = {
  '전체': null,
  '한식': '한식',
  '일식': '일식',
  '중식': '중식',
  '양식': '양식',
  '카페': '카페',
};

let mapsInstance = null;

export function loadGoogleMapsApi(apiKey) {
  return new Promise((resolve, reject) => {
    if (mapsInstance) {
      resolve(mapsInstance);
      return;
    }
    if (window.google?.maps?.places) {
      mapsInstance = window.google.maps;
      resolve(mapsInstance);
      return;
    }

    const callbackName = '__googleMapsReady__';
    window[callbackName] = () => {
      mapsInstance = window.google.maps;
      resolve(mapsInstance);
      delete window[callbackName];
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error('Google Maps API 로드 실패'));
    document.head.appendChild(script);
  });
}

export function searchRestaurants(maps, { lat, lng }, radius, category) {
  return new Promise((resolve, reject) => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const service = new maps.places.PlacesService(div);

    const request = {
      location: new maps.LatLng(lat, lng),
      radius: radius,
      type: 'restaurant',
    };

    const keyword = CATEGORY_KEYWORDS[category];
    if (keyword) request.keyword = keyword;

    service.nearbySearch(request, (results, status) => {
      document.body.removeChild(div);
      if (status === maps.places.PlacesServiceStatus.OK) {
        resolve(results);
      } else if (status === maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve([]);
      } else {
        reject(new Error(`검색 실패: ${status}`));
      }
    });
  });
}

export function normalizePlace(place) {
  return {
    id: place.place_id,
    name: place.name,
    rating: place.rating ?? null,
    address: place.vicinity ?? '',
    category: place.types?.[0] ?? 'restaurant',
    photoUrl: place.photos?.[0]?.getUrl({ maxWidth: 600 }) ?? null,
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng(),
    isMock: false,
  };
}

export function normalizeMock(mock) {
  return {
    id: mock.id,
    name: mock.name,
    rating: mock.rating,
    address: mock.address,
    category: mock.category,
    photoUrl: null,
    emoji: mock.emoji,
    color: mock.color,
    lat: 37.5,
    lng: 126.9,
    isMock: true,
  };
}
