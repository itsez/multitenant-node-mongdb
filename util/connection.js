const mongoose = require("mongoose");
require("dotenv").config();
import User from "../models/user.js";
import Feed from "../models/feed.js";
import Form from "../models/form.js";
import Applicant from "../models/applicant.js";
import Site from "../models/site.js";
import Page from "../models/page.js";
import Component from "../models/component.js";
import Account from "../models/account.js";
import Status from "../models/status.js";
import Process from "../models/process.js";
import Position from "../models/position.js";
const clientOption = (db) => {
  return {
    dbName: db || "root",
    socketTimeoutMS: 30000,
    useUnifiedTopology: true,
    keepAlive: true,
    poolSize: 50,
    useNewUrlParser: true,
    autoIndex: false,
  };
};

export const getConnection = async (name) => {
  let db;
  mongoose.connections.forEach((connection) => {
    if (connection["$dbName"] === name) db = connection;
  });
  //if no current connection create one
  if (!db) {
    db = mongoose.createConnection(
      process.env.MONGO_DB_CONNECTION,
      clientOption(name)
    );
    db.useDb(name);
  }
  //define db specific models
  if (db["$dbName"] === "root") {
    db.model("User", User);
    db.model("Account", Account);
  } else if (db["$dbName"] === undefined) {
    return null;
  } else {
    db.model("Component", Component);
    db.model("Page", Page);
    db.model("Feed", Feed);
    db.model("Form", Form);
    db.model("Applicant", Applicant);
    db.model("Site", Site);
    db.model("Status", Status);
    db.model("Process", Process);
    db.model("Position", Position);
  }
  return db;
};
