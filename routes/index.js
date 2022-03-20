import { Router } from "express";

export const routeConfig = () => {
  let router = Router();

  router.use("/public", require("./public"));
  router.use("/", require("./root"));
};
