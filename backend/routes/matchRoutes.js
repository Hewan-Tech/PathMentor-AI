const express = require("express");
const router = express.Router();
const { guard, authorize } = require("../middleware/authMiddleware");
const {
  aiMatchMentor,
  getMyMatches,
  adminGetAllMatches,
  deleteMatch,
} = require("../controllers/matchController");

router.post("/ai-match", guard, authorize("student"), aiMatchMentor);
router.get("/my", guard, getMyMatches);
router.get("/admin/all", guard, authorize("admin"), adminGetAllMatches);
router.delete("/:id", guard, authorize("admin"), deleteMatch);

module.exports = router;
