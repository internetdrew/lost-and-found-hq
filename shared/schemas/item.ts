import { z } from 'zod';
import { INPUT_LENGTHS } from '../constants.js';

export const itemSchema = z.object({
  title: z
    .string()
    .min(INPUT_LENGTHS.item.name.min, { message: 'Please enter a title' })
    .max(INPUT_LENGTHS.item.name.max, {
      message: `Title cannot exceed ${INPUT_LENGTHS.item.name.max} characters`,
    }),
  category: z.string().min(1, { message: 'Please select a category' }),
  foundAt: z
    .string()
    .min(INPUT_LENGTHS.item.foundAt.min, {
      message: 'Please enter where the item was found',
    })
    .max(INPUT_LENGTHS.item.foundAt.max, {
      message: `Location cannot exceed ${INPUT_LENGTHS.item.foundAt.max} characters`,
    }),
  dateFound: z
    .string()
    .refine(date => !isNaN(Date.parse(date)), {
      message: 'Invalid date',
    })
    .refine(date => new Date(date) <= new Date(), {
      message: 'Date cannot be in the future',
    })
    .refine(date => new Date(date) >= new Date('1900/01/01'), {
      message: 'Date must be after 1900',
    }),
  briefDescription: z
    .string()
    .min(INPUT_LENGTHS.item.briefDescription.min, {
      message: 'Please add a brief description of the item',
    })
    .max(INPUT_LENGTHS.item.briefDescription.max, {
      message: `Description should not exceed ${INPUT_LENGTHS.item.briefDescription.max} characters`,
    }),
  staffDetails: z
    .string()
    .min(INPUT_LENGTHS.item.staffDetails.min, {
      message: 'Please add details for staff to help identify the item',
    })
    .max(INPUT_LENGTHS.item.staffDetails.max, {
      message: `Staff details should not exceed ${INPUT_LENGTHS.item.staffDetails.max} characters`,
    }),
});

export type ItemInput = z.infer<typeof itemSchema>;
