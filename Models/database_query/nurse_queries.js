const model = require("../models");
const Sequelize = require("sequelize");

const patient_age = Sequelize.fn(
  "TIMESTAMPDIFF",
  Sequelize.literal("YEAR"),
  Sequelize.literal("patient_dateOfBirth"),
  Sequelize.fn("NOW")
);

exports.findNurse = async function (username) {
  return await model.doctor_Secretary.findOne({
    raw: true,
    where: {
      doctor_Secretary_username: username,
    },
  });
};

exports.findNurseUsingID = async function (sec_ID) {
  return await model.doctor_Secretary.findOne({
    raw: true,
    attributes: [
      "doctor_Secretary_first_name",
      "doctor_Secretary_middle_name",
      "doctor_Secretary_last_name",
    ],
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
        attributes: [],
        model: model.doctor_Secretary,
        where: {
          doctor_Secretary_ID: sec_ID,
        },
      },
    ],
  });
};

exports.getSelectedDoctorAppointments = async function (
  doctor_ID,
  DateRange,
  nameQuery
) {
  return await model.appointmentDetails.findAll({
    raw: true,
    attributes: [
      "patient_ID",
      "appointment_ID",
      [Sequelize.col("patient_first_name"), "Fname"],
      [Sequelize.col("patient_last_name"), "Lname"],
      [Sequelize.col("patient_contact_number"), "Contact"],
      [Sequelize.col("appointment_status"), "Status"],
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
        where: nameQuery
          ? [
              {
                [Sequelize.Op.or]: [
                  {
                    patient_first_name: {
                      [Sequelize.Op.like]: `%${nameQuery}%`,
                    },
                  },
                  {
                    patient_last_name: {
                      [Sequelize.Op.like]: `%${nameQuery}%`,
                    },
                  },
                ],
              },
            ]
          : null,
      },
      {
        model: model.doctor_schedule_table,
        attributes: [],
      },
    ],
    where: [
      {
        doctor_ID: doctor_ID,
        createdAt: {
          [Sequelize.Op.between]: [DateRange.start, DateRange.end],
        },
      },
    ],
  });
};

exports.getDoctorCalendar = async function (doctor_ID) {
  return await model.doctor.findAll({
    raw: true,
    attributes: [
      "doctor_ID",
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_date"),
          "%b %e, %Y"
        ),
        "date",
      ],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_date"),
          "%Y-%m-%d"
        ),
        "date2",
      ],
      [Sequelize.col("doctor_schedule_start_time"), "start"],
      [Sequelize.col("doctor_schedule_end_time"), "end"],
    ],
    include: [
      {
        model: model.doctor_schedule_table,
        required: true,
        attributes: [],
      },
    ],
    where: { doctor_ID: doctor_ID },
  });
};

exports.updateAppointmentStatus = async function (
  updateStatus,
  appointment_ID
) {
  await model.appointmentDetails.update(
    {
      appointment_status: updateStatus,
    },
    {
      where: {
        appointment_ID: appointment_ID,
      },
    }
  );
};

exports.getAppointmentsThatDate = async function (doctor_ID, date) {
  return await model.appointmentDetails.findAll({
    raw: true,
    attributes: [
      "appointment_ID",
      "patient_ID",
      [Sequelize.col("patient_first_name"), "patient_Fname"],
      [Sequelize.col("patient_last_name"), "patient_Lname"],
      [Sequelize.col("patient_contact_number"), "contact"],
      [Sequelize.col("appointment_queue"), "queue"],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_date"),
          "%m/%d/%Y"
        ),
        "appointmentDate",
      ],
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("appointment_start"),
          "%h:%i%p"
        ),
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
    ],
    include: [
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
      {
        model: model.patient,
        attributes: [],
        include: [
          {
            model: model.user,
            attributes: [],
          },
        ],
      },
      {
        model: model.doctor_schedule_table,
        attributes: [],
        where: {
          doctor_schedule_date: date,
        },
      },
    ],
    where: {
      doctor_ID: doctor_ID,
      appointment_status: "Confirmed",
    },
  });
};

//Still havent implemented yet

exports.getContactUsingApp_ID = async function (ID) {
  return await model.appointmentDetails.findOne({
    raw: true,
    attributes: [[Sequelize.col("patient_contact_number"), "Contact"]],
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
      [Sequelize.col("patient_contact_number"), "Contact"],
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

// exports.fetchDoctorPatientAppointments = async function (
//   doctor_ID,
//   startOfWhat,
//   endOfWhat
// ) {
//   return await model.appointmentDetails.findAll({
//     raw: true,
//     attributes: [
//       "appointment_ID",
//       "patient_ID",
//       [Sequelize.col("patient_first_name"), "patient_Fname"],
//       [Sequelize.col("patient_last_name"), "patient_Lname"],
//       [Sequelize.col("patient_gender"), "gender"],
//       [patient_age, "age"],
//       [Sequelize.col("patient_contact_number"), "contact"],
//       [Sequelize.col("user_email"), "email"],
//       [Sequelize.col("doctor_first_name"), "doctor_Fname"],
//       [Sequelize.col("doctor_last_name"), "doctor_Lname"],
//       [Sequelize.col("doctor_first_name"), "doctor_Fname"],
//       [Sequelize.col("specialization_Name"), "specialization"],
//       [
//         Sequelize.fn(
//           "date_format",
//           Sequelize.col("appointment_start"),
//           "%h:%i%p"
//         ),
//         "start",
//       ],
//       [
//         Sequelize.fn(
//           "date_format",
//           Sequelize.col("doctor_schedule_end_time"),
//           "%h:%i%p"
//         ),
//         "end",
//       ],
//       [
//         Sequelize.fn(
//           "date_format",
//           Sequelize.col("doctor_schedule_date"),
//           "%M %e, %Y"
//         ),
//         "modalDate",
//       ],
//       [
//         Sequelize.fn(
//           "date_format",
//           Sequelize.col("doctor_schedule_date"),
//           "%m/%d/%Y"
//         ),
//         "appointmentDate",
//       ],
//       ["appointment_status", "status"],
//     ],
//     include: [
//       {
//         model: model.doctor,
//         attributes: [],
//         include: [
//           {
//             model: model.doctor_specialization,
//             attributes: [],
//           },
//         ],
//       },
//       {
//         model: model.patient,
//         attributes: [],
//         required: true,
//         include: [
//           {
//             model: model.user,
//             attributes: [],
//           },
//         ],
//       },
//       {
//         model: model.doctor_schedule_table,
//         attributes: [],
//       },
//     ],
//     where: {
//       doctor_ID: doctor_ID,
//       createdAt: {
//         [Sequelize.Op.between]: [startOfWhat, endOfWhat],
//       },
//     },
//   });
// };
