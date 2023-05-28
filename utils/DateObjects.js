const moment = require("moment-timezone");

const Day = {
  start: moment().tz("Asia/Manila").startOf("day").toDate(),
  end: moment().tz("Asia/Manila").endOf("day").toDate(),
};

const Week = {
  start: moment().tz("Asia/Manila").startOf("isoWeek").toDate(),
  end: moment().tz("Asia/Manila").endOf("isoWeek").toDate(),
};

const Month = {
  start: moment().tz("Asia/Manila").startOf("month").startOf("day").toDate(),
  end: moment().tz("Asia/Manila").endOf("month").endOf("day").toDate(),
};

const Year = {
  start: moment().tz("Asia/Manila").startOf("year").startOf("day").toDate(),
  end: moment().tz("Asia/Manila").endOf("year").endOf("day").toDate(),
};

module.exports = { Day, Year, Month, Week };
