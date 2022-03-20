const router = require("express").Router();
//controllers
import UserController from "../controllers/user.js";

const User = new UserController();

// middleware that is specific to this router
router.use(async (req, res, next) => {
  if (
    !req.header("authorization") ||
    !req.header("authorization").startsWith("Bearer ")
  )
    return res.status(401);
  else {
    let auth = await verifyAuthorization(
      req.header("authorization").split(" ")[1]
    );
    if (auth.error) res.status(403).send(auth.error);
    else {
      req.user = auth.decoded;
      req.body.db = auth.db;
    }
  }
});

// Users
router.get("/users", async (req, res) => {
  let data = await User.list(req);
  if (data.error) return res.status(error.status).send(data.error);
  else return res.send(data);
});
// define the about route
router.get("/user", async (req, res) => {
  let data = await User.get(req);
  if (data.error) return res.status(error.status).send(data.error);
  else return res.send(data);
});

router.get("/user/current", async (req, res) => {
  let data = await User.get(req);
  if (data.error) return res.status(error.status).send(data.error);
  else return res.send(data);
});

router.post("/user", async (req, res) => {
  let data = await User.create(req);
  if (data.error) return res.status(error.status).send(data.error);
  else return res.send(data);
});

router.put("/user", async (req, res) => {
  let data = await User.update(req);
  if (data.error) return res.status(error.status).send(data.error);
  else return res.send(data);
});

// Accounts

router.get("/account", (req, res) => {});

router.get("/accounts", (req, res) => {});

router.post("/account", (req, res) => {});

router.put("/account", (req, res) => {});

module.exports = router;
