import express from 'express';
import {
  getLocations,
  updateLocation,
} from '../controllers/locationsController';

const v1Router = express.Router();

v1Router.get('/locations', getLocations);
v1Router.post('/locations', updateLocation);
export default v1Router;
