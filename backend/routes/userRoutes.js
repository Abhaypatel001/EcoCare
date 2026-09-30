const express = require("express");

const {
  getAllCitizens,
} = require("../controllers/userController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/citizens",
  protect,
  adminOnly,
  getAllCitizens
);

module.exports = router;