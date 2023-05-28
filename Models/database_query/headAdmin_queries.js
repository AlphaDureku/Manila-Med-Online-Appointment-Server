const { hashSomething } = require("../../utils/Bcrypt");
const model = require("../models");
const Sequelize = require("sequelize");
exports.findHeadAdmin = async function (username) {
  return await model.head_Manager.findOne({
    raw: true,
    attributes: [
      "head_Manager_ID",
      "head_Manager_username",
      "head_Manager_password",
    ],
    where: {
      head_Manager_username: username,
    },
  });
};

exports.getHeadAdmin = async function (ID) {
  return await model.head_Manager.findOne({
    raw: true,
    attributes: [
      "head_Manager_ID",
      "head_Manager_username",
      "head_Manager_Fname",
      "head_Manager_Lname",
    ],
    where: {
      head_Manager_ID: ID,
    },
  });
};

exports.getDoctorsWithoutNurse = async function () {
  return await model.doctor.findAll({
    raw: true,
    attributes: [
      "doctor_ID",
      ["doctor_first_name", "DFname"],
      ["doctor_last_name", "DLname"],
    ],
    where: {
      doctorSecretaryDoctorSecretaryID: null,
    },
    order: [
      [
        Sequelize.literal("DATE_FORMAT(doctor.createdAt, '%Y-%m-%d %H:%i:%s')"),
        "DESC",
      ],
    ],
  });
};
exports.findOneDoctor = async function (email) {
  return await model.doctor.findOne({
    raw: true,
    where: {
      doctor_email: email,
    },
  });
};

exports.getDoctorsWithNurse = async function () {
  return await model.doctor.findAll({
    raw: true,
    attributes: [
      "doctor_ID",
      ["doctor_first_name", "DFname"],
      ["doctor_last_name", "DLname"],
      [Sequelize.col("doctor_Secretary_ID"), "nurse_ID"],
      [Sequelize.col("doctor_Secretary_first_name"), "nurse_Fname"],
      [Sequelize.col("doctor_Secretary_last_name"), "nurse_Lname"],
    ],
    include: [
      {
        model: model.doctor_Secretary,
        attributes: [],
      },
    ],
    where: {
      doctorSecretaryDoctorSecretaryID: {
        [Sequelize.Op.ne]: null,
      },
    },
    order: [
      [
        Sequelize.literal("DATE_FORMAT(doctor.createdAt, '%Y-%m-%d %H:%i:%s')"),
        "DESC",
      ],
    ],
  });
};

exports.getNurses = async function () {
  return await model.doctor_Secretary.findAll({
    raw: true,
    order: [
      [
        Sequelize.literal(
          "DATE_FORMAT(doctor_Secretary.createdAt, '%Y-%m-%d %H:%i:%s')"
        ),
        "DESC",
      ],
    ],
  });
};

exports.addDoctor = async function (doctorModel, hmo_ID) {
  const newDoctor = await model.doctor.create(doctorModel);
  for (let i = 0; i < hmo_ID.length; i++) {
    const HMO = await model.HMO.findByPk(hmo_ID[i]);
    await HMO.addDoctor(newDoctor);
  }
};

exports.removeDoctor = async function (doctor_ID) {
  await model.doctor.destroy({
    where: {
      doctor_ID: doctor_ID,
    },
  });
};

exports.addNurse = async function (nurseModel) {
  await model.doctor_Secretary.create(nurseModel);
};

exports.nurseBindings = async function (nurse_ID) {
  return await model.doctor.findAll({
    raw: true,
    attributes: [
      "doctor_ID",
      ["doctor_first_name", "DFname"],
      ["doctor_last_name", "DLname"],
    ],
    where: {
      doctorSecretaryDoctorSecretaryID: nurse_ID,
    },
  });
};

exports.removeNurse = async function (Nurse_ID) {
  await model.doctor_Secretary.destroy({
    where: {
      doctor_Secretary_ID: Nurse_ID,
    },
  });
};

exports.NurseDetails = async function (Nurse_ID) {
  return await model.doctor_Secretary.findOne({
    raw: true,
    attributes: [
      [Sequelize.col("doctor_Secretary_ID"), "nurse_ID"],
      [Sequelize.col("doctor_Secretary_username"), "nurse_Username"],
      [Sequelize.col("doctor_Secretary_first_name"), "nurse_Fname"],
      [Sequelize.col("doctor_Secretary_middle_name"), "nurse_Mname"],
      [Sequelize.col("doctor_Secretary_last_name"), "nurse_Lname"],
      [Sequelize.col("doctor_Secretary_email"), "nurse_Email"],
      [Sequelize.col("doctor_Secretary_contact_number"), "nurse_Contact"],
    ],

    where: {
      doctor_Secretary_ID: Nurse_ID,
    },
  });
};

exports.updateNurse = async function (NurseModel) {
  const updateData = {
    doctor_Secretary_username: NurseModel.nurse_Username,
    doctor_Secretary_first_name: NurseModel.nurse_Fname,
    doctor_Secretary_middle_name: NurseModel.nurse_Mname,
    doctor_Secretary_last_name: NurseModel.nurse_Lname,
    doctor_Secretary_email: NurseModel.nurse_Email,
    doctor_Secretary_contact_number: NurseModel.nurse_Contact,
  };

  if (NurseModel.nurse_NewPassword) {
    updateData.doctor_Secretary_password = await hashSomething(
      NurseModel.nurse_NewPassword
    );
  }

  await model.doctor_Secretary.update(updateData, {
    where: {
      doctor_Secretary_ID: NurseModel.nurse_ID,
    },
  });
};

exports.matchDoctorNurse = async function (doctor_ID, nurse_ID) {
  await model.doctor.update(
    {
      doctorSecretaryDoctorSecretaryID: nurse_ID,
    },
    {
      where: {
        doctor_ID: doctor_ID,
      },
    }
  );
};

exports.AdminDetails = async function (head_ID) {
  return await model.head_Manager.findOne({
    raw: true,
    attributes: [
      [Sequelize.col("head_Manager_ID"), "head_ID"],
      [Sequelize.col("head_Manager_Fname"), "head_Fname"],
      [Sequelize.col("head_Manager_Lname"), "head_Lname"],
      [Sequelize.col("head_Manager_username"), "head_Username"],
    ],

    where: {
      head_Manager_ID: head_ID,
    },
  });
};
exports.updateHead = async function (headModel) {
  const updateData = {
    head_Manager_username: headModel.head_Username,
    head_Manager_Fname: headModel.head_Fname,
    head_Manager_Lname: headModel.head_Lname,
    head_Manager_email: headModel.head_Email,
  };

  if (headModel.head_NewPassword) {
    updateData.head_Manager_password = await hashSomething(
      headModel.head_NewPassword
    );
  }

  return await model.head_Manager.update(updateData, {
    where: {
      head_Manager_ID: headModel.head_ID,
    },
  });
};

exports.removeBind = async function (doctorID) {
  await model.doctor.update(
    {
      doctorSecretaryDoctorSecretaryID: null,
    },
    {
      where: {
        doctor_ID: doctorID,
      },
    }
  );
};
