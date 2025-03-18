import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import cookie_parser from "cookie-parser"

const app = express();              

app.use(express.json());   
app.use(express.urlencoded({ extended: false }));        
app.use(cors());    
app.use(cookie_parser());
dotenv.config();       


export default app; 