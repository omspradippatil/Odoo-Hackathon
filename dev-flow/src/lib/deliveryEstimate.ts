export interface DeliveryEstimate {
  dispatchBy: string;
  earliest: string;
  latest: string;
  daysMin: number;
  daysMax: number;
  label: string;
  rangeLabel: string;
  laneLabel: string;
}

interface EstimateInput {
  distanceKm?: number;
  sellerLocation?: string;
  quantity?: number;
  availableQuantity?: number;
}

const HANDLING_DAYS = 1;

// Transit lanes are keyed on seller distance; the slowest item in a basket sets the promise.
const LANES = [
  { maxKm: 10, daysMin: 1, daysMax: 2, label: "Same-city lane" },
  { maxKm: 100, daysMin: 2, daysMax: 3, label: "Regional lane" },
  { maxKm: 500, daysMin: 3, daysMax: 5, label: "Inter-city lane" },
  { maxKm: Infinity, daysMin: 5, daysMax: 7, label: "National lane" },
];

function laneFor(distanceKm: number) {
  return LANES.find((lane) => distanceKm <= lane.maxKm) ?? LANES[LANES.length - 1];
}

function addBusinessDays(from: Date, days: number): Date {
  const result = new Date(from);
  let remaining = days;
  while (remaining > 0) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export function estimateDelivery(items: EstimateInput[], from: Date = new Date()): DeliveryEstimate {
  const distances = items
    .map((item) => item.distanceKm)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

  // With no distance data the basket is treated as inter-city, the mid lane.
  const slowestDistance = distances.length ? Math.max(...distances) : 200;
  const lane = laneFor(slowestDistance);

  // Anything ordered beyond the seller's on-hand stock waits on a restock leg.
  const needsRestock = items.some(
    (item) =>
      typeof item.quantity === "number" &&
      typeof item.availableQuantity === "number" &&
      item.quantity > item.availableQuantity
  );
  const restockDays = needsRestock ? 2 : 0;

  const dispatchBy = addBusinessDays(from, HANDLING_DAYS + restockDays);
  const earliest = addBusinessDays(dispatchBy, lane.daysMin);
  const latest = addBusinessDays(dispatchBy, lane.daysMax);

  const daysMin = HANDLING_DAYS + restockDays + lane.daysMin;
  const daysMax = HANDLING_DAYS + restockDays + lane.daysMax;

  return {
    dispatchBy: dispatchBy.toISOString(),
    earliest: earliest.toISOString(),
    latest: latest.toISOString(),
    daysMin,
    daysMax,
    label: `${formatDate(earliest)} – ${formatDate(latest)}`,
    rangeLabel: `${daysMin}–${daysMax} business days`,
    laneLabel: needsRestock ? `${lane.label} + restock` : lane.label,
  };
}

export function formatEstimateDate(iso: string): string {
  return formatDate(new Date(iso));
}
