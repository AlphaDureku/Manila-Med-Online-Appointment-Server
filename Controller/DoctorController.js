const sendResponse = require("../utils/sendResponse");
const Doctor = require('../Models/database_query/doctor_queries')



exports.searchDoctor = async (req, res) => {
    let searchOption = {
        Fname: req.query.Fname,
        Lname: req.query.Lname,
        Specialization: req.query.specialization,
        doctor_HMO: req.query.HMO
    }
    
    if (!searchOption.Fname && !searchOption.Lname && !searchOption.Specialization && !searchOption.doctor_HMO) {
        const result = await Doctor.getDoctor()
        const schedule = await Doctor.getSchedule()
        sendResponse(res, 200, {result, schedule})

        //Using specs only
    } else if ((!searchOption.Fname && !searchOption.Lname) && (searchOption.Specialization != undefined && searchOption.doctor_HMO != undefined)) {
        console.log("get by spec and sub_spec only")

    } else if ((searchOption.Fname != undefined || searchOption.Lname != undefined) && (searchOption.Specialization || searchOption.doctor_HMO)) {
        console.log("get by Name, spec and sub_spec")

    } else if (searchOption.Fname && searchOption.Lname) {
        console.log("get by Fname Lname")
        const result = await Doctor.getDoctor_Using_Fname_Lname(searchOption.Fname, searchOption.Lname)
        const schedule = await Doctor.getSchedule_Using_Fname_Lname(searchOption.Fname, searchOption.Lname)
        sendResponse(res, 200, {result, schedule})

    } else if (searchOption.Lname) {
        console.log("get by LName")
        const result = await Doctor.getDoctor_Using_Lname(searchOption.Lname)
        const schedule = await Doctor.getSchedule_Using_Lname(searchOption.Lname)
        sendResponse(res, 200, {result, schedule})

    } else if (searchOption.Fname) {
        const result = await Doctor.getDoctor_Using_Fname(searchOption.Fname)
        const schedule = await Doctor.getSchedule_Using_Fname(searchOption.Fname)
        sendResponse(res, 200, {result, schedule})

    } else {
        console.log("Undefined")
    }

}
