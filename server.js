if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const errorHandler = require("./utils/errorHandler");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MemoryStore = require("memorystore")(session);
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: { origin: ["http://localhost:3000", "https://manilamed.netlify.app"] },
});

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
      maxAge: 24 * 60 * 60 * 1000,
      // /* Enable on deployment*/
      sameSite: "None",
      secure: true,
    },
  })
);

app.use(errorHandler);
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(bodyParser.json());

const indexRouter = require("./Routes/index");
const tracking = require("./Routes/tracking");
const booking = require("./Routes/booking");
const admin = require("./Routes/NursePage");
const headAdmin = require("./Routes/headAdminPage");

app.use((req, res, next) => {
  req.io = io; // Add the io object to the request object
  next();
});

app.use("/", indexRouter);
app.use("/user", tracking);
app.use("/booking", booking);
app.use("/admin", admin);
app.use("/head-admin", headAdmin);

server.listen(process.env.PORT || 4000, () => {
  console.log("Server listening on port 4000");
});
