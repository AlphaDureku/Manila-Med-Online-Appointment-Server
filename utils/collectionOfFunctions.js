const {
  findDoctorsNurse,
  updateAppointmentStatusLogBook,
  addQueueVacancy,
} = require("../Models/database_query/nurse_queries");
const {
  getAppointmentDetailsUsingAppointmentID,
  getQueueInstanceUsingAppointmentID,
} = require("../Models/database_query/user_queries");

exports.upperCaseFirstLetter = (params) => {
  const words = params.split(" ");
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  return capitalizedWords.join(" ");
};

exports.sessionDestroy = (req) => {
  req.session.destroy();
};

exports.formatContactNumber = (contactNumber) => {
  if (contactNumber.startsWith("09")) {
    return "+639" + contactNumber.substring(2);
  } else if (contactNumber.startsWith("639")) {
    return "+639" + contactNumber.substring(3);
  } else {
    return contactNumber;
  }
};
exports.addQueueVacancy = async (appointment_ID) => {
  const { appointment_queue, doctor_schedule_ID } =
    await getQueueInstanceUsingAppointmentID(appointment_ID);
  await addQueueVacancy(appointment_queue, doctor_schedule_ID);
  return;
};

exports.LogBookFunction = async (UpdateStatus) => {
  const { appointment_ID, updatedFrom, updatedTo } = UpdateStatus;
  const result = await updateAppointmentStatusLogBook(
    appointment_ID,
    updatedFrom,
    updatedTo
  );

  return result;
};
