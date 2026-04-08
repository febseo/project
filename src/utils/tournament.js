export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createBracket(restaurants, targetSize) {
  const shuffled = shuffle(restaurants);

  // Find the largest power of 2 <= min(shuffled.length, targetSize)
  let size = targetSize;
  while (size > shuffled.length && size > 2) {
    size = Math.floor(size / 2);
  }
  if (size < 2) size = 2;

  return shuffled.slice(0, size);
}

export function createMatches(participants) {
  const matches = [];
  for (let i = 0; i < participants.length; i += 2) {
    matches.push({
      a: participants[i],
      b: participants[i + 1] ?? null,
    });
  }
  return matches;
}

export function getRoundName(participantCount) {
  const map = {
    16: '16강',
    8: '8강',
    4: '준결승',
    2: '결승',
  };
  return map[participantCount] ?? `${participantCount}강`;
}
