const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
import { routeConfig } from "./router.js";

// and create our instances
const app = express();
const router = express.Router();
routeConfig(router);

// set our port to either a predetermined port number if you have set it up, or 8080 (nginx default)
const API_PORT = process.env.API_PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//set CORS policy
app.use(
  cors({
    origin: "*",
  })
);

// Use our router configuration when we call /api
app.use("/api", router);

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
