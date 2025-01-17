import { z } from 'zod';
import { INPUT_LENGTHS } from '../constants.js';

export const locationSchema = z.object({
  name: z
    .string()
    .min(INPUT_LENGTHS.location.name.min, {
      message: 'Please enter your company name',
    })
    .max(INPUT_LENGTHS.location.name.max, {
      message: `Company name cannot exceed ${INPUT_LENGTHS.location.name.max} characters`,
    }),
  streetAddress: z
    .string()
    .min(INPUT_LENGTHS.location.streetAddress.min, {
      message: 'Please enter your company street address',
    })
    .max(INPUT_LENGTHS.location.streetAddress.max, {
      message: `Street address cannot exceed ${INPUT_LENGTHS.location.streetAddress.max} characters`,
    }),
  city: z
    .string()
    .min(INPUT_LENGTHS.location.city.min, {
      message: 'Please enter your company city',
    })
    .max(INPUT_LENGTHS.location.city.max, {
      message: `City name cannot exceed ${INPUT_LENGTHS.location.city.max} characters`,
    }),
  state: z.string().min(1, { message: 'Please enter your company state' }),
  zipCode: z
    .string()
    .length(5, { message: 'Zip code must be 5 digits' })
    .regex(/^\d{5}$/, { message: 'Zip code must be 5 numbers' }),
});

export type LocationInput = z.infer<typeof locationSchema>;
