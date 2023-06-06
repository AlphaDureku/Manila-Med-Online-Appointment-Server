const Sequelize = require("sequelize");
const model = require("../models");

/! Doctor Attributes/;
const doctorAttributes = [
  "doctor_ID",
  "doctor_first_name",
  "doctor_last_name",
  "doctor_gender",
  "doctor_room",
  "doctor_contact_number",
  [Sequelize.fn("group_concat", Sequelize.col("HMO_Name")), "HMO_Name"],
  [Sequelize.col("specialization_Name"), "specialization"],
];

const doctorSchedAttributes = [
  "doctor_ID",
  [Sequelize.col("doctor_schedule_ID"), "schedule_ID"],
  [Sequelize.col("doctor_first_name"), "doctorFname"],
  [Sequelize.col("doctor_last_name"), "doctorLname"],
  [Sequelize.col("doctor_schedule_end_time"), "end"],
  [Sequelize.col("doctor_schedule_current_queue"), "queue"],
  [Sequelize.col("doctor_schedule_Interval"), "time_interval"],
  [Sequelize.col("specialization_Name"), "specialization"],
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
  [
    Sequelize.fn("date_format", Sequelize.col("doctor_schedule_date"), "%W"),
    "day",
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
      Sequelize.col("doctor_schedule_end_time"),
      "%h:%i%p"
    ),
    "end",
  ],
];

const doctorSchedInclude = [
  {
    model: model.doctor_schedule_table,
    required: true,
    attributes: [],
    where: [
      {
        doctor_schedule_status: "available",
      },
    ],
  },

  {
    model: model.doctor_specialization,
    attributes: [],
  },
];

const groupDoctorInfo = [
  "doctor_ID",
  "doctor_first_name",
  "doctor_last_name",
  "doctor_contact_number",
];

/! Doctor DB Queries/;
exports.getDoctor = async function () {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorAttributes,
    include: [
      {
        model: model.HMO,
        through: "doctor_HMO_JunctionTable",
      },
      {
        model: model.doctor_specialization,
        attributes: [],
      },
    ],
    group: groupDoctorInfo,
    order: [["doctor_last_name", "ASC"]],
  });
};

exports.getSchedule = async function () {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorSchedAttributes,
    include: doctorSchedInclude,
  });
};

// Queries for Fname
exports.getDoctor_Using_Fname = async function (Fname) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorAttributes,
    include: [
      {
        model: model.HMO,
        through: "doctor_HMO_JunctionTable",
        attributes: [],
      },
      {
        model: model.doctor_specialization,
      },
    ],
    order: [["doctor_last_name", "ASC"]],
    group: groupDoctorInfo,
    where: [
      {
        doctor_first_name: {
          [Sequelize.Op.like]: `%${Fname}%`,
        },
      },
    ],
  });
};
exports.getSchedule_Using_Fname = async function (Fname) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorSchedAttributes,

    include: doctorSchedInclude,
    where: [
      {
        doctor_first_name: {
          [Sequelize.Op.like]: `%${Fname}%`,
        },
      },
    ],
  });
};

// Queries for Lname
exports.getDoctor_Using_Lname = async function (Lname) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorAttributes,
    include: [
      {
        model: model.HMO,
        through: "doctor_HMO_JunctionTable",
        attributes: [],
      },
      {
        model: model.doctor_specialization,
      },
    ],
    order: [["doctor_last_name", "ASC"]],
    group: groupDoctorInfo,
    where: [
      {
        doctor_last_name: {
          [Sequelize.Op.like]: `%${Lname}%`,
        },
      },
    ],
  });
};
exports.getSchedule_Using_Lname = async function (Lname) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorSchedAttributes,
    include: doctorSchedInclude,
    where: [
      {
        doctor_last_name: {
          [Sequelize.Op.like]: `%${Lname}%`,
        },
      },
    ],
  });
};

// Queries for Fname && Lname
exports.getDoctor_Using_Fname_Lname = async function (Fname, Lname) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorAttributes,
    include: [
      {
        model: model.HMO,
        through: "doctor_HMO_JunctionTable",
        attributes: [],
      },
      {
        model: model.doctor_specialization,
      },
    ],
    order: [["doctor_last_name", "ASC"]],
    group: groupDoctorInfo,
    where: [
      {
        [Sequelize.Op.and]: [
          {
            doctor_first_name: {
              [Sequelize.Op.like]: `%${Fname}%`,
            },
            doctor_last_name: {
              [Sequelize.Op.like]: `%${Lname}%`,
            },
          },
        ],
      },
    ],
  });
};

exports.getSchedule_Using_Fname_Lname = async function (Fname, Lname) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorSchedAttributes,
    include: doctorSchedInclude,
    where: [
      {
        [Sequelize.Op.and]: [
          {
            doctor_first_name: {
              [Sequelize.Op.like]: `%${Fname}%`,
            },
            doctor_last_name: {
              [Sequelize.Op.like]: `%${Lname}%`,
            },
          },
        ],
      },
    ],
  });
};

exports.getDoctor_Using_SpecOnly = async function (specialization) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorAttributes,
    include: [
      {
        model: model.HMO,
        attributes: [],
        where: [
          {
            "$doctor.doctorSpecializationSpecializationID$": specialization,
          },
        ],
      },
      {
        model: model.doctor_specialization,
      },
    ],

    order: [["doctor_last_name", "ASC"]],
    group: groupDoctorInfo,
  });
};

exports.getSchedule_Using_SpecOnly = async function (specialization, HMO) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorSchedAttributes,

    include: [
      {
        model: model.HMO,
        attributes: [],
        where: [
          {
            "$doctor.doctorSpecializationSpecializationID$": specialization,
          },
        ],
      },
    ],

    include: doctorSchedInclude,
  });
};

exports.getDoctor_Using_hmoOnly = async function (HMO) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorAttributes,
    include: [
      {
        model: model.HMO,
        attributes: [],
        where: { HMO_ID: HMO },
      },
      {
        model: model.doctor_specialization,
      },
    ],

    order: [["doctor_last_name", "ASC"]],
    group: groupDoctorInfo,
  });
};

exports.getSchedule_Using_hmoOnly = async function (specialization, HMO) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorSchedAttributes,

    include: [
      {
        model: model.HMO,
        attributes: [],
        where: { HMO_ID: HMO },
      },
    ],

    include: doctorSchedInclude,
  });
};
exports.getDoctor_Using_Spec_HMO = async function (specialization, HMO) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorAttributes,
    include: [
      {
        model: model.HMO,
        attributes: [],
        where: [
          {
            [Sequelize.Op.and]: [
              { HMO_ID: HMO },
              {
                "$doctor.doctorSpecializationSpecializationID$": specialization,
              },
            ],
          },
        ],
      },
      {
        model: model.doctor_specialization,
      },
    ],

    order: [["doctor_last_name", "ASC"]],
    group: groupDoctorInfo,
  });
};

exports.getSchedule_Using_Spec_HMO = async function (specialization, HMO) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorSchedAttributes,

    include: [
      {
        model: model.HMO,
        attributes: [],
        where: [
          {
            [Sequelize.Op.or]: [
              { HMO_ID: HMO },
              {
                "$doctor.doctorSpecializationSpecializationID$": specialization,
              },
            ],
          },
        ],
      },
    ],

    include: doctorSchedInclude,
  });
};

exports.getDoctor_Using_All = async function (searchOption) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorAttributes,
    include: [
      {
        model: model.HMO,
        where: [
          {
            [Sequelize.Op.or]: [
              { HMO_ID: searchOption.doctor_HMO },
              {
                "$doctor.doctorSpecializationSpecializationID$":
                  searchOption.Specialization,
              },
            ],
          },
        ],
      },
      {
        model: model.doctor_specialization,
      },
    ],
    order: [["doctor_last_name", "ASC"]],
    group: groupDoctorInfo,

    where: [
      {
        [Sequelize.Op.and]: [
          {
            doctor_first_name: {
              [Sequelize.Op.like]: `%${searchOption.Fname}%`,
            },
            doctor_last_name: {
              [Sequelize.Op.like]: `%${searchOption.Lname}%`,
            },
          },
        ],
      },
    ],
  });
};

exports.getSchedule_Using_All = async function (searchOption) {
  console.log(searchOption);
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorSchedAttributes,
    include: [
      {
        model: model.HMO,
        where: [
          {
            [Sequelize.Op.or]: [
              { HMO_ID: searchOption.doctor_HMO },
              {
                "$doctor.doctorSpecializationSpecializationID$":
                  searchOption.Specialization,
              },
            ],
          },
        ],
      },
    ],
    include: doctorSchedInclude,
    where: [
      {
        [Sequelize.Op.and]: [
          {
            doctor_first_name: {
              [Sequelize.Op.like]: `%${searchOption.Fname}%`,
            },
            doctor_last_name: {
              [Sequelize.Op.like]: `%${searchOption.Lname}%`,
            },
          },
        ],
      },
    ],
  });
};

exports.getOneDoctorCalendar = async function (doctor_ID) {
  return await model.doctor.findAll({
    raw: true,
    attributes: [
      "doctor_ID",
      [
        Sequelize.fn(
          "date_format",
          Sequelize.col("doctor_schedule_date"),
          "%Y-%m-%d"
        ),
        "date",
      ],
      [Sequelize.col("doctor_schedule_ID"), "schedule_ID"],
      [Sequelize.col("doctor_schedule_start_time"), "start"],
      [Sequelize.col("doctor_schedule_end_time"), "end"],
      [Sequelize.col("doctor_schedule_current_queue"), "queue"],
      [Sequelize.col("doctor_schedule_Interval"), "time_interval"],
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

exports.getQueueInstance = async function (doctor_schedule_ID) {
  const instance = await model.doctor_schedule_table.findByPk(
    doctor_schedule_ID
  );
  return await instance.get("doctor_schedule_current_queue");
};

exports.incrementQueue = async function (doctor_schedule_ID) {
  await model.doctor_schedule_table.increment("doctor_schedule_current_queue", {
    returning: true,
    by: 1,
    where: { doctor_schedule_ID: doctor_schedule_ID },
  });
  await model.doctor_schedule_table.update(
    {
      doctor_schedule_status: "Unavailable",
    },
    {
      where: {
        doctor_schedule_ID: doctor_schedule_ID,
        doctor_schedule_max_patient: {
          [Sequelize.Op.lt]: Sequelize.col("doctor_schedule_current_queue"),
        },
      },
    }
  );
};

exports.getDoctorScheduleUsingID = async function (doctor_ID) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorSchedAttributes,
    include: doctorSchedInclude,
    where: {
      doctor_ID: doctor_ID,
    },
  });
};
