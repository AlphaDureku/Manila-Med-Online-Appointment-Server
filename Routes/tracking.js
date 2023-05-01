const express = require("express");
const router = express.Router();
//Controllers
const userController = require("../Controller/UserController");
const jwtMiddleware = require("../utils/JWTHandler");

router.get("/get-patients", jwtMiddleware, userController.getUser_Patients);
router.get(
  "/:id",
  jwtMiddleware,
  userController.fetchPatient_Appointments_Using_Patient_ID
);
router.get(
  "/get-info/:id",
  jwtMiddleware,
  userController.fetchPatientInfo_Using_Patient_ID
);
router.post("/edit-patient", jwtMiddleware, userController.updatePatientInfo);

module.exports = router;
