import express from "express";

import { updateScore, resetScore, getScore } from "../controllers/result.js";

const router = express.Router();

router.put(`/:nickname/updateScore`, updateScore);
router.put(`/:nickname/resetScore`, resetScore);
router.get(`/:nickname/getScore`, getScore);



export default router;