const PALETTES = [
  ['#5B5FE0', '#3A3AA0'],
  ['#7F3FCF', '#4E2483'],
  ['#255FB0', '#153968'],
  ['#9C5CEB', '#652FA8'],
  ['#3F7CD3', '#1B4A8C'],
  ['#B983FA', '#7F3FCF'],
  ['#4547C4', '#241040'],
  ['#6C9FE3', '#255FB0'],
];

export const hashString = (str = '') => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const paletteFor = (seed) => PALETTES[hashString(seed) % PALETTES.length];

export const initialsFor = (title = '') =>
  title
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

export const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

export const daysUntil = (date) => {
  if (!date) return null;
  const diff = new Date(date).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(diff / 86400000);
};

export const currency = (amount = 0) => `₹${Number(amount).toLocaleString('en-IN')}`;
