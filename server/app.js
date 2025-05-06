import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import cookie_parser from "cookie-parser"

const app = express();              

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || true, // Use env var in production, allow all in dev
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400 // 24 hours
};

app.use(express.json());   
app.use(express.urlencoded({ extended: false }));         
app.use(cors(corsOptions));    
app.options('*', cors(corsOptions));
app.use(cookie_parser());

dotenv.config();       

export default app; 