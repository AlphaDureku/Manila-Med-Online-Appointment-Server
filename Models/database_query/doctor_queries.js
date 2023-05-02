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
  [
    Sequelize.fn(
      "date_format",
      Sequelize.col("doctor_schedule_date"),
      "%b %e, %Y"
    ),
    "date",
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
    where: {
      [Sequelize.Op.and]: [
        {
          doctor_schedule_status: "available",
        },
        {
          doctor_schedule_date: {
            [Sequelize.Op.gt]: new Date(),
          },
        },
      ],
    },
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
        attributes: [],
      },
      {
        model: model.doctor_specialization,
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

exports.getDoctor_Using_Spec_HMO = async function (specialization, HMO) {
  return await model.doctor.findAll({
    raw: true,
    attributes: doctorAttributes,

    include: [
      {
        model: model.HMO,
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
