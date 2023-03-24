import express from 'express';
import { getGooglePlaces } from '../controllers/places.js';
import { createUser,loginUser,updateRecord } from '../controllers/users.js';
export const router = express.Router();

router.post("/user", createUser);
router.post("/login-user", loginUser);
router.put("/user", updateRecord);
router.get("/places/:place",getGooglePlaces)