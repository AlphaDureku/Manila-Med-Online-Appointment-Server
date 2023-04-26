const express = require("express");
const router = express.Router();
const NurseController = require("../Controller/NurseController");

// router.post("/set-NurseSession", NurseController.setNurseSession);
router.post("/nurse-login", NurseController.login);
router.get("/nurse-dashboard", NurseController.dashboard);

module.exports = router;
