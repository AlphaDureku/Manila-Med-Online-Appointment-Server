const sendResponse = require("../utils/sendResponse");
const Doctor = require("../Models/database_query/doctor_queries");

exports.searchDoctor = async (req, res) => {
  try {
    let searchOption = {
      Fname: req.query.Fname,
      Lname: req.query.Lname,
      Specialization: req.query.specialization,
      doctor_HMO: req.query.HMO,
    };
    if (
      !searchOption.Fname &&
      !searchOption.Lname &&
      !searchOption.Specialization &&
      !searchOption.doctor_HMO
    ) {
      const result = await Doctor.getDoctor();
      const schedule = await Doctor.getSchedule();
      console.log(result);
      return sendResponse(res, 200, { result: result, schedule: schedule });

      //Using specs only
    } else if (
      !searchOption.Fname &&
      !searchOption.Lname &&
      searchOption.Specialization &&
      searchOption.doctor_HMO
    ) {
      console.log("get by spec and hmo");
      const result = await Doctor.getDoctor_Using_Spec_HMO(
        searchOption.Specialization,
        searchOption.doctor_HMO
      );
      const schedule = await Doctor.getSchedule_Using_Spec_HMO(
        searchOption.Specialization,
        searchOption.doctor_HMO
      );
      console.log(result);
      return sendResponse(res, 200, { result: result, schedule: schedule });
    } else if (
      !searchOption.Fname &&
      !searchOption.Lname &&
      searchOption.Specialization &&
      !searchOption.doctor_HMO
    ) {
      console.log("get by Spec only");
      const result = await Doctor.getDoctor_Using_SpecOnly(
        searchOption.Specialization
      );
      const schedule = await Doctor.getSchedule_Using_SpecOnly(
        searchOption.Specialization
      );
      return sendResponse(res, 200, { result: result, schedule: schedule });
    } else if (
      !searchOption.Fname &&
      !searchOption.Lname &&
      !searchOption.Specialization &&
      searchOption.doctor_HMO
    ) {
      console.log("get by HMO only");
      const result = await Doctor.getDoctor_Using_hmoOnly(
        searchOption.doctor_HMO
      );
      const schedule = await Doctor.getSchedule_Using_hmoOnly(
        searchOption.doctor_HMO
      );
      return sendResponse(res, 200, { result: result, schedule: schedule });
    } else if (
      (searchOption.Fname != undefined || searchOption.Lname != undefined) &&
      (searchOption.Specialization || searchOption.doctor_HMO)
    ) {
      console.log("get by Name, spec and sub_spec");
      const result = await Doctor.getDoctor_Using_All(searchOption);
      const schedule = await Doctor.getSchedule_Using_All(searchOption);
      return sendResponse(res, 200, { result: result, schedule: schedule });
    } else if (searchOption.Fname && searchOption.Lname) {
      console.log("get by Fname Lname");
      const result = await Doctor.getDoctor_Using_Fname_Lname(
        searchOption.Fname,
        searchOption.Lname
      );
      const schedule = await Doctor.getSchedule_Using_Fname_Lname(
        searchOption.Fname,
        searchOption.Lname
      );
      return sendResponse(res, 200, { result: result, schedule: schedule });
    } else if (searchOption.Lname) {
      console.log("get by LName");
      const result = await Doctor.getDoctor_Using_Lname(searchOption.Lname);
      const schedule = await Doctor.getSchedule_Using_Lname(searchOption.Lname);
      return sendResponse(res, 200, { result: result, schedule: schedule });
    } else if (searchOption.Fname) {
      const result = await Doctor.getDoctor_Using_Fname(searchOption.Fname);
      const schedule = await Doctor.getSchedule_Using_Fname(searchOption.Fname);
      return sendResponse(res, 200, { result: result, schedule: schedule });
    } else {
      console.log("Undefined");
    }
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message);
  }
};
