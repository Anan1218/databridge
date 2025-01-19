export interface BusinessType {
  value: string;
  label: string;
  queries: string[];
  urls: string[];
}

export const businessTypes: { [key: string]: BusinessType } = {
  restaurant: {
    value: 'restaurant',
    label: 'Restaurant',
    queries: [
    ],
    urls: [],
  },
  cafe: {
    value: 'cafe',
    label: 'Café',
    queries: [
    ],
    urls: [],
  },
  bar: {
    value: 'bar',
    label: 'Bar',
    queries: [
      "cocktail menu",
    ],
    urls: [],
  }
};

export const businessTypeQueries = Object.fromEntries(
  Object.entries(businessTypes).map(([key, value]) => [key, value.queries])
); 