const sendResponse = require("../utils/sendResponse");
const User = require("../Models/database_query/user_queries");
const sendEmail = require("../utils/sendEmail");

exports.sendOTP = async (req, res) => {
  const userResults = {
    OTP: "",
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

  userResults.OTP = sendEmail.sendEmail_Tracking(req.query.email);
  sendResponse(res, 200, { data: userResults });
};
