const express = require("express");
const { getConnection } = require("../util/connection");
const router = express.Router();

//controllers
import UserController from "./controllers/user.js";

const User = new UserController();

// middleware that is specific to this router
router.use(async (req, res, next) => {
  req.body.db = await getConnection("root");
});

// define the home page route
router.post("/login", async (req, res) => {
  let data = await User.login(req);

  if (data.error) res.status(data.status).send(data.error);
  else {
    res.send(data);
  }
});

module.exports = router;
