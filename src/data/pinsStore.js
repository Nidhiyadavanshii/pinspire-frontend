import animalsImg from '../assets/animals_wildlife_cute.jpg';
import architectureImg from '../assets/architecture_modern_building.jpg';
import artImg from '../assets/art_creative_painting.jpg';
import fashionImg from '../assets/fashion_style_outfit.jpg';
import foodImg from '../assets/food_gourmet_aesthetic.jpg';
import gamingImg from '../assets/gaming_setup_neon.jpg';
import natureImg from '../assets/nature_photography_landscape.jpg';
import techImg from '../assets/technology_gadgets_modern.jpg';
import travelImg from '../assets/travel_adventure_mountains.jpg';

const IMAGES = [
  animalsImg, architectureImg, artImg, fashionImg, foodImg,
  gamingImg, natureImg, techImg, travelImg,
];

const TITLES = [
  'Golden hour in the mountains', 'Minimalist desk setup', 'Sunday brunch goals',
  'Abstract acrylic study', 'Street style Tokyo', 'Cabin in the woods',
  'Neon nights', 'Modern facade lines', 'Puppy eyes', 'Wanderlust diary',
  'Pastel palette kitchen', 'Botanical illustration', 'City lights reflection',
  'Vintage denim layers', 'Morning mist lake', 'Retro gaming corner',
  'Concrete curves', 'Macro leaf veins', 'Coastal sunset tones', 'Sneaker collection',
  'Desert bloom', 'Urban jungle vibes', 'Cozy reading nook', 'Watercolor dreams',
  'Mountain sunrise', 'Cafe culture', 'Architectural symmetry', 'Wildlife portrait',
  'Fashion week highlights', 'Tech workspace goals',
];

export const USERS = [
  { id: 'u1', username: 'alex_creates', fullName: 'Alex Morgan', avatar: null },
  { id: 'u2', username: 'sarah_snaps', fullName: 'Sarah Chen', avatar: null },
  { id: 'u3', username: 'design_mike', fullName: 'Mike Davis', avatar: null },
  { id: 'u4', username: 'travel_june', fullName: 'June Park', avatar: null },
  { id: 'u5', username: 'foodie_lisa', fullName: 'Lisa Turner', avatar: null },
  { id: 'u6', username: 'art_by_kai', fullName: 'Kai Nakamura', avatar: null },
  { id: 'u7', username: 'tech_noah', fullName: 'Noah Williams', avatar: null },
  { id: 'u8', username: 'style_riley', fullName: 'Riley Johnson', avatar: null },
];

export const CATEGORIES = [
  'Nature', 'Travel', 'Food', 'Technology', 'Fashion',
  'Animals', 'Art', 'Gaming', 'Photography', 'Architecture',
  'Sports', 'Cars',
];

export const CATEGORIES_LIST = CATEGORIES;

const DESCRIPTIONS = [
  'A breathtaking view that captures the essence of natural beauty and serenity.',
  'Perfect inspiration for your next creative project or space redesign.',
  'This stunning piece showcases the incredible talent and artistic vision.',
  'Explore the world through a different lens with this captivating shot.',
  'Style meets function in this beautifully curated collection.',
  'Nature at its finest — raw, wild, and absolutely magnificent.',
  'The perfect blend of modern aesthetics and timeless design principles.',
  'Discover new perspectives and find inspiration in everyday moments.',
];

const STORAGE_KEY = 'pinspire-user-pins';

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function generatePins(count, offset = 0) {
  const rng = seededRandom(offset + 42);
  return Array.from({ length: count }).map((_, i) => {
    const idx = offset + i;
    const aspect = 0.75 + rng() * 0.85;
    const user = USERS[idx % USERS.length];
    return {
      id: `pin-${idx}`,
      image: IMAGES[idx % IMAGES.length],
      title: TITLES[idx % TITLES.length],
      description: DESCRIPTIONS[idx % DESCRIPTIONS.length],
      user: user.username,
      userId: user.id,
      userFullName: user.fullName,
      category: CATEGORIES[idx % CATEGORIES.length],
      likes: Math.floor(rng() * 4000) + 120,
      saves: Math.floor(rng() * 2000) + 50,
      aspect,
      createdAt: new Date(Date.now() - idx * 3600000 * 24).toISOString(),
    };
  });
}

export const ALL_PINS = generatePins(60, 0);

function readStoredPins() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredPins(pins) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
}

function syncPinsWithStorage() {
  const storedPins = readStoredPins();
  const merged = [...ALL_PINS, ...storedPins.filter((pin) => !ALL_PINS.some((existing) => existing.id === pin.id))];
  ALL_PINS.splice(0, ALL_PINS.length, ...merged);
}

export function getAllPins() {
  syncPinsWithStorage();
  return ALL_PINS;
}

export function createUserPin(payload = {}) {
  const createdPin = {
    id: `pin-user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    image: payload.image || IMAGES[0],
    title: payload.title || 'Untitled Pin',
    description: payload.description || '',
    user: payload.user || 'you',
    userId: payload.userId || 'me',
    userFullName: payload.userFullName || payload.user || 'You',
    category: payload.category || 'Art',
    likes: 0,
    saves: 0,
    aspect: payload.aspect || 0.8,
    createdAt: new Date().toISOString(),
    isUserCreated: true,
  };

  const storedPins = readStoredPins();
  const nextPins = [createdPin, ...storedPins.filter((pin) => pin.id !== createdPin.id)];
  writeStoredPins(nextPins);
  syncPinsWithStorage();
  return createdPin;
}

export function getPinById(id) {
  return getAllPins().find((p) => p.id === id) || null;
}

export function getPinsByCategory(category) {
  if (!category || category === 'All') return getAllPins();
  return getAllPins().filter((p) => p.category === category);
}

export function searchPins(query) {
  if (!query) return getAllPins();
  const q = query.toLowerCase();
  return getAllPins().filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.user.toLowerCase().includes(q) ||
      p.userFullName.toLowerCase().includes(q)
  );
}

export function getRelatedPins(pin, limit = 8) {
  return getAllPins().filter((p) => p.id !== pin.id && p.category === pin.category).slice(0, limit);
}

export function getPinsByUser(username) {
  return getAllPins().filter((p) => p.user === username || p.userFullName === username);
}

syncPinsWithStorage();
