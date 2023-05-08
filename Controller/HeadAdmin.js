const HeadAdmin = require("../Models/database_query/headAdmin_queries");
const sendResponse = require("../utils/sendResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Initialize = require("../Models/database_query/intialize_queries");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await HeadAdmin.findHeadAdmin(username);
    if (!result) {
      return sendResponse(res, 200, false);
    }
    if (await bcrypt.compare(password, result.head_Manager_password)) {
      const head_Manager_ID = result.head_Manager_ID;
      const token = jwt.sign({ head_Manager_ID }, process.env.JWT_SECRET, {
        expiresIn: "10d",
      });
      return sendResponse(res, 200, { status: true, token: token });
    } else {
      return sendResponse(res, 200, false);
    }
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, error);
  }
};

exports.dashboard = async (req, res) => {
  const { head_Manager_ID } = req.data;
  try {
    const AdminInfo = await HeadAdmin.getHeadAdmin(head_Manager_ID);
    const DoctorsWithoutNurses = await HeadAdmin.getDoctorsWithoutNurse();
    const DoctorsWithNurses = await HeadAdmin.getDoctorsWithNurse();
    const HmoLists = await Initialize.setup_HMO();
    const SpecializationList = await Initialize.setup_Specialization();
    sendResponse(res, 200, {
      AdminInfo: AdminInfo,
      DoctorsWithNurses: DoctorsWithNurses,
      DoctorsWithoutNurses: DoctorsWithoutNurses,
      HmoLists: HmoLists,
      SpecializationList: SpecializationList,
    });
    return;
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, err);
  }
};
