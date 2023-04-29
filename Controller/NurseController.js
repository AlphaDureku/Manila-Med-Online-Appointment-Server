const sendResponse = require("../utils/sendResponse");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const Nurse = require("../Models/database_query/nurse_queries");
const jwt = require("jsonwebtoken");
const { Day, Week, Year, Month } = require("../utils/DateObjects");
const { verifyJWT } = require("../utils/JWTHandler");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await Nurse.findNurse(username);
    if (!result) {
      return sendResponse(res, 200, false);
    }
    if (await bcrypt.compare(password, result.doctor_Secretary_password)) {
      Nurse_ID = result.doctor_Secretary_ID;
      //Prepare token for nurse login
      const token = jwt.sign({ Nurse_ID }, process.env.JWT_SECRET, {
        expiresIn: "10d",
      });
      return sendResponse(res, 200, { status: true, token: token });
    } else {
      return sendResponse(res, 200, false);
    }
  } catch (error) {
    console.log(error);
  }
};

//Default state of dashboard
exports.dashboard = async (req, res) => {
  const { Nurse_ID } = verifyJWT(req.headers.authorization);
  if (!Nurse_ID) {
    return sendResponse(res, 401, "unathorized");
  }
  try {
    const nurse = await Nurse.findNurseUsingID(Nurse_ID);
    const doctor = await Nurse.findDoctors(Nurse_ID);
    if (doctor) {
      //Doctor only at index 0
      req.session.doctor_ID = doctor.at(0).doctor_ID;
      const calendar = await Nurse.getDoctorCalendar(doctor.at(0).doctor_ID);
      const appointments = await Nurse.getSelectedDoctorAppointments(
        doctor.at(0).doctor_ID,
        Day
      );
      return sendResponse(res, 200, {
        NurseData: nurse,
        DoctorData: doctor,
        AppointmentsData: appointments,
        calendarData: calendar,
      });
    }
    return sendResponse(res, 200, {
      NurseData: nurse,
    });
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, "internal error");
  }
};

exports.changeDoctor = async (req, res) => {
  const { Nurse_ID } = verifyJWT(req.headers.authorization);
  if (!Nurse_ID) {
    return sendResponse(res, 401, "unathorized");
  }
  req.session.doctor_ID = req.query.doctor_ID;
  const { doctor_ID } = req.session;
  try {
    const calendar = await Nurse.getDoctorCalendar(doctor_ID);
    const appointments = await Nurse.getSelectedDoctorAppointments(
      doctor_ID,
      Day
    );
    return sendResponse(res, 200, {
      calendarData: calendar,
      appointmentsData: appointments,
    });
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, "internal error");
  }
};

exports.changeDateRange = async (req, res) => {
  const { Nurse_ID } = verifyJWT(req.headers.authorization);
  if (!Nurse_ID) {
    return sendResponse(res, 401, "unathorized");
  }
  let selectedDateRange = Day;
  switch (req.query.DateRange) {
    case "Week":
      selectedDateRange = Week;
      break;
    case "Month":
      selectedDateRange = Month;
      break;
    case "Year":
      selectedDateRange = Year;
      break;
    default:
      break;
  }
  try {
    const appointments = await Nurse.getSelectedDoctorAppointments(
      req.session.doctor_ID,
      selectedDateRange
    );
    return sendResponse(res, 200, {
      appointmentsData: appointments,
    });
  } catch (error) {
    console.log(error);
  }
};
