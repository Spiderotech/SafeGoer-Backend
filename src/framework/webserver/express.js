import express from "express";
import morgan from "morgan";
import cors from "cors"
import config from "../../config/config.js";


const expressConfig = (app) => {
    app.use(morgan("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    const allowedOrigins = config.corsOrigin
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);

    app.use(cors({
      origin: allowedOrigins.includes("*") ? "*" : allowedOrigins,
      credentials: true,
    }))
  
   

  };
  
  export default expressConfig;
