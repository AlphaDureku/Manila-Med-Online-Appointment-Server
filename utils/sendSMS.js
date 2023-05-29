const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_TOKEN = process.env.TWILIO_TOKEN;
const client = require("twilio")(TWILIO_SID, TWILIO_TOKEN);
require("dotenv").config();
var AWS = require("aws-sdk");
const moment = require("moment");

exports.sendSMS = async (phonenumber, body) => {
  await client.messages
    .create({
      body: body,
      messagingServiceSid: "MG0c15962647fa6ff788b2cfee7d891c43",
      to: phonenumber,
    })
    .then((message) => console.log(message));
};

exports.NotifyPatients = async (patientinfo) => {
  const { contact, patient_Fname, patient_Lname, start, end } = patientinfo;
  sendSMS(
    contact,
    `Good Day ${patient_Fname} ${patient_Lname}, Manila Medical Center would like to remind you of your appointment for today at ${start} to ${end}`
  );
};

exports.sendSMSUpdate = (phonenumber, body) => {
  var params = {
    Message: body,
    PhoneNumber: phonenumber,
    MessageAttributes: {
      "AWS.SNS.SMS.SenderID": {
        DataType: "String",
        StringValue: "update",
      },
    },
  };

  var publishTextPromise = new AWS.SNS({ apiVersion: "2010-03-31" })
    .publish(params)
    .promise();

  publishTextPromise
    .then(function (data) {
      return console.log(JSON.stringify({ MessageID: data.MessageId }));
    })
    .catch(function (err) {
      return console.log(JSON.stringify({ Error: err }));
    });
};

exports.NotifyPatientsThruSMSThatDoctorHasArrived = (appointmentDetails) => {
  var params = {
    Message: `Good Day ${appointmentDetails.Fname} ${
      appointmentDetails.Lname
    }, Manila Medical Center would like to remind you that your doctor has arrived at the hospital. Your appointment will start at ${moment(
      appointmentDetails.appointmentStart,
      "HH:mm:ss"
    ).format("hh:mm A")}. Thank you!`,
    PhoneNumber: "639287254306",
    MessageAttributes: {
      "AWS.SNS.SMS.SenderID": {
        DataType: "String",
        StringValue: "update",
      },
    },
  };

  var publishTextPromise = new AWS.SNS({ apiVersion: "2010-03-31" })
    .publish(params)
    .promise();

  publishTextPromise
    .then(function (data) {
      return console.log(JSON.stringify({ MessageID: data.MessageId }));
    })
    .catch(function (err) {
      return console.log(JSON.stringify({ Error: err }));
    });
};

exports.NotifyPatientsThruSMSThatDoctorIsLate = (appointmentDetails) => {
  var params = {
    Message: `Good Day ${appointmentDetails.Fname} ${
      appointmentDetails.Lname
    }, Manila Medical Center would like to remind you that your doctor is going to be late for a while. Rest assured that we will try our best not to alter your appointment start time at ${moment(
      appointmentDetails.appointmentStart,
      "HH:mm:ss"
    ).format("hh:mm A")}. Thank you for your cooperation!`,
    PhoneNumber: appointmentDetails.Contact,
    MessageAttributes: {
      "AWS.SNS.SMS.SenderID": {
        DataType: "String",
        StringValue: "update",
      },
    },
  };

  var publishTextPromise = new AWS.SNS({ apiVersion: "2010-03-31" })
    .publish(params)
    .promise();

  publishTextPromise
    .then(function (data) {
      return console.log(JSON.stringify({ MessageID: data.MessageId }));
    })
    .catch(function (err) {
      return console.log(JSON.stringify({ Error: err }));
    });
};

exports.NotifyPatientsThruSMSThatCancellAll = (appointmentDetails) => {
  var params = {
    Message: `Good Day ${appointmentDetails.Fname} ${appointmentDetails.Lname}, Manila Medical Center would like to remind you that your appointment has been cancelled, we deeply apologize for the inconvenience. Thank you for your understanding!`,
    PhoneNumber: appointmentDetails.Contact,
    MessageAttributes: {
      "AWS.SNS.SMS.SenderID": {
        DataType: "String",
        StringValue: "update",
      },
    },
  };

  var publishTextPromise = new AWS.SNS({ apiVersion: "2010-03-31" })
    .publish(params)
    .promise();

  publishTextPromise
    .then(function (data) {
      return console.log(JSON.stringify({ MessageID: data.MessageId }));
    })
    .catch(function (err) {
      return console.log(JSON.stringify({ Error: err }));
    });
};
