import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { PrismaClient } from '@prisma/client'

const app=express();
app.use(cors({
  origin:" http://127.0.0.1:5173",
  credentials:true,
  optionSuccessStatus: 200
}))

export const prisma = new PrismaClient()

app.get("/",(req,res)=>{
  res.send("Hello world")
});

app.listen(5000,()=>{
  console.log(`App started on port 5000`)
});