const express = require("express");
const router = express.Router();
const HeadAdmin = require("../Controller/HeadAdmin");
const jwtMiddleware = require("../utils/JWTHandler");

router.post("/login", HeadAdmin.login);
router.get("/dashboard", jwtMiddleware, HeadAdmin.dashboard);
router.post("/add-doctor", jwtMiddleware, HeadAdmin.addDoctor);
router.post("/remove-doctor", jwtMiddleware, HeadAdmin.deleteDoctor);
router.post("/add-nurse", jwtMiddleware, HeadAdmin.addNurse);
router.get("/nurse-info", jwtMiddleware, HeadAdmin.nurseDetails);
router.post("/update-nurse", jwtMiddleware, HeadAdmin.updateNurse);
router.get("/check-nursebinding", jwtMiddleware, HeadAdmin.checkNurseBinding);
router.post("/remove-nurse", jwtMiddleware, HeadAdmin.removeNurse);
router.post("/match-doctor", jwtMiddleware, HeadAdmin.matchDoctorNurse);

module.exports = router;
