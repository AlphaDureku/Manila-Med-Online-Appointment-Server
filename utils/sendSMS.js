const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_TOKEN = process.env.TWILIO_TOKEN;
const client = require("twilio")(TWILIO_SID, TWILIO_TOKEN);

const sendSMS = async (phonenumber, body) => {
  await client.messages
    .create({
      body: body,
      messagingServiceSid: "MG8c672527db6f9caf668096c1642785d1",
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
