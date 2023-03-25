import express from "express";
import cors from "cors";
import { PrismaClient } from '@prisma/client'
import { router } from "./routes/routes.js";
import bodyParser from "body-parser";
import { EventEmitter } from "events"

const app = express();
export const eventEmitter = new EventEmitter();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: " http://127.0.0.1:5173",
  credentials: true,
  optionSuccessStatus: 200
}));

export const prisma = new PrismaClient();
app.use('/api', router);

app.listen(5000, () => {
  console.log(`App started on port 5000`)
});