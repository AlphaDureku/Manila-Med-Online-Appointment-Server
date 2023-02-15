if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const errorHandler = require("./utils/errorHandler");

app.use(errorHandler);
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(bodyParser.json());
const indexRouter = require("./Routes/index");

app.use("/", indexRouter);

app.listen(process.env.PORT || 4000);
