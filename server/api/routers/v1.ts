import express from 'express';
import {
  getLocations,
  addLocation,
  updateLocation,
  deleteLocation,
} from '../controllers/locationsController';

const v1Router = express.Router();

// Locations
v1Router.get('/locations', getLocations);
v1Router.post('/locations', addLocation);
v1Router.put('/locations/:id', updateLocation);
v1Router.delete('/locations/:id', deleteLocation);

export default v1Router;
