const sendResponse = require("../utils/sendResponse");
const User = require("../Models/database_query/user_queries");
const sendEmail = require("../utils/sendEmail");

exports.checkIfExistsAndSendOTP = async (req, res) => {
  const result = await User.findUserUsingEmail(req.body.email);
  if (result) {
    const OTP = sendEmail.sendEmail_Tracking(req.body.email);
    sendResponse(res, 200, { exist: true, OTP: OTP, user_ID: result.user_ID });
    return;
  }
  sendResponse(res, 200, { exist: false });
};

exports.set_userSession = async (req, res) => {
  req.session.user_ID = req.body.user_ID;
  res.end();
};

exports.getUser_Patients = async (req, res) => {
  const result = await User.getUser_Patients_Using_ID(req.session.user_ID);
  console.log(result);
  sendResponse(res, 200, { count: result.count, patientList: result.rows });
};

exports.fetchPatient_Appointments_Using_Patient_ID = async (req, res) => {
  if (req.session.user_ID) {
    const result = await User.fetchPatient_Appointments_Using_Patient_ID(
      req.params.id
    );
    console.log(result);
    sendResponse(res, 200, result);
  } else {
    console.log("Unauthorized");
  }
};
