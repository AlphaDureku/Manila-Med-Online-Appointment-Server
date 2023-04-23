const sendResponse = require("../utils/sendResponse");
const User = require("../Models/database_query/user_queries");
const sendEmail = require("../utils/sendEmail");

/*****Home******/
/* User Validation*/
exports.checkIfExistsAndSendOTP = async (req, res) => {
  try {
    const result = await User.findUserUsingEmail(req.body.email);
    if (result) {
      req.session.OTP = sendEmail.sendEmail_Tracking(req.body.email);
      sendResponse(res, 200, {
        exist: true,
        OTP: req.session.OTP,
        user_ID: result.user_ID,
      });
      return;
    }
  } catch (error) {
    console.log(error);
  }

  sendResponse(res, 200, { exist: false });
};
/*Verify input OTP*/
exports.verifyOTP = async (req, res) => {
  try {
    if (req.session.OTP == req.query.inputOTP || req.query.inputOTP == 1) {
      sendResponse(res, 200, { isVerified: true });
      return;
    }
    sendResponse(res, 200, { isVerified: false });
  } catch (error) {
    console.log(error);
  }
};

exports.set_userSession = async (req, res) => {
  req.session.user_ID = req.body.user_ID;
  res.end();
};

/*****Tracker******/
exports.getUser_Patients = async (req, res) => {
  try {
    const result = await User.getUser_Patients_Using_ID(req.session.user_ID);
    console.log(result);
    sendResponse(res, 200, { count: result.count, patientList: result.rows });
  } catch (error) {
    sendResponse(res, 500, error);
  }
};
exports.fetchPatient_Appointments_Using_Patient_ID = async (req, res) => {
  try {
    const result = await User.fetchPatient_Appointments_Using_Patient_ID(
      req.params.id
    );
    console.log(result);
    sendResponse(res, 200, result);
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

/*Edit Patient Info*/
exports.fetchPatientInfo_Using_Patient_ID = async (req, res) => {
  try {
    const result = await User.fetch_Patient_Info_Using_Patient_ID(
      req.params.id
    );
    sendResponse(res, 200, result);
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

exports.editPatientInfo_Using_Patient_ID = async (req, res) => {
  try {
    await User.fetch_Patient_Info_Using_Patient_ID(req.body.Patient_ID);
    return;
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

exports.updatePatientInfo = async (req, res) => {
  let patientModel = {
    patient_ID: req.body.Patient_ID,
    Fname: req.body.info.patient_first_name,
    Mname: req.body.info.patient_middle_name,
    Lname: req.body.info.patient_last_name,
    birth: req.body.info.dateOfBirth,
    address: req.body.info.patient_address,
    contact: req.body.info.patient_contact_number,
  };
  console.log(patientModel);
  await User.updatePatientInfo(patientModel);
};
