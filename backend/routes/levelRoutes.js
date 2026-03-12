const express = require("express");

const router = express.Router();

const { getLevelsByTrack } = require("../controllers/levelController");

router.get("/course/:courseId", getLevelsByTrack);

module.exports = router;
