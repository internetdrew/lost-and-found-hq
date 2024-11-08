import express from 'express';
import {
  getLocations,
  addLocation,
  updateLocation,
  deleteLocation,
} from '../controllers/locationsController';
import {
  addItem,
  deleteItem,
  getItems,
  toggleItemActiveStatus,
  updateItem,
} from '../controllers/itemsController';

const v1Router = express.Router();

// Locations
v1Router.get('/locations', getLocations);
v1Router.post('/locations', addLocation);
v1Router.put('/locations/:id', updateLocation);
v1Router.delete('/locations/:id', deleteLocation);

// Items
v1Router.get('/items', getItems);
v1Router.post('/items', addItem);
v1Router.put('/items/:id', updateItem);
v1Router.patch('/items/:id', toggleItemActiveStatus);
v1Router.delete('/items/:id', deleteItem);

export default v1Router;
