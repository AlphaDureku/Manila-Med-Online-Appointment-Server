const express = require("express");
const router = express.Router();
const NurseController = require("../Controller/NurseController");

// router.post("/set-NurseSession", NurseController.setNurseSession);
router.post("/nurse-login", NurseController.login);
router.get("/nurse-dashboard", NurseController.dashboard);
router.get("/change-doctor", NurseController.changeDoctor);
router.get("/change-dateRange", NurseController.changeDateRange);

module.exports = router;
