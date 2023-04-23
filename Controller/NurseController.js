const sendResponse = require("../utils/sendResponse");
const sendEmail = require("../utils/sendEmail");

exports.setNurseSession = async (req, res) => {
  try {
    const nurseId = req.body.nurseId;
    const sessionId = req.body.sessionId;
    const nurse = await Nurse.findOne({ _id: nurseId });
    if (!nurse) {
      return sendResponse(res, 404, "Nurse not found");
    }
    nurse.session = sessionId;
    await nurse.save();
    return sendResponse(res, 200, "Nurse session set");
  } catch (err) {
    return sendResponse(res, 500, err.message);
  }
};
