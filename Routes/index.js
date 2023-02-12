const express = require("express");
const router = express.Router();

//Controllers
const APIcontroller = require('../Controller/api');
const DoctorController = require("../Controller/doctorController");


router.get("/api", APIcontroller.api);
router.get("/doctors/search", DoctorController.searchDoctor)




module.exports = router;
