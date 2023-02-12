const sendResponse = require("../utils/sendResponse");
const Doctor = require('../Models/database_query/doctor_queries')

exports.api = async (req, res) => {
    let result = await Doctor.getDoctor();
    sendResponse(res, 200, result)
}


