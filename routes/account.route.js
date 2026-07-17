import express from "express";

import {
  deleteUser,
  getUserProfile
} from "./../controllers/account.controller.js";

const router = express.Router();

router.get("/profile", getUserProfile);
router.delete("/delete", deleteUser);

export default router;