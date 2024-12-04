import { Tables } from '@dbTypes';

export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
] as const;

// Optional: Type for a US State
export type USState = (typeof US_STATES)[number];

type Item = Tables<'items'>;

type ItemCategory = Item['category'];

const ITEM_CATEGORY_LABELS: Record<ItemCategory, string> = {
  wallets: 'Wallets & Purses',
  electronics: 'Electronics & Devices',
  clothing: 'Clothing',
  jewelry: 'Jewelry & Watches',
  keys: 'Keys & Cards',
  documents: 'ID & Documents',
  bags: 'Bags',
  other: 'Other Items',
};

export const itemCategoryOptions = Object.entries(ITEM_CATEGORY_LABELS).map(
  ([value, label]) => ({
    value: value as ItemCategory,
    label,
  })
);

export const INPUT_LENGTHS = {
  location: {
    name: {
      min: 1,
      max: 45,
    },
    streetAddress: {
      min: 1,
      max: 45,
    },
    city: {
      min: 1,
      max: 45,
    },
  },
  item: {
    name: {
      min: 1,
      max: 25,
    },
    foundAt: {
      min: 1,
      max: 25,
    },
    briefDescription: {
      min: 1,
      max: 150,
    },
  },
};
