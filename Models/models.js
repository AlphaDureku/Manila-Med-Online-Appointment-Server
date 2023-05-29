require("dotenv").config();
const Sequelize = require("sequelize");
const { DataTypes } = Sequelize;

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE,
  process.env.MYSQLUSER,
  process.env.MYSQLPASSWORD,
  {
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    dialect: "mysql",
    define: {
      freezeTableName: true,
      timestamps: false,
    },
  }
);

const Head_Manager = sequelize.define("head_Manager", {
  head_Manager_ID: {
    type: DataTypes.STRING(50),
    primaryKey: true,
  },
  head_Manager_Fname: {
    type: DataTypes.STRING,
  },
  head_Manager_Lname: {
    type: DataTypes.STRING,
  },
  head_Manager_username: {
    type: DataTypes.STRING,
  },
  head_Manager_email: {
    type: DataTypes.STRING,
  },
  head_Manager_password: {
    type: DataTypes.STRING,
  },
});

const User = sequelize.define("user", {
  user_ID: {
    type: DataTypes.STRING(50),
    primaryKey: true,
  },
  user_email: {
    type: DataTypes.STRING,
  },
  user_contact_number: {
    type: DataTypes.STRING,
  },
  user_OTP: {
    type: DataTypes.INTEGER,
  },
});

const Patient = sequelize.define("patient", {
  patient_ID: {
    type: DataTypes.STRING(50),
    primaryKey: true,
  },
  user_ID: {
    type: DataTypes.STRING(50),
  },
  patient_first_name: {
    type: DataTypes.STRING,
  },
  patient_middle_name: {
    type: DataTypes.STRING,
  },
  patient_last_name: {
    type: DataTypes.STRING,
  },
  patient_contact_number: {
    type: DataTypes.STRING,
  },
  patient_dateOfBirth: {
    type: DataTypes.DATE,
  },
  patient_gender: {
    type: DataTypes.STRING(1),
  },
  patient_address: {
    type: DataTypes.STRING,
  },
});

const Doctor = sequelize.define("doctor", {
  doctor_ID: {
    type: DataTypes.STRING(50),
    primaryKey: true,
  },
  doctor_email: {
    type: DataTypes.STRING,
  },
  doctor_first_name: {
    type: DataTypes.STRING,
  },
  doctor_last_name: {
    type: DataTypes.STRING,
  },
  doctor_gender: {
    type: DataTypes.STRING,
  },
  doctor_contact_number: {
    type: DataTypes.STRING,
  },
  doctor_dateOfBirth: {
    type: DataTypes.DATE,
  },
  doctor_room: {
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn("NOW"),
  },
});

const Doctor_department = sequelize.define("department", {
  department_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  department_Name: {
    type: DataTypes.STRING,
  },
});

const Doctor_HMO = sequelize.define("HMO", {
  HMO_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  HMO_Name: {
    type: DataTypes.STRING,
  },
});

const Doctor_specialization = sequelize.define("doctor_specialization", {
  specialization_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  specialization_Name: {
    type: DataTypes.STRING,
  },
});

const Doctor_Secretary = sequelize.define("doctor_Secretary", {
  doctor_Secretary_ID: {
    type: DataTypes.STRING(50),
    primaryKey: true,
  },
  doctor_Secretary_username: {
    type: DataTypes.STRING,
  },
  doctor_Secretary_password: {
    type: DataTypes.STRING,
  },
  doctor_Secretary_first_name: {
    type: DataTypes.STRING,
  },
  doctor_Secretary_middle_name: {
    type: DataTypes.STRING,
  },
  doctor_Secretary_last_name: {
    type: DataTypes.STRING,
  },
  doctor_Secretary_email: {
    type: DataTypes.STRING,
  },
  doctor_Secretary_contact_number: {
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn("NOW"),
  },
});

const AppointmentDetails = sequelize.define(
  "appointmentDetails",
  {
    appointment_ID: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    patient_ID: {
      type: DataTypes.STRING(50),
    },
    doctor_schedule_ID: {
      type: DataTypes.STRING(50),
    },
    doctor_ID: {
      type: DataTypes.STRING,
    },
    appointment_queue: {
      type: DataTypes.INTEGER,
    },
    appointment_start: {
      type: DataTypes.TIME,
    },
    appointment_type: {
      type: Sequelize.ENUM,
      values: ["Clinic", "Outpatient"],
    },
    doctor_gender: {
      type: DataTypes.STRING(1),
    },
    appointment_status: {
      type: Sequelize.ENUM,
      values: ["Pending", "Confirmed", "Rejected", "Cancelled", "Completed"],
      defaultValue: "Pending",
    },
    note: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

const Doctor_schedule_table = sequelize.define("doctor_schedule_table", {
  doctor_schedule_ID: {
    type: DataTypes.STRING(50),
    primaryKey: true,
  },
  doctor_ID: {
    type: DataTypes.STRING(50),
  },
  doctor_schedule_date: {
    type: DataTypes.DATEONLY,
  },
  doctor_schedule_start_time: {
    type: DataTypes.TIME,
  },
  doctor_schedule_end_time: {
    type: DataTypes.TIME,
  },
  doctor_schedule_max_patient: {
    type: DataTypes.INTEGER,
  },
  doctor_schedule_current_queue: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  doctor_schedule_Interval: {
    type: DataTypes.TIME,
  },
  doctor_schedule_status: {
    type: Sequelize.ENUM,
    values: ["Available", "Unavailable"],
    defaultValue: "Available",
  },
});

//Table controller
async function syncAll() {
  await sequelize.sync({ force: true }).then(() => {
    console.log("success");
  });
}

async function clearTable(table) {
  try {
    await table.truncate();
    console.log("Cleared Successly");
  } catch (error) {
    console.log(error);
  }
}

Doctor.hasMany(Doctor_schedule_table, { foreignKey: "doctor_ID" });
Doctor_schedule_table.belongsTo(Doctor, { foreignKey: "doctor_ID" });
Doctor_Secretary.hasMany(Doctor);
Doctor.belongsTo(Doctor_Secretary);
Doctor.hasMany(AppointmentDetails, { foreignKey: "doctor_ID" });
AppointmentDetails.belongsTo(Doctor, { foreignKey: "doctor_ID" });
User.hasMany(Patient, { foreignKey: "user_ID" });
Patient.belongsTo(User, { foreignKey: "user_ID" });
Patient.hasMany(AppointmentDetails, { foreignKey: "patient_ID" });
AppointmentDetails.belongsTo(Patient, { foreignKey: "patient_ID" });
Doctor_schedule_table.hasOne(AppointmentDetails, {
  foreignKey: "doctor_schedule_ID",
});
AppointmentDetails.belongsTo(Doctor_schedule_table, {
  foreignKey: "doctor_schedule_ID",
});
Doctor_specialization.hasMany(Doctor);
Doctor.belongsTo(Doctor_specialization);

//Junction table
Doctor.belongsToMany(Doctor_department, {
  through: "doctor_department_JunctionTable",
});
Doctor_department.belongsToMany(Doctor, {
  through: "doctor_department_JunctionTable",
});
Doctor.belongsToMany(Doctor_HMO, { through: "doctor_HMO_JunctionTable" });
Doctor_HMO.belongsToMany(Doctor, { through: "doctor_HMO_JunctionTable" });

/*
let doctorModel = {
    firstName: "Kevin",
    lastName: "Cabrera",
    contact_number: "09984416526",
    department_IDs: [1, 2, 3]
}

async function setDoctor_Department(doctorModel) {
    const doctor = await Doctor.findByPk('MCM-10f3bf8c-f47b-40dc-a426-427dcbf817b4')
    const department = await Doctor_department.findByPk(1)
    await doctor.addDepartment(department)

}
setDoctor_Department(doctorModel)
*/

syncAll();

module.exports = sequelize.models;
