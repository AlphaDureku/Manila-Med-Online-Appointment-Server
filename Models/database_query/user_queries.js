const Sequelize = require("sequelize");
const model = require("../models");
const uuid = require("uuid");

//For User Validation
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
    order: [["patient_last_name", "ASC"]],
  });
};

//For Tracking Page
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
  "patient_address",
  [age, "patient_age"],
  [Sequelize.col("patient_gender"), "gender"],
  [Sequelize.col("patient_contact_number"), "contact"],
  [Sequelize.col("user_email"), "email"],
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

/*For Patient Info modifications*/
exports.fetch_Patient_Info_Using_Patient_ID = async function (patient_ID) {
  return await model.patient.findOne({
    raw: true,
    where: {
      patient_ID: patient_ID,
    },
    attributes: [
      "user_ID",
      "patient_first_name",
      "patient_last_name",
      "patient_middle_name",
      "patient_contact_number",
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("patient_dateOfBirth"),
          "%Y-%m-%d"
        ),
        "dateOfBirth",
      ],
      "patient_address",
      "patient_gender",
      [Sequelize.col("user_email"), "email"],
    ],
    include: [
      {
        model: model.user,
        attributes: [],
      },
    ],
  });
};

exports.updatePatientInfo = async function (patientModel) {
  await model.patient.update(
    {
      patient_first_name: patientModel.Fname,
      patient_middle_name: patientModel.Mname,
      patient_last_name: patientModel.Lname,
      patient_contact_number: patientModel.contact,
      patient_address: patientModel.address,
      patient_dateOfBirth: patientModel.birth,
      patient_gender: patientModel.gender,
    },
    {
      where: {
        patient_ID: patientModel.patient_ID,
      },
    }
  );
};

exports.insertUser = async function (email) {
  const userModel = {
    user_ID: "USER-" + uuid.v4(),
    user_email: email,
  };
  await model.user.create(userModel);
  return userModel;
};

exports.insertPatient = async function (patientModel) {
  return await model.patient.create(patientModel);
};

exports.insertAppointment = async function (appointmentDetailsModel) {
  await model.appointmentDetails.create(appointmentDetailsModel);
};

exports.getAppointmentDetailsUsingAppointmentID = async function (
  appointmentID
) {
  return await model.appointmentDetails.findAll({
    raw: true,
    attributes: [
      [Sequelize.col("doctor_first_name"), "Fname"],
      [Sequelize.col("doctor_last_name"), "Lname"],
      [Sequelize.col("specialization_Name"), "specialization"],
      [Sequelize.col("patient_first_name"), "patient_Fname"],
      [Sequelize.col("patient_last_name"), "patient_Lname"],
      [Sequelize.col("patient_contact_number"), "Contact"],
      [Sequelize.col("appointment_start"), "start"],
      "doctor_schedule_table.doctor_schedule_ID",
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_table.doctor_schedule_date"),
          "%M %e, %Y"
        ),
        "date",
      ],
    ],
    where: { appointment_ID: appointmentID },
    include: [
      {
        model: model.patient,
        attributes: [],
      },
      {
        model: model.doctor_schedule_table,
        attributes: [],
      },
      {
        model: model.doctor,
        attributes: [],
        include: [
          {
            model: model.doctor_specialization,
            attributes: [],
          },
        ],
      },
    ],
  });
};

exports.checkIfConflict = async function (patient_ID, date) {
  return await model.appointmentDetails.findAll({
    raw: true,
    where: {
      [Sequelize.Op.and]: [
        { patient_ID: patient_ID },
        {
          [Sequelize.Op.or]: [
            { appointment_status: "Confirmed" },
            { appointment_status: "Pending" },
          ],
        },
      ],
    },
    include: [
      {
        model: model.doctor_schedule_table,
        where: {
          doctor_schedule_date: date,
        },
      },
    ],
  });
};
