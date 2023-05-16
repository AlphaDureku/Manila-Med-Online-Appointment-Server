const HeadAdmin = require("../Models/database_query/headAdmin_queries");
const sendResponse = require("../utils/sendResponse");
const jwt = require("jsonwebtoken");
const Initialize = require("../Models/database_query/intialize_queries");
const uuid = require("uuid");
const { hashSomething, unHashSomething } = require("../utils/Bcrypt");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await HeadAdmin.findHeadAdmin(username);
    if (!result) {
      return sendResponse(res, 200, false);
    }
    if (await unHashSomething(password, result.head_Manager_password)) {
      const head_Manager_ID = result.head_Manager_ID;
      const token = jwt.sign({ head_Manager_ID }, process.env.JWT_SECRET, {
        expiresIn: "10d",
      });

      return sendResponse(res, 200, { status: true, token: token });
    } else {
      return sendResponse(res, 200, { status: false });
    }
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.dashboard = async (req, res) => {
  const { head_Manager_ID } = req.data;
  try {
    const AdminInfo = await HeadAdmin.getHeadAdmin(head_Manager_ID);
    const DoctorsWithoutNurses = await HeadAdmin.getDoctorsWithoutNurse();
    const DoctorsWithNurses = await HeadAdmin.getDoctorsWithNurse();
    const HmoLists = await Initialize.setup_HMO();
    const SpecializationList = await Initialize.setup_Specialization();
    sendResponse(res, 200, {
      AdminInfo: AdminInfo,
      DoctorsWithNurses: DoctorsWithNurses,
      DoctorsWithoutNurses: DoctorsWithoutNurses,
      HmoLists: HmoLists,
      SpecializationList: SpecializationList,
    });
    return;
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.addDoctor = async (req, res) => {
  try {
    const { Fname, Lname, gender, email, contact, specialization_ID, hmo_ID } =
      req.body;

    let doctorModel = {
      doctor_ID: "MCM-" + uuid.v4(),
      doctor_first_name: Fname,
      doctor_last_name: Lname,
      doctor_email: email,
      doctor_gender: gender,
      doctor_contact_number: contact,
      doctorSpecializationSpecializationID: specialization_ID,
    };

    await HeadAdmin.addDoctor(doctorModel, hmo_ID);
    sendResponse(res, 200, true);
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    await HeadAdmin.removeDoctor(req.body.doctor_ID);
    return sendResponse(res, 200, "success");
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.addNurse = async (req, res) => {
  try {
    const { username, password, Fname, Lname } = req.body;
    const nurseModel = {
      doctor_Secretary_ID: "NURSE-" + uuid.v4(),
      doctor_Secretary_username: username,
      doctor_Secretary_password: await hashSomething(password),
      doctor_Secretary_first_name: Fname,
      doctor_Secretary_last_name: Lname,
    };
    await HeadAdmin.addNurse(nurseModel);
    sendResponse(res, 200, true);
  } catch (error) {
    console.log(error);
    sendResponse(res, 400, error.message);
  }
};

exports.matchDoctorNurse = async (req, res) => {
  const { doctor_ID, nurse_ID } = req.body;
  try {
    await HeadAdmin.matchDoctorNurse(doctor_ID, nurse_ID);
    sendResponse(res, 200, true);
  } catch (error) {
    console.log(error.message);
    sendResponse(res, 400, error.message);
  }
};
