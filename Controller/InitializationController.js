const sendResponse = require("../utils/sendResponse");
const Doctor = require("../Models/database_query/doctor_queries");
const uuid = require("uuid");
const Initialize = require("../Models/database_query/intialize_queries");
const { HMOData } = require("../assets/HMOData");
const { SpecializationData } = require("../assets/SpecializationData");
const { DoctorsData } = require("../assets/DoctorsData");
const { NurseData } = require("../assets/NurseData");
const { AvailData } = require("../assets/AvailData");
const {
  addDoctor,
  matchDoctorNurse,
} = require("../Models/database_query/headAdmin_queries");
const {
  insertDoctorAvailability,
} = require("../Models/database_query/nurse_queries");

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

exports.InsertAllPreMadeDataSet = async (req, res) => {
  try {
    const resultHead = await Initialize.insertHeadManager();
    const resultHMO = await Initialize.insertHmoList(HMOData);
    const resultSpec = await Initialize.insertSpecializationList(
      SpecializationData
    );
    DoctorsData.forEach((data) => {
      const resultDoctor = addDoctor(data, data.hmoID);
    });
    const resultNurse = await Initialize.insertNurseList(NurseData);
    for (let i = 0; i < 99; i++) {
      console.log(NurseData[i]);
      const resultBind = await matchDoctorNurse(
        DoctorsData[i].doctor_ID,
        NurseData[i].doctor_Secretary_ID
      );
    }

    for (let i = 0; i < 1000; i++) {
      const randomAvail = Math.floor(Math.random() * 99);
      const randomDoctor = Math.floor(Math.random() * 100);
      const availObject = {
        doctor_schedule_ID: "SCHED-" + uuid.v4(),
        doctor_ID: DoctorsData[randomDoctor].doctor_ID,
        doctor_schedule_date: AvailData[randomAvail].date,
        doctor_schedule_start_time: AvailData[randomAvail].startTime,
        doctor_schedule_end_time: AvailData[randomAvail].endTime,
        doctor_schedule_Interval: AvailData[randomAvail].intervalTime,
        doctor_schedule_max_patient: AvailData[randomAvail].maxPatient,
      };
      await insertDoctorAvailability(availObject);
    }
    console.table(resultHMO + resultSpec + resultNurse);
    return sendResponse(res, 200, "Success");
  } catch (error) {
    console.log(error);
  }
};
