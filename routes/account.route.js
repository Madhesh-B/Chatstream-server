import express from "express";

import { deleteUser } from "./../controllers/account.controller.js";

const router = express.Router();

router.delete("/delete", deleteUser);

export default router;