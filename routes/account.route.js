import express from "express";

import {
  deleteUser,
  getUserProfile
} from "./../controllers/account.controller.js";

const router = express.Router();

router.delete("/delete", deleteUser);
router.get("/profile", getUserProfile);

export default router;