import express from "express"
import http from "http";
import expressConfig from "./src/framework/webserver/express.js";
import serverConfig from "./src/framework/webserver/server.js";
import connectDB from "./src/framework/database/connection.js";
import config from './src/config/config.js';
import routes from './src/framework/webserver/routes/index.js';
import { startNotificationScheduler } from "./src/framework/services/notificationScheduler.js";


const app=express()
const server=http.createServer(app)

expressConfig(app);
connectDB(config)
routes(app,express)
startNotificationScheduler();

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

serverConfig(server,config).startServer()
