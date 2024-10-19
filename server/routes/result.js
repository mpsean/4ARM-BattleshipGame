import express from "express";

import { updateScore, resetScore } from "../controllers/result.js";

const router = express.Router();

router.put("/:id/updateScore", updateScore);
router.put("/:id/resetScore", resetScore);



export default router;