const express = require("express");
const router = express.Router();

//Controllers
const InitializationController = require("../Controller/InitializationController");
const DoctorController = require("../Controller/DoctorController");
const UserController = require("../Controller/UserController");

router.get("/api", InitializationController.api);
router.get("/doctors/search", DoctorController.searchDoctor);
router.post("/trackMe", UserController.checkIfExistsAndSendOTP);
router.get("/initialize", InitializationController.initialize);
router.post("/verifyOTP", UserController.verifyOTP);
router.post("/insert", InitializationController.InsertAllPreMadeDataSet);

module.exports = router;
