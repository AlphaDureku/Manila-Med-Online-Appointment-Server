const sendResponse = require("../utils/sendResponse");
const Doctor = require("../Models/database_query/doctor_queries");
const Initialize = require("../Models/database_query/intialize_queries");

exports.api = async (req, res) => {
  try {
    let result = await Doctor.getDoctor();
    return sendResponse(res, 200, result);
  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};

exports.initialize = async (req, res) => {
  try {
    const specialization = await Initialize.setup_Specialization();
    const hmo = await Initialize.setup_HMO();
    return sendResponse(res, 200, { specialization: specialization, hmo: hmo });
  } catch (error) {
    return sendResponse(res, 500, error.message);
  }
};
