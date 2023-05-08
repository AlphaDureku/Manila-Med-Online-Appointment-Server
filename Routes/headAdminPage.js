const express = require("express");
const router = express.Router();
const HeadAdmin = require("../Controller/HeadAdmin");
const jwtMiddleware = require("../utils/JWTHandler");

router.post("/login", HeadAdmin.login);
router.get("/dashboard", jwtMiddleware, HeadAdmin.dashboard);

module.exports = router;
