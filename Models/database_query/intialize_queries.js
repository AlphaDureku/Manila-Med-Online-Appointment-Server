const Sequelize = require("sequelize");
const model = require("../models");

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
