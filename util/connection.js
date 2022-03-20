const mongoose = require("mongoose");
require("dotenv").config();
import User from "../models/user.js";
import Account from "../models/account.js";
const clientOption = (db) => {
  return {
    dbName: db || "root",
    socketTimeoutMS: 30000,
    useUnifiedTopology: true,
    keepAlive: true,
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
    console.log("string: ", process.env.MONGO_DB_CONNECTION);
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
    //add account level models here
  }
  return db;
};
