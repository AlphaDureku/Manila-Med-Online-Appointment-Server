const sendResponse = require("../utils/sendResponse");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const Nurse = require("../Models/database_query/nurse_queries");
const jwt = require("jsonwebtoken");
const { Day, Week, Year, Month } = require("../utils/DateObjects");
const { NotifyPatients } = require("../utils/sendSMS");
const uuid = require("uuid");
const { unHashSomething, hashSomething } = require("../utils/Bcrypt");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await Nurse.findNurse(username);
    if (!result) {
      return sendResponse(res, 200, false);
    }
    console.log(result);
    if (await unHashSomething(password, result.doctor_Secretary_password)) {
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
    console.log(error.message);
  }
};

//Default state of dashboard
exports.dashboard = async (req, res) => {
  const { Nurse_ID } = req.data;
  try {
    const nurse = await Nurse.findNurseUsingID(Nurse_ID);
    const doctor = await Nurse.findDoctors(Nurse_ID);

    if (doctor.length > 0) {
      //Doctor only at index 0
      req.session.doctor_ID = doctor.at(0).doctor_ID;
      const calendar = await Nurse.getDoctorCalendar(doctor.at(0).doctor_ID);
      const appointments = await Nurse.getSelectedDoctorAppointments(
        doctor.at(0).doctor_ID,
        Week
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
    return sendResponse(res, 500, error.message);
  }
};

exports.changeDoctor = async (req, res) => {
  req.session.doctor_ID = req.query.doctor_ID;
  const { doctor_ID } = req.session;
  try {
    const calendar = await Nurse.getDoctorCalendar(doctor_ID);
    const appointments = await Nurse.getSelectedDoctorAppointments(
      doctor_ID,
      Year
    );
    return sendResponse(res, 200, {
      calendarData: calendar,
      appointmentsData: appointments,
    });
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.changeDateRange = async (req, res) => {
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
    return sendResponse(res, 500, error.message);
  }
};

exports.searchAppointments = async (req, res) => {
  selectedDateRange = Year;
  try {
    const appointments = await Nurse.getSelectedDoctorAppointments(
      req.session.doctor_ID,
      selectedDateRange,
      req.query.name
    );
    console.log(appointments);
    //Remind front end to set date range to Year to widen search results
    return sendResponse(res, 200, {
      appointmentsData: appointments,
    });
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { updateStatus, appointment_ID } = req.body;
  try {
    if (!updateStatus) {
      return sendResponse(res, 400, "bad parameter");
    }
    switch (updateStatus) {
      case "Confirmed":
        await Nurse.updateAppointmentStatus(updateStatus, appointment_ID);
        break;
      case "Cancelled":
        await Nurse.updateAppointmentStatus(updateStatus, appointment_ID);
        break;
      case "Completed":
        await Nurse.updateAppointmentStatus(updateStatus, appointment_ID);
        break;
      case "Rejected":
        await Nurse.updateAppointmentStatus(updateStatus, appointment_ID);
        break;
      case "Pending":
        await Nurse.updateAppointmentStatus(updateStatus, appointment_ID);
        break;

      default:
        return sendResponse(res, 400, "invalid parameters");
    }
    return sendResponse(res, 200, "success");
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.confirmedAppointmentsThatDay = async (req, res) => {
  const { doctor_ID } = req.session;
  const { date } = req.query;
  try {
    const appointments = await Nurse.getAppointmentsThatDate(doctor_ID, date);
    return sendResponse(res, 200, appointments);
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.notifyPatientsForToday = async (req, res) => {
  const { doctor_ID } = req.session;
  const { date } = req.body;
  try {
    const appointments = await Nurse.getAppointmentsThatDate(doctor_ID, date);
    appointments.forEach((patient) => {
      NotifyPatients(patient);
    });
    return sendResponse(res, 200, "success");
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.addDoctorAvailability = async (req, res) => {
  const { date, startTime, endTime, intervalTime, maxPatient } = req.body;
  const schedule_tableModel = {
    doctor_schedule_ID: "SCHED - " + uuid.v4(),
    doctor_ID: req.session.doctor_ID,
    doctor_schedule_date: date,
    doctor_schedule_start_time: startTime,
    doctor_schedule_end_time: endTime,
    doctor_schedule_Interval: intervalTime,
    doctor_schedule_max_patient: maxPatient,
  };
  try {
    const result = await Nurse.insertDoctorAvailability(schedule_tableModel);
    sendResponse(res, 200, result);
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { Nurse_ID } = req.data;
  try {
    const { doctor_Secretary_password } =
      await Nurse.findNurseUsingIDReturnPassword(Nurse_ID);
    if (await unHashSomething(oldPassword, doctor_Secretary_password)) {
      await Nurse.updatePassword(await hashSomething(newPassword), Nurse_ID);
    } else {
      return sendResponse(res, 200, { message: "Wrong password" });
    }
    return sendResponse(res, 200, { message: "Success!" });
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};
