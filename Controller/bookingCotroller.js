const sendResponse = require("../utils/sendResponse");
const User = require("../Models/database_query/user_queries");
const sendEmail = require("../utils/sendEmail");
const {
  getOneDoctorCalendar,
  getQueueInstance,
  incrementQueue,
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

exports.getOnePatientDetails = async (req, res) => {
  const { patient_ID } = req.query;
  try {
    const patient_info = await User.fetch_Patient_Info_Using_Patient_ID(
      patient_ID
    );
    sendResponse(res, 200, patient_info);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, error);
  }
};

exports.setAppointment = async (req, res) => {
  const { schedule_ID, email, patient_ID } = req.body.appointmentDetails;
  const {
    patient_first_name,
    patient_middle_name,
    patient_last_name,
    age,
    contact_number,
    address,
    dateOfBirth,
    gender,
  } = req.body.appointmentDetails.patient_info;
  try {
    let user_ID = await User.findUserUsingEmail(email);
    const queue_number = await getQueueInstance(schedule_ID);
    let prepareAppointmentDetails = {};
    if (user_ID !== null) {
      if (patient_ID) {
        prepareAppointmentDetails =
          await User.fetch_Patient_Info_Using_Patient_ID(patient_ID);
        prepareAppointmentDetails["queue"] = queue_number;
        incrementQueue(schedule_ID);
        return sendResponse(res, 200, {
          prepareAppointmentDetails,
          message: "userExist but old patient",
        });
      } else {
        prepareAppointmentDetails = {
          user_ID: user_ID,
          patient_first_name: patient_first_name,
          patient_middle_name: patient_middle_name,
          patient_last_name: patient_last_name,
          contact_number,
          age: age,
          dateOfBirth: dateOfBirth,
          address: address,
          gender: gender,
          schedule_ID: schedule_ID,
          queue: queue_number,
        };
        incrementQueue(schedule_ID);
        return sendResponse(res, 200, {
          prepareAppointmentDetails,
          message: "userExist but new patient",
        });
      }
    } else {
      user_ID = await User.insertUser(email);
      prepareAppointmentDetails = {
        user_ID: user_ID.user_ID,
        patient_first_name: patient_first_name,
        patient_middle_name: patient_middle_name,
        patient_last_name: patient_last_name,
        contact_number,
        age: age,
        dateOfBirth: dateOfBirth,
        address: address,
        gender: gender,
        schedule_ID: schedule_ID,
        queue: queue_number,
      };
      incrementQueue(schedule_ID);
      return sendResponse(res, 200, {
        prepareAppointmentDetails,
        message: "new User so new patient",
      });
    }
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error);
  }
};
