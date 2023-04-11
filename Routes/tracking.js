const express = require("express");
const router = express.Router();

//Controllers
const userController = require("../Controller/UserController");

router.post("/set-userSession", userController.set_userSession);
router.get("/get-patients", userController.getUser_Patients);
router.get("/:id", userController.fetchPatient_Appointments_Using_Patient_ID);
router.get("/get-info/:id", userController.fetchPatientInfo_Using_Patient_ID);
router.post("/edit-patient", userController.updatePatientInfo);

module.exports = router;
