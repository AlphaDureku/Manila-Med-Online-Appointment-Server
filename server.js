if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const indexRouter = require("./Routes/index");

app.use("/", indexRouter);

app.listen(process.env.PORT || 4000);
