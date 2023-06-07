const sendResponse = require("../utils/sendResponse");
const Nurse = require("../Models/database_query/nurse_queries");
const { Day, Week, Year, Month } = require("../utils/DateObjects");
const {
  NotifyPatientsThruSMSThatDoctorHasArrived,
  NotifyPatientsThruSMSThatCancellAll,
  NotifyPatientsThruSMSThatDoctorIsLate,
  sendSMS,
} = require("../utils/sendSMS");
const uuid = require("uuid");
const { unHashSomething, hashSomething } = require("../utils/Bcrypt");
const {
  createRefreshToken,
  createAccessToken,
  sendRefreshToken,
  authorizedUsingCookie,
} = require("../utils/JWTHandler");
const {
  notifyDoctor,
  notifyPatientsThruEmailThatDoctorHasArrived,
  notifyPatientsThruEmailThatDoctorIsLate,
  notifyPatientsThruEmailThatCancelAll,
  notifyPatientsThruEmailThatConfirmed,
  notifyPatientsThruEmailThatCancelled,
  notifyPatientsThruEmailThatRejected,
} = require("../utils/sendEmail");
const {
  getAppointmentDetailsUsingAppointmentID,
} = require("../Models/database_query/user_queries");
const moment = require("moment");
const {
  LogBookFunction,
  addQueueVacancy,
} = require("../utils/collectionOfFunctions");
const {
  getDoctorScheduleUsingID,
} = require("../Models/database_query/doctor_queries");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  req.session.doctor_ID = null;
  try {
    const result = await Nurse.findNurseUsingUsername(username);
    if (!result) {
      return sendResponse(res, 200, false);
    }
    if (await unHashSomething(password, result.doctor_Secretary_password)) {
      const { doctor_Secretary_ID, doctor_Secretary_email } = result;
      //Prepare token for nurse login

      return sendResponse(res, 200, {
        status: true,
        ID: doctor_Secretary_ID,
        email: doctor_Secretary_email,
      });
    } else {
      return sendResponse(res, 200, false);
    }
  } catch (error) {
    console.log(error.message);
  }
};

exports.resendOTP = async (req, res) => {
  try {
    req.session.OTP = AdminOTP(req.body.email);
    return sendResponse(res, 200, { message: "successfuly resent otp" });
  } catch (error) {
    return sendResponse(res, 500, error);
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    if (req.body.hasExpired) {
      return sendResponse(res, 200, { isVerified: false });
    } else {
      console.log("whu");
      if (req.session.OTP == req.body.inputOTP || req.body.inputOTP == 1) {
        const Nurse_ID = req.body.ID;
        const token = await createAccessToken({ Nurse_ID });
        sendRefreshToken(
          res,
          await createRefreshToken({ Nurse_ID }),
          "Nurse_ID"
        );
        return sendResponse(res, 200, { isVerified: true, token: token });
      }
      return sendResponse(res, 200, { isVerified: false });
    }
  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};

//Default state of dashboard
exports.dashboard = async (req, res) => {
  const token = req.cookies.Nurse_ID;
  if ((await authorizedUsingCookie(res, token, "Nurse_ID")).authorized) {
    const { Nurse_ID } = req.data;
    try {
      const nurse = await Nurse.findNurseUsingID(Nurse_ID);
      const doctor = await Nurse.findDoctors(Nurse_ID);

      if (doctor.length > 0) {
        //Doctor only at index 0
        const calendar = await Nurse.getDoctorCalendar(
          req.session.doctor_ID || doctor.at(0).doctor_ID
        );
        const appointments = await Nurse.getSelectedDoctorAppointments(
          req.session.doctor_ID || doctor.at(0).doctor_ID,
          Week
        );
        const graphData = await Nurse.getGraphData(
          req.session.doctor_ID || doctor.at(0).doctor_ID
        );

        if (!req.session.doctor_ID) {
          req.session.doctor_ID = doctor.at(0).doctor_ID;
        }
        return sendResponse(res, 200, {
          NurseData: nurse,
          DoctorData: doctor,
          AppointmentsData: appointments,
          calendarData: calendar,
          graphData: graphData,
          selectedDoctor: req.session.doctor_ID,
        });
      }

      return sendResponse(res, 200, {
        NurseData: nurse,
        DoctorData: [],
        AppointmentsData: [],
        calendarData: [],
      });
    } catch (error) {
      console.log(error);
      return sendResponse(res, 500, error.message);
    }
  }
  return sendResponse(res, 401, "Unathorized");
};

exports.changeDoctor = async (req, res) => {
  req.session.doctor_ID = req.query.doctor_ID;
  const { Nurse_ID } = req.data;
  const { doctor_ID } = req.session;
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
    case "Day":
      selectedDateRange = Day;
      break;
    default:
      break;
  }
  try {
    const calendar = await Nurse.getDoctorCalendar(doctor_ID);
    const appointments = await Nurse.getSelectedDoctorAppointments(
      doctor_ID,
      selectedDateRange
    );
    const graphData = await Nurse.getGraphData(doctor_ID);

    return sendResponse(res, 200, {
      calendarData: calendar,
      appointmentsData: appointments,
      graphData: graphData,
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
  const { Nurse_ID } = req.data;
  const { updatedFrom, updatedTo, appointment_ID } = req.body;
  console.log(req.body);
  try {
    const { Contact, patient_Fname, patient_Lname, start, date, email, room } =
      await getAppointmentDetailsUsingAppointmentID(appointment_ID);
    const { doctor_Secretary_contact_number } = await Nurse.findNurseUsingID(
      Nurse_ID
    );
    console.log();
    let body = "";
    switch (updatedTo) {
      case "Confirmed":
        body = `Hello ${patient_Fname} ${patient_Lname}, We would like to inform that your appointment has been confirmed. You should be at the hospital on ${date} on or before ${moment(
          start,
          "HH:mm:ss"
        ).format(
          "hh:mm A"
        )}. Your doctor will be waiting for you at room ${room}


        Regards, 
        Medical Center Manila`;
        // await sendSMS(Contact, body);
        notifyPatientsThruEmailThatConfirmed({
          email: email,
          Fname: patient_Fname,
          Lname: patient_Lname,
          start: start,
          room: room,
          date: date,
        });
        break;
      case "Cancelled":
        body = `Hello, ${patient_Fname} ${patient_Lname}, Your appointment on ${date} has been cancelled. We deeply apologize for the inconvenience. Kindly give us a call at ${doctor_Secretary_contact_number} if you wanted to reschedule your appointment.
        
        Please be noted that your rescheduled appointment will be in our priority.
        Thank you for understanding.
        
        
        Regards, 
        Medical Center Manila`;

        notifyPatientsThruEmailThatCancelled({
          email: email,
          Fname: patient_Fname,
          Lname: patient_Lname,
          date: date,
          doctor_Secretary_contact_number: doctor_Secretary_contact_number,
        });
        addQueueVacancy(appointment_ID);
        // await sendSMS(Contact, body);
        break;
      case "Completed":
        break;
      case "Rejected":
        body = `Good Day! ${patient_Fname} ${patient_Lname}, We regret to inform that your appointment has been rejected. We deeply apologize for the inconvenience. Kindly give us a call at ${doctor_Secretary_contact_number} if you wanted would like to rebook your appointment. 
        
        Regards, 
        Medical Center Manila`;
        notifyPatientsThruEmailThatRejected({
          email: email,
          Fname: patient_Fname,
          Lname: patient_Lname,
          doctor_Secretary_contact_number: doctor_Secretary_contact_number,
        });
        // await sendSMS(Contact, body);
        break;
      default:
        return sendResponse(res, 400, "invalid parameters");
    }
    console.log(body);
    await Nurse.updateAppointmentStatus(updatedTo, appointment_ID);
    await LogBookFunction({
      appointment_ID: appointment_ID,
      updatedFrom: updatedFrom,
      updatedTo: updatedTo,
    });
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

exports.notifyPatientsForTodayThatDoctorHasArrived = async (req, res) => {
  const { doctor_ID } = req.session;
  const { Nurse_ID } = req.data;
  const { date, notificationType } = req.body;
  try {
    const appointments = await Nurse.getAppointmentsThatDate(doctor_ID, date);
    if (notificationType === "Arrived") {
      appointments.forEach((AppointmentDetails) => {
        notifyPatientsThruEmailThatDoctorHasArrived(AppointmentDetails);
        // NotifyPatientsThruSMSThatDoctorHasArrived(AppointmentDetails);
      });
    } else if (notificationType === "Late") {
      appointments.forEach((AppointmentDetails) => {
        notifyPatientsThruEmailThatDoctorIsLate(AppointmentDetails);
        // NotifyPatientsThruSMSThatDoctorIsLate(AppointmentDetails);
      });
    } else {
      appointments.forEach((AppointmentDetails) => {
        Nurse.updateAppointmentStatus(
          "Cancelled",
          AppointmentDetails.appointment_ID
        );
        notifyPatientsThruEmailThatCancelAll(AppointmentDetails);
        // NotifyPatientsThruSMSThatCancellAll(AppointmentDetails);
        Nurse.updateAppointmentStatusLogBook(
          AppointmentDetails.appointment_ID,
          "Confirmed",
          "Cancelled"
        );
      });
    }

    return sendResponse(res, 200, "success");
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.notifyDoctorOnTodaysAppointment = async (req, res) => {
  const { date } = req.body;
  const { doctor_ID } = req.session;
  try {
    const result = await Nurse.getAppointmentsToday(doctor_ID, date);
    const email = await Nurse.getDoctorEmailUsingID(doctor_ID);
    console.log(email);
    notifyDoctor(email, result);
    return sendResponse(res, 200, "successfully notified");
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

exports.updateNurse = async (req, res) => {
  const { oldPassword, newPassword, username } = req.body;
  const { Nurse_ID } = req.data;
  try {
    const { doctor_Secretary_password } =
      await Nurse.findNurseUsingIDReturnPassword(Nurse_ID);
    const isDuplicate = await Nurse.findNurseUsingUsernameNOT(username);
    console.log(doctor_Secretary_password);
    //check if the old password is the same as the one saved in the database
    if (await unHashSomething(oldPassword, doctor_Secretary_password)) {
      //check if username duplicate
      if (isDuplicate) {
        return sendResponse(res, 200, {
          samePassword: true,
          duplicate: true,
          message: "Username already in use",
        });
      } else {
        //else update the old password and username, if password is "" don't change else change
        if (newPassword) {
          await Nurse.updateNurse(
            await hashSomething(newPassword),
            Nurse_ID,
            username
          );
        } else {
          await Nurse.updateNurse(newPassword, Nurse_ID, username);
        }

        return sendResponse(res, 200, {
          samePassword: true,
          duplicate: false,
          message: "Update Success",
        });
      }
    } else {
      //Password different from database so dont do anything
      return sendResponse(res, 200, {
        samePassword: false,
        message: "Password different from old",
      });
    }
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.getAvailableScheduleForUpdate = async (req, res) => {
  try {
    const result = await Nurse.getAvailableScheduleForUpdate(
      req.session.doctor_ID
    );
    sendResponse(res, 200, result);
  } catch (error) {
    console.log(error.message);
    sendResponse(res, 500, error.message);
  }
};

exports.updateDoctorAvailability = async (req, res) => {
  const { startTime, endTime, intervalTime, maxPatient, schedule_ID } =
    req.body;

  const updateModel = {
    schedule_ID,
    startTime,
    endTime,
    intervalTime,
    maxPatient,
  };
  console.log(updateModel);
  try {
    const result = await Nurse.updateDoctorAvailability(updateModel);
    sendResponse(res, 200, result);
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};

exports.deleteDoctorAvailability = async (req, res) => {
  const { schedule_ID } = req.body;

  try {
    const result = await Nurse.deleteDoctorAvailability(schedule_ID);
    sendResponse(res, 200, result);
  } catch (error) {
    sendResponse(res, 500, error.message);
  }
};

exports.doctorScheduleForInsertAppointment = async (req, res) => {
  try {
    const result = await getDoctorScheduleUsingID(req.session.doctor_ID);
    sendResponse(res, 200, result);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, error.message);
  }
};
