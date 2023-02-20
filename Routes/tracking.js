const express = require("express");
const userController = require("../Controller/UserController");
const router = express.Router();

router.post("/set-userSession", userController.set_userSession);
router.get("/get-patients", userController.getUser_Patients);

module.exports = router;
