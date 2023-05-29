const HeadAdmin = require("../Models/database_query/headAdmin_queries");
const sendResponse = require("../utils/sendResponse");
const Initialize = require("../Models/database_query/intialize_queries");
const uuid = require("uuid");
const { hashSomething, unHashSomething } = require("../utils/Bcrypt");
const { upperCaseFirstLetter } = require("../utils/collectionOfFunctions");
const { sendEmailSecretary } = require("../utils/sendEmail");
const {
  findNurseUsingEmail,
  findNurseUsingUsername,
} = require("../Models/database_query/nurse_queries");
const {
  authorizedUsingCookie,
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} = require("../utils/JWTHandler");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await HeadAdmin.findHeadAdmin(username);
    if (!result) {
      return sendResponse(res, 200, false);
    }
    if (await unHashSomething(password, result.head_Manager_password)) {
      const head_Manager_ID = result.head_Manager_ID;
      const token = await createAccessToken({ head_Manager_ID });
      sendRefreshToken(
        res,
        await createRefreshToken({ head_Manager_ID }),
        "head_ID"
      );
      return sendResponse(res, 200, { status: true, token: token });
    } else {
      return sendResponse(res, 200, { status: false });
    }
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.dashboard = async (req, res) => {
  const token = req.cookies.head_ID;
  if ((await authorizedUsingCookie(res, token, "head_ID")).authorized) {
    const { head_Manager_ID } = req.data;
    try {
      const AdminInfo = await HeadAdmin.getHeadAdmin(head_Manager_ID);
      const DoctorsWithoutNurses = await HeadAdmin.getDoctorsWithoutNurse();
      const DoctorsWithNurses = await HeadAdmin.getDoctorsWithNurse();
      const HmoLists = await Initialize.setup_HMO();
      const SpecializationList = await Initialize.setup_Specialization();
      const Nurses = await HeadAdmin.getNurses();
      return sendResponse(res, 200, {
        AdminInfo: AdminInfo,
        DoctorsWithNurses: DoctorsWithNurses,
        DoctorsWithoutNurses: DoctorsWithoutNurses,
        NurseLists: Nurses,
        HmoLists: HmoLists,
        SpecializationList: SpecializationList,
      });
    } catch (error) {
      console.log(error);
      return sendResponse(res, 500, error.message);
    }
  }
  return sendResponse(res, 402, "Unathorized");
};

exports.addDoctor = async (req, res) => {
  try {
    const { Fname, Lname, gender, email, contact, specialization_ID, hmo_ID } =
      req.body;
    const result = await HeadAdmin.findOneDoctor(email);
    if (result) {
      return sendResponse(res, 200, {
        status: false,
        message: "email already in use",
      });
    }
    let doctorModel = {
      doctor_ID: "MCM-" + uuid.v4(),
      doctor_first_name: upperCaseFirstLetter(Fname),
      doctor_last_name: upperCaseFirstLetter(Lname),
      doctor_email: email,
      doctor_gender: gender,
      doctor_contact_number: contact,
      doctorSpecializationSpecializationID: specialization_ID,
    };
    await HeadAdmin.addDoctor(doctorModel, hmo_ID);
    sendResponse(res, 200, true);
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    await HeadAdmin.removeDoctor(req.body.doctor_ID);
    return sendResponse(res, 200, "success");
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};
exports.addNurse = async (req, res) => {
  try {
    const { username, password, Fname, Lname, email, contact_number } =
      req.body;
    const nurse_Username = await findNurseUsingUsername(username);
    const nurse_Email = await findNurseUsingEmail(email);
    if (nurse_Username) {
      return sendResponse(res, 200, {
        status: false,
        message: "username already in use",
      });
    } else if (nurse_Email) {
      return sendResponse(res, 200, {
        status: false,
        message: "email already in use",
      });
    }
    const nurseModel = {
      doctor_Secretary_ID: "NURSE-" + uuid.v4(),
      doctor_Secretary_username: username,
      doctor_Secretary_password: await hashSomething(password),
      doctor_Secretary_email: email,
      doctor_Secretary_contact_number: contact_number,
      doctor_Secretary_first_name: upperCaseFirstLetter(Fname),
      doctor_Secretary_last_name: upperCaseFirstLetter(Lname),
    };
    sendEmailSecretary(email, { username: username, password: password });
    await HeadAdmin.addNurse(nurseModel);
    sendResponse(res, 200, true);
  } catch (error) {
    console.log(error);
    sendResponse(res, 400, error.message);
  }
};

exports.nurseDetails = async (req, res) => {
  try {
    const result = await HeadAdmin.NurseDetails(req.query.nurse_ID);
    return sendResponse(res, 200, result);
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};
exports.checkNurseBinding = async (req, res) => {
  try {
    const result = await HeadAdmin.nurseBindings(req.query.nurse_ID);
    return sendResponse(res, 200, result);
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};
exports.removeNurse = async (req, res) => {
  try {
    await HeadAdmin.removeNurse(req.body.nurse_ID);
    return sendResponse(res, 200, "success");
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.removeBind = async (req, res) => {
  try {
    await HeadAdmin.removeBind(req.body.doctor_ID);
    return sendResponse(res, 200, "success");
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.updateNurse = async (req, res) => {
  const { NurseModel } = req.body;
  try {
    const duplicateUserName = await findNurseUsingUsername(
      NurseModel.nurse_Username
    );
    const duplicateEmail = await findNurseUsingEmail(NurseModel.nurse_Email);
    console.log(duplicateEmail);
    if (!duplicateUserName && !duplicateEmail) {
      await HeadAdmin.updateNurse(NurseModel);
      return sendResponse(res, 200, {
        duplicate: "",
        message: "successfully edited",
      });
    } else if (duplicateEmail) {
      return sendResponse(res, 200, {
        duplicate: "email",
        messasge: "edit failed",
      });
    } else {
      return sendResponse(res, 200, {
        duplicate: "username",
        messasge: "edit failed",
      });
    }
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.matchDoctorNurse = async (req, res) => {
  const { doctor_ID, nurse_ID } = req.body;
  try {
    await HeadAdmin.matchDoctorNurse(doctor_ID, nurse_ID);
    sendResponse(res, 200, true);
  } catch (error) {
    console.log(error.message);
    sendResponse(res, 400, error.message);
  }
};

exports.headDetails = async (req, res) => {
  try {
    const result = await HeadAdmin.AdminDetails(req.query.head_ID);
    return sendResponse(res, 200, result);
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};

exports.updateHead = async (req, res) => {
  try {
    result = await HeadAdmin.updateHead(req.body.headModel);

    console.log(req.body.headModel);
    return sendResponse(res, 200, "success");
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};
