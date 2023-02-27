const express = require("express");
const userController = require("../Controller/UserController");
const router = express.Router();

router.post("/set-userSession", userController.set_userSession);
router.get("/get-patients", userController.getUser_Patients);
router.get("/:id", userController.fetchPatient_Appointments_Using_Patient_ID);
module.exports = router;
