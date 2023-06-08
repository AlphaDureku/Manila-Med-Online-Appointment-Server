const Sequelize = require("sequelize");
const model = require("../models");
const { hashSomething } = require("../../utils/Bcrypt");
const uuid = require("uuid");
exports.setup_HMO = async function () {
  return await model.HMO.findAll({
    raw: true,
    attributes: ["HMO_ID", "HMO_Name"],
    order: [["HMO_Name", "ASC"]],
  });
};

exports.setup_Specialization = async function () {
  return await model.doctor_specialization.findAll({
    raw: true,
    attributes: ["specialization_ID", "specialization_Name"],
    order: [["specialization_Name", "ASC"]],
  });
};

exports.insertHeadManager = async function () {
  admin = {
    head_Manager_ID: "HA-" + uuid.v4(),
    head_Manager_Fname: "Admin",
    head_Manager_Lname: "Admin",
    head_Manager_username: "admin",
    head_Manager_email: "markfetero@gmail.com",
    head_Manager_password: await hashSomething("admin"),
  };
  return model.head_Manager.create(admin);
};

exports.insertHmoList = async function (HMO_list) {
  return await model.HMO.bulkCreate(HMO_list);
};

exports.insertSpecializationList = async function (specialization_List) {
  return await model.doctor_specialization.bulkCreate(specialization_List);
};

exports.insertNurseList = async function (NurseList) {
  await model.doctor_Secretary.bulkCreate(NurseList);
};
