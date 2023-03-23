import express from 'express';
export const router = express.Router();
import { createUser,loginUser,updateRecord,getGooglePlaces } from '../controllers/users.js';

router.post("/user", createUser);
router.post("/login-user", loginUser);
router.put("/user", updateRecord);
router.get("/places",getGooglePlaces)