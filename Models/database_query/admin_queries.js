const model = require("../sequelize_sequelizeModel");
const Sequelize = require("sequelize");

exports.findAdmin = async function (username) {
  return await model.doctor_Secretary.findOne({
    raw: true,
    where: {
      doctor_Secretary_username: username,
    },
  });
};

exports.findAdminUsingID = async function (sec_ID) {
  return await model.doctor_Secretary.findOne({
    raw: true,
    where: {
      doctor_Secretary_ID: sec_ID,
    },
  });
};

exports.findDoctors = async function (sec_ID) {
  return await model.doctor.findAll({
    raw: true,
    attributes: ["doctor_ID", "doctor_first_name", "doctor_last_name"],
    include: [
      {
        model: model.doctor_Secretary,
        where: {
          doctor_Secretary_ID: sec_ID,
        },
      },
    ],
  });
};
exports.updateAppointment = async function (params) {
  await model.appointmentDetails.update(
    {
      appointment_status: params.status,
    },
    {
      where: {
        appointment_ID: params.ID,
      },
    }
  );
};

exports.getContactUsingApp_ID = async function (ID) {
  return await model.appointmentDetails.findOne({
    raw: true,
    attributes: [[Sequelize.col("patient_contact_number"), "contact"]],
    include: [
      {
        model: model.patient,
        attributes: [],
      },
    ],
    where: {
      appointment_ID: ID,
    },
  });
};
exports.updateProfile = async function (params) {
  await model.doctor_Secretary.update(
    {
      doctor_Secretary_first_name: params.Fname,
      doctor_Secretary_middle_name: params.Mname,
      doctor_Secretary_last_name: params.Lname,
    },
    {
      where: {
        doctor_Secretary_ID: params.ID,
      },
    }
  );
};
exports.updatePassword = async function (params) {
  console.log(params.password);
  await model.doctor_Secretary.update(
    {
      doctor_Secretary_password: params.password,
    },
    {
      where: {
        doctor_Secretary_ID: params.doctor_Secretary_ID,
      },
    }
  );
};

exports.getAppointmentsToday = async function (ID, date) {
  return await model.appointmentDetails.findAll({
    raw: true,
    attributes: [
      [Sequelize.col("patient_first_name"), "Fname"],
      [Sequelize.col("patient_last_name"), "Lname"],
      [Sequelize.col("patient_contact_number"), "contact"],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_date"),
          "%M %e, %Y"
        ),
        "appointmentDate",
      ],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_start_time"),
          "%h:%i%p"
        ),
        "start",
      ],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_start_time"),
          "%h:%i%p"
        ),
        "end",
      ],
    ],

    include: [
      {
        model: model.patient,
        attributes: [],
      },
      {
        model: model.doctor_schedule_table,
        attributes: [],
        where: {
          doctor_schedule_date: date,
        },
      },
    ],
    where: [
      {
        doctor_ID: ID,
        appointment_status: "Confirmed",
      },
    ],
  });
};

exports.get_SetAppointment = async function (date, doctor_ID) {
  return await model.doctor_schedule_table.findOne({
    raw: true,
    where: {
      doctor_ID: doctor_ID,
      doctor_schedule_date: date,
    },
  });
};
