import { z } from 'zod';
import express from 'express';
import {
  getLocations,
  getLocation,
  addLocation,
  updateLocation,
  deleteLocation,
  validateLocationId,
  validateSubscription,
} from '../controllers/locationsController.ts';
import {
  addItem,
  deleteItem,
  getItems,
  getItem,
  toggleItemActiveStatus,
  updateItem,
} from '../controllers/itemsController.ts';
import { validateRequest } from '../middleware/validate.ts';
import { locationSchema } from '../../../shared/schemas/location.ts';
import { itemSchema } from '../../../shared/schemas/item.ts';

const v1Router = express.Router();

// Common validation schemas
const uuidSchema = (fieldName: string) =>
  z
    .string({ required_error: `${fieldName} is required` })
    .uuid({ message: `Invalid ${fieldName}` });

const commonValidation = {
  locationId: () => ({
    params: z.object({ id: uuidSchema('Location ID') }),
  }),
  locationAndItemId: () => ({
    params: z.object({
      locationId: uuidSchema('Location ID'),
      itemId: uuidSchema('Item ID'),
    }),
  }),
};

/* Locations */
v1Router.get('/locations', getLocations);
v1Router.get(
  '/locations/:id',
  validateRequest(commonValidation.locationId()),
  getLocation
);
v1Router.post(
  '/locations',
  validateRequest({ body: locationSchema }),
  addLocation
);
v1Router.patch(
  '/locations/:id',
  validateRequest({ ...commonValidation.locationId(), body: locationSchema }),
  updateLocation
);
v1Router.delete(
  '/locations/:id',
  validateRequest(commonValidation.locationId()),
  deleteLocation
);

/* Location Validation */
v1Router.get(
  '/locations/:id/exists',
  validateRequest(commonValidation.locationId()),
  validateLocationId
);
v1Router.get(
  '/locations/:id/subscription',
  validateRequest(commonValidation.locationId()),
  validateSubscription
);

/* Location's Items */
v1Router.get(
  '/locations/:locationId/items',
  validateRequest(commonValidation.locationId()),
  getItems
);

v1Router.get(
  '/locations/:locationId/items/:itemId',
  validateRequest(commonValidation.locationAndItemId()),
  getItem
);
v1Router.post(
  '/locations/:locationId/items',
  validateRequest({ ...commonValidation.locationId(), body: itemSchema }),
  addItem
);
v1Router.put(
  '/locations/:locationId/items/:itemId',
  validateRequest({
    ...commonValidation.locationAndItemId(),
    body: itemSchema,
  }),
  updateItem
);
v1Router.delete(
  '/locations/:locationId/items/:itemId',
  validateRequest(commonValidation.locationAndItemId()),
  deleteItem
);

v1Router.patch(
  '/locations/:locationId/items/:itemId/status',
  validateRequest({
    ...commonValidation.locationAndItemId(),
    body: itemSchema,
  }),
  toggleItemActiveStatus
);

export default v1Router;
