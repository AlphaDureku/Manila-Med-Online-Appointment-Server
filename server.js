if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const errorHandler = require("./utils/errorHandler");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MemoryStore = require("memorystore")(session);
const cors = require("cors");
//const path = require("path");

//app.use(express.static(path.join(__dirname + "/public")));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://whimsical-custard-fa9177.netlify.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.set("trust proxy", true);
app.use(
  session({
    secret: process.env.SECRET_KEY,
    store: new MemoryStore({
      checkPeriod: 15 * 60 * 1000,
    }),
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      // maxAge: 1000 * 60 * 60 * 48,
      /* Enable on deployment*/
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

app.use("/", indexRouter);
app.use("/user", tracking);
app.use("/booking", booking);
app.use("/admin", admin);
app.use("/head-admin", headAdmin);

app.listen(process.env.PORT || 4000);
