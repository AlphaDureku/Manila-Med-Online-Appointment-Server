const sendResponse = require("../utils/sendResponse");
const Doctor = require("../Models/database_query/doctor_queries");
const Initialize = require("../Models/database_query/intialize_queries");

exports.api = async (req, res) => {
  let result = await Doctor.getDoctor();
  sendResponse(res, 200, result);
};

exports.initialize = async (req, res) => {
  const specialization = await Initialize.setup_Specialization();
  const hmo = await Initialize.setup_HMO();
  sendResponse(res, 200, { specialization: specialization, hmo: hmo });
};
