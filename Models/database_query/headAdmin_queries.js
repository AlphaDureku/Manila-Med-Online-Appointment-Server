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
    attributes: ["head_Manager_Fname", "head_Manager_Lname"],
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
      ["createdAt", "date_added"],
    ],
    where: {
      doctorSecretaryDoctorSecretaryID: null,
    },
    order: [["createdAt", "asc"]],
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
    order: [["createdAt", "asc"]],
  });
};

exports.getNurses = async function () {
  return await model.doctor_Secretary.findAll({
    raw: true,
    order: [["createdAt", "asc"]],
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
