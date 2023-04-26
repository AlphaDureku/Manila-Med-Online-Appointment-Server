const sendResponse = require("../utils/sendResponse");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const Nurse = require("../Models/database_query/nurse_queries");
const moment = require("moment");

// exports.setNurseSession = async (req, res) => {
//   req.session.Nurse_ID = req.body.Nurse_ID;
// };

exports.login = async (req, res) => {
  try {
    const result = await Nurse.findNurse(req.body.username);
    if (!result) {
      return sendResponse(res, 404, false);
    }
    if (
      await bcrypt.compare(req.body.password, result.doctor_Secretary_password)
    ) {
      //set nurse session
      req.session.Nurse_ID = result.doctor_Secretary_ID;
      return sendResponse(res, 200, true);
    } else {
      return sendResponse(res, 404, false);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.dashboard = async (req, res) => {
  try {
    const { Nurse_ID } = req.session;

    if (!Nurse_ID) {
      return sendResponse(res, 401, "unathorized");
    }
    //prepare data to be sent on dashboard
    const nurse = await Nurse.findNurseUsingID(Nurse_ID);
    const doctor = await Nurse.findDoctors(Nurse_ID);
    if (doctor) {
      // const appointments = await Nurse.fetchDoctorPatientAppointments(
      //   doctor.at(0).doctor_ID,
      //   moment().startOf("day").toDate(),
      //   moment().endOf("day").toDate()
      // );
      const calendar = await Nurse.getDoctorCalendar(doctor.at(0).doctor_ID);
      const appointments = await Nurse.getSelectedDoctorAppointments(
        doctor.at(0).doctor_ID,
        req.query.status
      );
      return sendResponse(res, 200, {
        NurseData: nurse,
        DoctorData: doctor,
        AppointmentsData: appointments,
        calendar,
      });
    }
    return sendResponse(res, 200, {
      NurseData: nurse,
    });
  } catch (error) {
    console.log(error);
  }
};
