const moment = require("moment");

const Day = {
  start: moment().startOf("day").toDate(),
  end: moment().endOf("day").toDate(),
};

const Week = {
  start: moment().startOf("week").toDate(),
  end: moment().endOf("week").toDate(),
};

const Month = {
  start: moment().startOf("month").toDate(),
  end: moment().endOf("month").toDate(),
};

const Year = {
  start: moment().startOf("year").toDate(),
  end: moment().endOf("year").toDate(),
};

module.exports = { Day, Year, Month, Week };
