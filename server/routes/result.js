import express from "express";

import { updateScore, resetScore } from "../controllers/result.js";

const router = express.Router();

router.put(`/:nickname/updateScore`, updateScore);
router.put(`/:nickname/resetScore`, resetScore);



export default router;