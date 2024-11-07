import express from "express";

import { updateScore, resetScore, getScore, updateScoreAdv, resetScoreAdv, getScoreAdv,updateMatchDraw, updateMatchLose, updateMatchPlayed, updateMatchWon } from "../controllers/result.js";

const router = express.Router();

router.put(`/:nickname/updateScore`, updateScore);
router.put(`/:nickname/resetScore`, resetScore);
router.get(`/:nickname/getScore`, getScore);
router.put(`/:nickname/updateScoreAdv`, updateScoreAdv);
router.put(`/:nickname/resetScoreAdv`, resetScoreAdv);
router.get(`/:nickname/getScoreAdv`, getScoreAdv);
router.put(`/:nickname/updateMatchPlayed`, updateMatchPlayed);
router.put(`/:nickname/updateMatchWon`, updateMatchWon);
router.put(`/:nickname/updateMatchLose`, updateMatchLose);
router.put(`/:nickname/updateMatchDraw`, updateMatchDraw);



export default router;