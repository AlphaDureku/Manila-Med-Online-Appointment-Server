const express = require("express");
const router = express.Router();
const HeadAdmin = require("../Controller/HeadAdmin");
const jwtMiddleware = require("../utils/JWTHandler");

router.post("/login", HeadAdmin.login);
router.get("/dashboard", jwtMiddleware, HeadAdmin.dashboard);
router.post("/add-doctor", jwtMiddleware, HeadAdmin.addDoctor);
router.post("/remove-doctor", jwtMiddleware, HeadAdmin.deleteDoctor);
router.post("/add-nurse", jwtMiddleware, HeadAdmin.addNurse);
router.post("/match-doctor", jwtMiddleware, HeadAdmin.matchDoctorNurse);

module.exports = router;
