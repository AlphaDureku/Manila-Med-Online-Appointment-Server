if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const errorHandler = require("./utils/errorHandler");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
//const path = require("path");

//app.use(express.static(path.join(__dirname + "/public")));

app.use(
  session({
    secret: "secret-key",
    store: new MemoryStore({
      checkPeriod: 5000,
    }),
    resave: true,
    saveUninitialized: false,
  })
);
app.use(errorHandler);
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(bodyParser.json());

const indexRouter = require("./Routes/index");
const tracking = require("./Routes/tracking");
const booking = require("./Routes/booking");

app.use("/", indexRouter);
app.use("/user", tracking);
app.use("/booking", booking);

app.listen(process.env.PORT || 4000);
