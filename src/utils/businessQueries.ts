export interface BusinessType {
  value: string;
  label: string;
  queries: string[];
}

export const businessTypes: { [key: string]: BusinessType } = {
  restaurant: {
    value: 'restaurant',
    label: 'Restaurant',
    queries: [
      "restaurant reviews",
      "dining experience",
      "food quality",
      "menu items",
      "restaurant ratings"
    ]
  },
  cafe: {
    value: 'cafe',
    label: 'Café',
    queries: [
      "coffee quality",
      "cafe atmosphere",
      "bakery items",
      "coffee shop reviews",
      "cafe seating"
    ]
  },
  bar: {
    value: 'bar',
    label: 'Bar',
    queries: [
      "cocktail menu",
      "bar atmosphere",
      "drink selection",
      "nightlife reviews",
      "happy hour"
    ]
  }
};

export const businessTypeQueries = Object.fromEntries(
  Object.entries(businessTypes).map(([key, value]) => [key, value.queries])
); 