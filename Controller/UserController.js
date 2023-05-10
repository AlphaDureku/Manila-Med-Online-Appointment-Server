const sendResponse = require("../utils/sendResponse");
const User = require("../Models/database_query/user_queries");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const {
  updateAppointmentStatus,
} = require("../Models/database_query/nurse_queries");

/*****Home******/
/* User Validation*/
exports.checkIfExistsAndSendOTP = async (req, res) => {
  const result = await User.findUserUsingEmail(req.body.email);
  try {
    if (result) {
      req.session.OTP = sendEmail.TrackingOTP(req.body.email);
      return sendResponse(res, 200, {
        exist: true,
        user_ID: result.user_ID,
      });
    }
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
  return sendResponse(res, 200, { exist: false });
};
/*Verify input OTP*/
exports.verifyOTP = async (req, res) => {
  try {
    if (req.session.OTP == req.body.inputOTP || req.body.inputOTP == 1) {
      const { user_ID } = req.body;
      const token = jwt.sign({ user_ID }, process.env.JWT_SECRET, {
        expiresIn: "10d",
      });
      return sendResponse(res, 200, { isVerified: true, userToken: token });
    }
    sendResponse(res, 200, { isVerified: false });
  } catch (error) {
    console.log(error);
  }
};

/*****Tracker******/
exports.getUser_Patients = async (req, res) => {
  try {
    const { user_ID } = req.data;
    const result = await User.getUser_Patients_Using_ID(user_ID);
    console.log(result);
    return sendResponse(res, 200, {
      count: result.count,
      patientList: result.rows,
    });
  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};
exports.fetchPatient_Appointments_Using_Patient_ID = async (req, res) => {
  try {
    const result = await User.fetchPatient_Appointments_Using_Patient_ID(
      req.params.id
    );

    return sendResponse(res, 200, result);
  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};

/*Edit Patient Info*/
exports.fetchPatientInfo_Using_Patient_ID = async (req, res) => {
  try {
    const result = await User.fetch_Patient_Info_Using_Patient_ID(
      req.params.id
    );
    return sendResponse(res, 200, result);
  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};

exports.editPatientInfo_Using_Patient_ID = async (req, res) => {
  try {
    await User.fetch_Patient_Info_Using_Patient_ID(req.body.Patient_ID);
    return;
  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};

exports.updatePatientInfo = async (req, res) => {
  const { Patient_ID } = req.body;
  const {
    patient_first_name,
    patient_middle_name,
    patient_last_name,
    dateOfBirth,
    patient_address,
    patient_contact_number,
  } = req.body.info;
  let patientModel = {
    patient_ID: Patient_ID,
    Fname: patient_first_name,
    Mname: patient_middle_name,
    Lname: patient_last_name,
    birth: dateOfBirth,
    address: patient_address,
    contact: patient_contact_number,
  };
  console.log(patientModel);
  try {
    await User.updatePatientInfo(patientModel);
  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};

exports.cancelAppointment = async (req, res) => {
  const { appointment_ID } = req.body;
  console.log(req.body);
  try {
    await updateAppointmentStatus("Cancelled", appointment_ID);
    return sendResponse(res, 200, "success");
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};
