if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const Chance = require("chance");
const chance = new Chance();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const errorHandler = require("./utils/errorHandler");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MemoryStore = require("memorystore")(session);
const cors = require("cors");
const uuid = require("uuid");
const moment = require("moment");
const bcrypt = require("bcrypt");
// const { SpecializationData } = require("../SpecializationData");
// const { HMOData } = require("../HMOData");
// const { DoctorData } = require("../DoctorsData");
// const { NurseData } = require("../NurseData");
//const path = require("path");

//app.use(express.static(path.join(__dirname + "/public")));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://manilamed.netlify.app"],
    credentials: true,
  })
);
app.use(cookieParser());
app.set("trust proxy", true);
app.use(
  session({
    secret: process.env.SECRET_KEY,
    store: new MemoryStore({
      checkPeriod: 10 * 24 * 60 * 60 * 1000,
    }),
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      maxAge: 60 * 60 * 1000,
      // /* Enable on deployment*/
      sameSite: "None",
      secure: true,
    },
  })
);

const DoctorData = [];
const NurseData = [];

// for (let i = 1; i < 122; i++) {
//   const DoctorObject = {
//     doctor_ID: "MCM-" + uuid.v4(),
//     doctor_first_name: chance.first(),
//     doctor_last_name: chance.last(),
//     doctor_email: chance.email(),
//     doctor_room: chance.pickone([300, 400, 500, 200]) + i,
//     doctor_gender: chance.pickone(["M", "F"]),
//     doctor_contact_number:
//       "+639" + chance.string({ length: 9, pool: "0123456789" }),
//     doctorSpecializationSpecializationID: chance.integer({ min: 1, max: 81 }),
//     hmoID: [
//       chance.integer({ min: 1, max: 39 }),
//       chance.integer({ min: 1, max: 39 }),
//       chance.integer({ min: 1, max: 39 }),
//     ],
//   };

//   DoctorData.push(DoctorObject);
// }

// const nurseData = async () => {
//   const salt = await bcrypt.genSalt();
//   for (let i = 1; i < 100; i++) {
//     const NurseObject = {
//       doctor_Secretary_ID: "NURSE-" + uuid.v4(),
//       doctor_Secretary_username: "Admin" + i,
//       doctor_Secretary_password: await bcrypt.hash("Admin" + i, salt),
//       doctor_Secretary_email: chance.email(),
//       doctor_Secretary_contact_number:
//         "+639" + chance.string({ length: 9, pool: "0123456789" }),
//       doctor_Secretary_first_name: chance.first(),
//       doctor_Secretary_last_name: chance.last(),
//     };
//     NurseData.push(NurseObject);
//   }
//   console.log(JSON.stringify(NurseData));
// };
// nurseData();

// const currentDate = moment();
// const nextMonthDate = moment().add(1, "month");

// const availArray = [];
// for (let i = 1; i < 100; i++) {
//   // Generate random start hour between 7 and 14 (7 AM to 2 PM)
//   const randomStartHour = Math.floor(Math.random() * 8) + 7;

//   // Set the random start time at the beginning of the hour
//   const randomStartTime = moment().set({
//     hour: randomStartHour,
//     minute: 0,
//     second: 0,
//   });

//   const randomDate = moment(
//     Math.random() * (nextMonthDate - currentDate) + currentDate
//   );
//   // Generate random duration between 4 and 8 hours
//   const randomDuration = Math.floor(Math.random() * 5) + 4;

//   // Calculate the end time based on random start time and duration, limited to the day range
//   const randomEndTime = randomStartTime.clone().add(randomDuration, "hours");
//   if (randomEndTime.isAfter(moment().set({ hour: 18, minute: 0, second: 0 }))) {
//     randomEndTime.set({ hour: 18, minute: 0, second: 0 });
//   }

//   // Ensure there is at least a 3-hour separation between start time and end time
//   const minEndTime = randomStartTime.clone().add(3, "hours");
//   if (randomEndTime.isBefore(minEndTime)) {
//     randomEndTime.set(minEndTime.toObject());
//   }

//   // Calculate the interval between start time and end time
//   const duration = moment.duration(randomEndTime.diff(randomStartTime));
//   const intervalTime = moment.duration(1, "hours");
//   const intervalCount = Math.ceil(
//     duration.asMilliseconds() / intervalTime.asMilliseconds()
//   );

//   // Calculate the maxPatient based on the interval count
//   const maxPatient = intervalCount;

//   const availObject = {
//     date: randomDate.format("MM/DD/YY"), // Assuming current date is used
//     startTime: randomStartTime.format("HH:mm:ss"),
//     endTime: randomEndTime.format("HH:mm:ss"),
//     intervalTime: intervalTime.hours().toString(),
//     maxPatient: maxPatient.toString(),
//   };
//   availArray.push(availObject);
// }

// console.log(JSON.stringify(availArray));

app.use(errorHandler);
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(bodyParser.json());

const indexRouter = require("./Routes/index");
const tracking = require("./Routes/tracking");
const booking = require("./Routes/booking");
const admin = require("./Routes/NursePage");
const headAdmin = require("./Routes/headAdminPage");
const { hashSomething } = require("./utils/Bcrypt");

app.use("/", indexRouter);
app.use("/user", tracking);
app.use("/booking", booking);
app.use("/admin", admin);
app.use("/head-admin", headAdmin);

app.listen(process.env.PORT || 4000);
