const sendResponse = require("../utils/sendResponse");
const uuid = require("uuid");
const User = require("../Models/database_query/user_queries");
const sendEmail = require("../utils/sendEmail");
const {
  getOneDoctorCalendar,
  getQueueInstance,
  incrementQueue,
} = require("../Models/database_query/doctor_queries");
const moment = require("moment");
const {
  upperCaseFirstLetter,
  formatContactNumber,
  LogBookFunction,
} = require("../utils/collectionOfFunctions");
const {
  updateAppointmentStatusLogBook,
  findDoctorsNurse,
} = require("../Models/database_query/nurse_queries");
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
    return sendResponse(res, 500, error.message);
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    if (req.session.OTP == req.query.inputOTP || req.query.inputOTP == 1) {
      return sendResponse(res, 200, { isVerified: true });
    }
    return sendResponse(res, 200, { isVerified: false });
  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};

exports.getOneDoctorCalendar = async (req, res) => {
  const { doctor_ID } = req.query;
  try {
    const result = await getOneDoctorCalendar(doctor_ID);
    return sendResponse(res, 200, result);
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
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
    return sendResponse(res, 500, error.message);
  }
};

exports.checkConflict = async (req, res) => {
  const { date, patient_ID } = req.query;
  const result = await User.checkIfConflict(
    patient_ID,
    moment(date).format("YYYY-MM-DD")
  );
  return sendResponse(res, 200, result);
};
exports.setAppointment = async (req, res) => {
  const { schedule_ID, email, patient_ID, doctor_ID, recom_Time } =
    req.body.appointmentDetails;
  console.log(req.body.appointmentDetails);
  try {
    let user_ID = await User.findUserUsingEmail(email);
    const queue_number = await getQueueInstance(schedule_ID);
    if (user_ID !== null) {
      if (patient_ID) {
        const appointmentDetailsModel = {
          appointment_ID: "APP-" + uuid.v4(),
          patient_ID: patient_ID,
          doctor_schedule_ID: schedule_ID,
          doctor_ID: doctor_ID,
          appointment_start: moment(recom_Time, "h:mm A").format("HH:mm:ss"),
          appointment_queue: queue_number,
        };
        await User.insertAppointment(appointmentDetailsModel);
        await incrementQueue(schedule_ID);
        await LogBookFunction({
          doctor_ID: doctor_ID,
          updatedFrom: null,
          updatedTo: "Pending",
        });
        return sendResponse(res, 200, {
          message: "userExist but old patient",
          appointment_ID: appointmentDetailsModel.appointment_ID,
        });
      } else {
        const appointment_ID = await preparePatientAndAppointment(
          req.body.appointmentDetails,
          user_ID,
          queue_number
        );
        return sendResponse(res, 200, {
          message: "userExist but new patient",
          appointment_ID: appointment_ID,
        });
      }
    } else {
      user_ID = await User.insertUser(email);
      const appointment_ID = await preparePatientAndAppointment(
        req.body.appointmentDetails,
        user_ID,
        queue_number
      );
      return sendResponse(res, 200, {
        message: "new User so new patient",
        appointment_ID: appointment_ID,
      });
    }
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.updatePatientInfo = async (req, res) => {
  const { Patient_ID } = req.body;
  const {
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    address,
    contactNumber,
    gender,
  } = req.body.info;
  let patientModel = {
    patient_ID: Patient_ID,
    Fname: firstName,
    Mname: middleName,
    Lname: lastName,
    birth: dateOfBirth,
    address: address,
    contact: contactNumber,
    gender: gender,
  };

  try {
    await User.updatePatientInfo(patientModel);
    return sendResponse(res, 200, "success");
  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};

exports.getAppointmentDetails = async (req, res) => {
  const { appointment_ID } = req.query;
  const result = await User.getAppointmentDetailsUsingAppointmentID(
    appointment_ID
  );
  sendResponse(res, 200, result);
};

const preparePatientAndAppointment = async (
  appointmentDetails,
  user_ID,
  queue_number
) => {
  const { patient_info, recom_Time, schedule_ID, doctor_ID } =
    appointmentDetails;
  const patientModel = {
    patient_ID: "PATIENT-" + uuid.v4(),
    user_ID: user_ID.user_ID,
    patient_first_name: upperCaseFirstLetter(patient_info.patient_first_name),
    patient_middle_name: upperCaseFirstLetter(patient_info.patient_middle_name),
    patient_last_name: upperCaseFirstLetter(patient_info.patient_last_name),
    patient_contact_number: formatContactNumber(patient_info.contact_number),
    patient_dateOfBirth: patient_info.dateOfBirth,
    patient_address: patient_info.address,
    patient_gender: patient_info.gender,
  };
  const appointmentDetailsModel = {
    appointment_ID: "APP-" + uuid.v4(),
    patient_ID: patientModel.patient_ID,
    doctor_schedule_ID: schedule_ID,
    doctor_ID: doctor_ID,
    appointment_start: moment(recom_Time, "h:mm A").format("HH:mm:ss"),
    appointment_queue: queue_number,
  };
  await User.insertPatient(patientModel);
  await User.insertAppointment(appointmentDetailsModel);
  await incrementQueue(appointmentDetails.schedule_ID);
  await LogBookFunction({
    doctor_ID: doctor_ID,
    updatedFrom: null,
    updatedTo: "Pending",
  });
  return appointmentDetailsModel.appointment_ID;
};
