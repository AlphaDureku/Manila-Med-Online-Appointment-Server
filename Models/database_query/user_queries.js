const Sequelize = require("sequelize");
const model = require("../models");

//For Tracking
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
