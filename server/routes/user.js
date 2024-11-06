import express from "express";

import { createUser, loginUser, loginUserSimple, deleteUserSimple} from "../controllers/user.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/loginSimple", loginUserSimple);
router.put(`/:nickname/deleteUserSimple`, deleteUserSimple);

export default router;