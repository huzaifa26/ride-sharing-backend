import express from 'express';
import { getGooglePlaces } from '../controllers/places.js';
import { createUser,loginUser,updateRecord } from '../controllers/users.js';
import { addRide, getAvailableDrivers, rideRequestAction, getDriverRides } from "../controllers/ride.js";

export const router = express.Router();

router.post("/user", createUser);
router.post("/login-user", loginUser);
router.put("/user", updateRecord);
router.get("/places/:place",getGooglePlaces)

router.get("/drivers",getAvailableDrivers)
router.post("/ride",addRide)

// router.get('/ride-request-updates/:userId',rideRequestUpdates);
router.put('/ride-request-action',rideRequestAction);
router.get('/driver-rides/:driverId',getDriverRides);