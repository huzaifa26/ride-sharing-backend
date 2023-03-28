import express from 'express';
import { getGooglePlaces } from '../controllers/places.js';
import { createUser,getActiveRidesForParent,loginUser,updateRecord } from '../controllers/users.js';
import { addRide, getAvailableDrivers, rideRequestAction, getDriverRides, markRideComplete } from "../controllers/ride.js";
import { getHistory } from '../controllers/history.js';
import { createConversation, createMessages, getMessages } from '../controllers/conversation.js';

export const router = express.Router();

router.post("/user", createUser);
router.post("/login-user", loginUser);
router.put("/user", updateRecord);
router.get("/places/:place",getGooglePlaces)
router.get("/active-rides/:userId",getActiveRidesForParent)

router.get("/drivers/:userId",getAvailableDrivers)
router.post("/ride",addRide)
router.post("/mark-ride-complete",markRideComplete)

// router.get('/ride-request-updates/:userId',rideRequestUpdates);
router.put('/ride-request-action',rideRequestAction);
router.get('/driver-rides/:driverId',getDriverRides);


router.get('/history/:id/:userType',getHistory);

router.post("/conversation",createConversation);

router.get("/message/:conversationId",getMessages);
router.post("/message",createMessages);
