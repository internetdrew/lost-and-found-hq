import express from 'express';
import {
  getLocations,
  getLocation,
  addLocation,
  updateLocation,
  deleteLocation,
  validateLocationId,
  validateSubscription,
} from '../controllers/locationsController';
import {
  addItem,
  deleteItem,
  getItems,
  getItem,
  toggleItemActiveStatus,
  updateItem,
} from '../controllers/itemsController';

const v1Router = express.Router();

/* Locations */
v1Router.get('/locations', getLocations);
v1Router.get('/locations/:id', getLocation);
v1Router.post('/locations', addLocation);
v1Router.patch('/locations/:id', updateLocation);
v1Router.delete('/locations/:id', deleteLocation);

/* Location Validation */
v1Router.get('/locations/:id/exists', validateLocationId);
v1Router.get('/locations/:id/subscription', validateSubscription);
/* Location's Items */
v1Router.get('/locations/:locationId/items', getItems);
v1Router.get('/locations/:locationId/items/:itemId', getItem);
v1Router.post('/locations/:locationId/items', addItem);
v1Router.put('/locations/:locationId/items/:itemId', updateItem);
v1Router.delete('/locations/:locationId/items/:itemId', deleteItem);
v1Router.patch(
  '/locations/:locationId/items/:itemId/status',
  toggleItemActiveStatus
);

export default v1Router;
