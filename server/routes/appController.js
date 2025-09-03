import express from "express";
import { testOracleConnection } from "./appService.js";

const appRouter = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
appRouter.get("/check-db-connection", async (req, res) => {
  const isConnect = await testOracleConnection();
  if (isConnect) {
    res.send("connected");
  } else {
    res.send("unable to connect");
  }
});

appRouter.get("/", (req, res) => {
  res.json("Connected to the backend");
});

export default appRouter;
