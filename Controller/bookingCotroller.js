const sendResponse = require("../utils/sendResponse");
const User = require("../Models/database_query/user_queries");
const sendEmail = require("../utils/sendEmail");
const {
  getOneDoctorCalendar,
} = require("../Models/database_query/doctor_queries");
exports.sendOTP = async (req, res) => {
  try {
    const userResults = {
      hasHistory: false,
      patient_List: {},
    };
    //Check email user history
    const user_ID = await User.findUserUsingEmail(req.query.email);
    if (user_ID) {
      patient_List = await User.getUser_Patients_Using_ID(user_ID.user_ID);
      userResults.patient_List = patient_List.rows;
      userResults.hasHistory = true;
    }
    req.session.OTP = sendEmail.BookingOTP(req.query.email);
    return sendResponse(res, 200, { data: userResults });
  } catch (error) {
    return sendResponse(res, 500, error);
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    if (req.session.OTP == req.query.inputOTP || req.query.inputOTP == 1) {
      return sendResponse(res, 200, { isVerified: true });
    }
    return sendResponse(res, 200, { isVerified: false });
  } catch (error) {
    return sendResponse(res, 500, error);
  }
};

exports.getOneDoctorCalendar = async (req, res) => {
  const { doctor_ID } = req.query;
  try {
    const result = await getOneDoctorCalendar(doctor_ID);
    return sendResponse(res, 200, result);
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error);
  }
};
