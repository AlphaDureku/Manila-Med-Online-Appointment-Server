const Sequelize = require("sequelize");
const model = require("../models");

//For Tracking
exports.findUserUsingEmail = async function (email) {
  return await model.user.findOne({
    raw: true,
    attributes: ["user_ID"],
    where: { user_email: email },
  });
};

exports.getUser_Patients_Using_ID = async function (user_ID) {
  return await model.patient.findAndCountAll({
    raw: true,
    attributes: [
      "patient_ID",
      "patient_first_name",
      "patient_last_name",
      "patient_gender",
    ],
    include: [
      {
        model: model.user,
        attributes: [],
      },
    ],
    where: {
      user_ID: user_ID,
    },
  });
};

const age = Sequelize.fn(
  "TIMESTAMPDIFF",
  Sequelize.literal("YEAR"),
  Sequelize.literal("patient_dateOfBirth"),
  Sequelize.fn("NOW")
);
const myAppointmentAttributes = [
  [Sequelize.col("appointment_ID"), "appointment_ID"],
  "patient_ID",
  "patient_first_name",
  "patient_last_name",
  [Sequelize.col("doctor_first_name"), "doctor_Fname"],
  [Sequelize.col("specialization_Name"), "specialization"],
  [Sequelize.col("doctor_last_name"), "doctor_Lname"],
  [
    Sequelize.fn(
      "date_format",
      Sequelize.col("doctor_schedule_date"),
      "%b %e, %Y"
    ),
    "date",
  ],
  [
    Sequelize.fn("date_format", Sequelize.col("appointment_start"), "%h:%i%p"),
    "start",
  ],
  [
    Sequelize.fn(
      "date_format",
      Sequelize.col("doctor_schedule_end_time"),
      "%h:%i%p"
    ),
    "end",
  ],
  [Sequelize.col("appointment_status"), "status"],
];

exports.fetchPatient_Appointments_Using_Patient_ID = async function (
  patient_ID
) {
  return await model.patient.findAll({
    raw: true,
    attributes: myAppointmentAttributes,
    include: [
      {
        model: model.user,
        attributes: [],
      },

      {
        model: model.appointmentDetails,
        attributes: [],
        required: true,
        include: [
          {
            model: model.doctor,
            attributes: [],
            required: true,
            include: [
              {
                model: model.doctor_specialization,
              },
            ],
          },
          {
            model: model.doctor_schedule_table,
            attributes: [],
            required: false,
          },
        ],
      },
    ],
    where: {
      patient_ID: patient_ID,
    },
  });
};
