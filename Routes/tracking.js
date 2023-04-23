const express = require("express");
const router = express.Router();
//Controllers
const userController = require("../Controller/UserController");
const auth = require("../utils/UserAuthenticate");

router.post("/set-userSession", userController.set_userSession);
router.get("/get-patients", auth, userController.getUser_Patients);
router.get(
  "/:id",
  auth,
  userController.fetchPatient_Appointments_Using_Patient_ID
);
router.get(
  "/get-info/:id",
  auth,
  userController.fetchPatientInfo_Using_Patient_ID
);
router.post("/edit-patient", auth, userController.updatePatientInfo);

module.exports = router;
