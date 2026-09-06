// Vendors bid under a produce codename so buyers judge price and trust, never brand.
// Real identities are only released once both sides confirm the deal.
const FRUIT_ALIASES = [
  "Mango", "Lychee", "Papaya", "Guava", "Apricot", "Plum",
  "Fig", "Pomelo", "Kiwi", "Damson", "Quince", "Persimmon",
  "Mulberry", "Tamarind", "Jackfruit", "Rambutan",
];

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// Walks the pool from a session-derived offset so two vendors in the same room
// can never land on the same fruit.
export function assignAliases(sessionSeed: string, identities: string[]): Record<string, string> {
  const offset = hashSeed(sessionSeed) % FRUIT_ALIASES.length;
  const map: Record<string, string> = {};
  identities.forEach((identity, index) => {
    map[identity] = FRUIT_ALIASES[(offset + index) % FRUIT_ALIASES.length];
  });
  return map;
}

export function aliasFor(sessionSeed: string, identity: string, identities: string[]): string {
  return assignAliases(sessionSeed, identities)[identity] ?? FRUIT_ALIASES[0];
}
