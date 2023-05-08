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
  const newUser = await model.user.create(userModel);
  return userModel;
};
