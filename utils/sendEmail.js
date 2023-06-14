const mail = require("nodemailer");
const moment = require("moment");
function generateOTP() {
  return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
}

const EmailObjects = {
  address: process.env.GOOGLE_ADDRESS,
  password: process.env.GOOGLE_PASSWORD,
  from: "Medical Center Manila",
};
exports.sendEmailSecretary = (email, body) => {
  async function main() {
    let transporter = mail.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: EmailObjects.address,
        pass: EmailObjects.password,
      },
    });

    let info = await transporter.sendMail({
      from: EmailObjects.from,
      to: email,
      subject: "Account Details",
      html: `
      <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
        <div style='margin:50px auto;width:70%;padding:20px 0'>
          <div style='border-bottom:1px solid #eee'>
            <a href=''style='font-size:1.5em;color: #388440;text-decoration:none;font-weight:600'><img src="https://imgtr.ee/images/2023/05/29/1bETL.png" height= "35px" alt="1bETL.png" border="0" /> Medical Center Manila</a>
          </div>
          <p style='font-size:1.7em;'><b>Hi,</b></p>
          <p>Hello, <br>
          Here are your admin account details:<br><br>
          Username: ${body.username}<br>
          Password: ${body.password}</p>
          <br>
          <b>Please change your password after login.</b>
          <p style='font-size:0.9em;'>Regards,<br />Medical Center Manila Head Administrator</p>
          <hr style='border:none;border-top:1px solid #eee' />
          <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
            <p>Medical Center Manila Inc</p>
            <p>850 United Nations Ave, Paco</p>
            <p>Manila, Metro Manila</p>
          </div>
        </div>
      </div>`,
    });
    console.log("Message sent: %s", info.messageId);
  }
  main().catch(console.error);
};

exports.BookingOTP = (email) => {
  const OTP = generateOTP();
  async function main() {
    let transporter = mail.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: EmailObjects.address,
        pass: EmailObjects.password,
      },
    });

    let info = await transporter.sendMail({
      from: EmailObjects.from,
      to: email,
      subject: "Security Verification",
      html: `
            <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
              <div style='margin:50px auto;width:70%;padding:20px 0'>
                <div style='border-bottom:1px solid #eee'>
                  <a href=''style='font-size:1.5em;color: #388440;text-decoration:none;font-weight:600'><img src="https://imgtr.ee/images/2023/05/29/1bETL.png" height= "35px" alt="1bETL.png" border="0" /> Medical Center Manila</a>
                </div>
                <p style='font-size:1.7em;'><b>Hi,</b></p>
                <p><b>Dont share this code to anyone.</b> </p>
                <p>Thank you for choosing Medical Center Manila, Your will see below your OTP number. </p>
                <h2 style='background: #2F9D44; margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;'>${OTP}</h2>
                <p style='font-size:0.9em;'>Regards,<br />Medical Center Manila</p>
                <hr style='border:none;border-top:1px solid #eee' />
                <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
                  <p>Medical Center Manila Inc</p>
                  <p>850 United Nations Ave, Paco</p>
                  <p>Manila, Metro Manila</p>
                </div>
              </div>
            </div>`,
    });
    console.log("Message sent: %s", info.messageId);
  }
  main().catch(console.error);
  return OTP;
};

exports.TrackingOTP = (email) => {
  const OTP = generateOTP();
  async function main() {
    let transporter = mail.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: EmailObjects.address,
        pass: EmailObjects.password,
      },
    });

    let info = await transporter.sendMail({
      from: EmailObjects.from,
      to: email,
      subject: "Security Verification",
      html: `
            <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
              <div style='margin:50px auto;width:70%;padding:20px 0'>
                <div style='border-bottom:1px solid #eee'>
                  <a href=''style='font-size:1.5em;color: #388440;text-decoration:none;font-weight:600'><img src="https://imgtr.ee/images/2023/05/29/1bETL.png" height= "35px" alt="1bETL.png" border="0" /> Medical Center Manila</a>
                </div>
                <p style='font-size:1.7em;'><b>Hi,</b></p>
                <p><b>Dont share this code to anyone.</b> </p>
                <p>Use the OTP code below for verification.</p>
                <h2 style='background: #2F9D44; margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;'>${OTP}</h2>
                <p style='font-size:0.9em;'>Regards,<br />Medical Center Manila</p>
                <hr style='border:none;border-top:1px solid #eee' />
                <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
                  <p>Medical Center Manila Inc</p>
                  <p>850 United Nations Ave, Paco</p>
                  <p>Manila, Metro Manila</p>
                </div>
              </div>
            </div>`,
    });
    console.log("Message sent: %s", info.messageId);
  }
  main().catch(console.error);
  return OTP;
};

exports.AdminOTP = (email) => {
  const OTP = generateOTP();
  async function main() {
    let transporter = mail.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: EmailObjects.address,
        pass: EmailObjects.password,
      },
    });

    let info = await transporter.sendMail({
      from: EmailObjects.from,
      to: email,
      subject: "Security Verification",
      html: `
            <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
              <div style='margin:50px auto;width:70%;padding:20px 0'>
                <div style='border-bottom:1px solid #eee'>
                  <a href=''style='font-size:1.5em;color: #388440;text-decoration:none;font-weight:600'><img src="https://imgtr.ee/images/2023/05/29/1bETL.png" height= "35px" alt="1bETL.png" border="0" /> Medical Center Manila</a>
                </div>
                <p style='font-size:1.7em;'><b>Hi,</b></p>
                <p><b>Dont share this code to anyone.</b> </p>
                <p>Use the OTP code below for verification.</p>
                <h2 style='background: #2F9D44; margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;'>${OTP}</h2>
                <p style='font-size:0.9em;'>Regards,<br />Medical Center Manila</p>
                <hr style='border:none;border-top:1px solid #eee' />
                <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
                  <p>Medical Center Manila Inc</p>
                  <p>850 United Nations Ave, Paco</p>
                  <p>Manila, Metro Manila</p>
                </div>
              </div>
            </div>`,
    });
    console.log("Message sent: %s", info.messageId);
  }
  main().catch(console.error);
  return OTP;
};

exports.notifyDoctor = (email, table) => {
  async function main() {
    let transporter = mail.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: EmailObjects.address,
        pass: EmailObjects.password,
      },
    });
    let data_table = "";
    table.forEach((data) => {
      data_table += `<tr>
            <td align = 'center'>${data.Fname} ${data.Lname}</td>
            <td align = 'center'>${data.Contact}</td>
            </tr>`;
    });
    let info = await transporter.sendMail({
      from: EmailObjects.from,
      to: email.doctor_email,
      subject: "Today's Schedule",
      html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href=""style="font-size:1.5em;color: #388440;text-decoration:none;font-weight:600"><img src="https://imgtr.ee/images/2023/05/29/1bETL.png" height= "35px" alt="1bETL.png" border="0" /> Medical Center Manila</a>
              </div>
              <p style="font-size:1.7em;"><b>Hi,</b></p>
              <p>Here are the patient appointments for <b>${table[0].appointmentDate}</b> at<b> ${table[0].start} - ${table[0].end} </b></p>
              <style>
          table, th, td {
            border:1px solid black;
            text-align: center;
          }
          </style>
          <body>
          
          <table style="width:100%" border="2">
          <tr>
          <th>Full Name</th><th>Contact Number</th>
          <tr>
          ${data_table}

                
          </table>
              <p style="font-size:0.9em; padding:30px 0;">Regards,<br /><b>${email.Fname} ${email.Lname}</b></p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>Medical Center Manila Inc</p>
                <p>850 United Nations Ave, Paco</p>
                <p>Manila, Metro Manila</p>
              </div>
            </div>
          </div>`,
    });
    console.log("Message sent: %s", info.messageId);
  }

  main().catch(console.error);
};

exports.notifyPatientsThruEmailThatDoctorHasArrived = (appointmentDetails) => {
  const OTP = generateOTP();
  async function main() {
    let transporter = mail.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: EmailObjects.address,
        pass: EmailObjects.password,
      },
    });

    let info = await transporter.sendMail({
      from: EmailObjects.from,
      to: appointmentDetails.email,
      subject: "Hospital Appointment",
      html: `
            <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
              <div style='margin:50px auto;width:70%;padding:20px 0'>
                <div style='border-bottom:1px solid #eee'>
                  <a href=''style='font-size:1.5em;color: #388440;text-decoration:none;font-weight:600'><img src="https://imgtr.ee/images/2023/05/29/1bETL.png" height= "35px" alt="1bETL.png" border="0" /> Medical Center Manila</a>
                </div>
                <p style='font-size:1.7em;'><b>Hi,</b></p>
                <p> Good Day ${appointmentDetails.Fname} ${
        appointmentDetails.Lname
      }, Medical Center Manila would like to remind you that your doctor has arrived at the hospital. You should be at the hospital on or before ${moment(
        appointmentDetails.appointmentStart,
        "hh:mmA"
      ).format("hh:mmA")}. Thank you!</p>
                <p style='font-size:0.9em;'>Regards,<br />Medical Center Manila</p>
                <hr style='border:none;border-top:1px solid #eee' />
                <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
                  <p>Medical Center Manila Inc</p>
                  <p>850 United Nations Ave, Paco</p>
                  <p>Manila, Metro Manila</p>
                </div>
              </div>
            </div>`,
    });
    console.log("Message sent: %s", info.messageId);
  }
  main().catch(console.error);
  return OTP;
};

exports.notifyPatientsThruEmailThatDoctorIsLate = (appointmentDetails) => {
  const OTP = generateOTP();
  async function main() {
    let transporter = mail.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: EmailObjects.address,
        pass: EmailObjects.password,
      },
    });

    let info = await transporter.sendMail({
      from: EmailObjects.from,
      to: appointmentDetails.email,
      subject: "Hospital Appointment",
      html: `
            <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
              <div style='margin:50px auto;width:70%;padding:20px 0'>
                <div style='border-bottom:1px solid #eee'>
                  <a href=''style='font-size:1.5em;color: #388440;text-decoration:none;font-weight:600'><img src="https://imgtr.ee/images/2023/05/29/1bETL.png" height= "35px" alt="1bETL.png" border="0" /> Medical Center Manila</a>
                </div>
                <p style='font-size:1.7em;'><b>Hi,</b></p>
                <p> Good Day <b>${appointmentDetails.Fname} ${appointmentDetails.Lname}</b>, Medical Center Manila would like to remind you that your doctor is going to be late for a while. Rest assured that we will try our best in following your appointment schedule. Thank you for your cooperation!</p>
                <p style='font-size:0.9em;'>Regards,<br />Medical Center Manila</p>
                <hr style='border:none;border-top:1px solid #eee' />
                <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
                  <p>Medical Center Manila Inc</p>
                  <p>850 United Nations Ave, Paco</p>
                  <p>Manila, Metro Manila</p>
                </div>
              </div>
            </div>`,
    });
    console.log("Message sent: %s", info.messageId);
  }
  main().catch(console.error);
  return OTP;
};

exports.notifyPatientsThruEmailThatCancelAll = (appointmentDetails) => {
  const OTP = generateOTP();
  async function main() {
    let transporter = mail.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: EmailObjects.address,
        pass: EmailObjects.password,
      },
    });

    let info = await transporter.sendMail({
      from: EmailObjects.from,
      to: appointmentDetails.email,
      subject: "Hospital Appointment",
      html: `
            <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
              <div style='margin:50px auto;width:70%;padding:20px 0'>
                <div style='border-bottom:1px solid #eee'>
                  <a href=''style='font-size:1.5em;color: #388440;text-decoration:none;font-weight:600'><img src="https://imgtr.ee/images/2023/05/29/1bETL.png" height= "35px" alt="1bETL.png" border="0" /> Medical Center Manila</a>
                </div>
                <p style='font-size:1.7em;'><b>Hi,</b></p>
                <p> Good Day, ${appointmentDetails.Fname} ${appointmentDetails.Lname}, Medical Center Manila would like to regret to inform that your appointment has been cancelled, we deeply apologize for the inconvenience. <br><br>Thank you for your understanding!</p>
                <p style='font-size:0.9em;'>Regards,<br />Medical Center Manila</p>
                <hr style='border:none;border-top:1px solid #eee' />
                <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
                  <p>Medical Center Manila Inc</p>
                  <p>850 United Nations Ave, Paco</p>
                  <p>Manila, Metro Manila</p>
                </div>
              </div>
            </div>`,
    });
    console.log("Message sent: %s", info.messageId);
  }
  main().catch(console.error);
  return OTP;
};

exports.notifyPatientsThruEmailThatConfirmed = (appointmentDetails) => {
  async function main() {
    let transporter = mail.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: EmailObjects.address,
        pass: EmailObjects.password,
      },
    });

    let info = await transporter.sendMail({
      from: EmailObjects.from,
      to: appointmentDetails.email,
      subject: "Hospital Appointment",
      html: `
            <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
              <div style='margin:50px auto;width:70%;padding:20px 0'>
                <div style='border-bottom:1px solid #eee'>
                  <a href=''style='font-size:1.5em;color: #388440;text-decoration:none;font-weight:600'><img src="https://imgtr.ee/images/2023/05/29/1bETL.png" height= "35px" alt="1bETL.png" border="0" /> Medical Center Manila</a>
                </div>
                <p style='font-size:1.7em;'><b>Hi,</b></p>
                <p>Good Day, ${appointmentDetails.Fname} ${
        appointmentDetails.Lname
      }, We would like to inform that your appointment has been confirmed. You should be at the hospital on ${
        appointmentDetails.date
      } on or before ${moment(appointmentDetails.start, "HH:mm:ss").format(
        "hh:mmA"
      )}. Your doctor will be waiting for you at room ${
        appointmentDetails.room
      } <br>
      Note: Failure to arrive on time or if late for 15 minutes, the doctor will accomodate another patient.</p>
                <p style='font-size:0.9em;'>Regards,<br />Medical Center Manila</p>
                <hr style='border:none;border-top:1px solid #eee' />
                <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
                  <p>Medical Center Manila Inc</p>
                  <p>850 United Nations Ave, Paco</p>
                  <p>Manila, Metro Manila</p>
                </div>
              </div>
            </div>`,
    });
    console.log("Message sent: %s", info.messageId);
  }
  main().catch(console.error);
};

exports.notifyPatientsThruEmailThatCancelled = (appointmentDetails) => {
  async function main() {
    let transporter = mail.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: EmailObjects.address,
        pass: EmailObjects.password,
      },
    });

    let info = await transporter.sendMail({
      from: EmailObjects.from,
      to: appointmentDetails.email,
      subject: "Hospital Appointment",
      html: `
            <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
              <div style='margin:50px auto;width:70%;padding:20px 0'>
                <div style='border-bottom:1px solid #eee'>
                  <a href=''style='font-size:1.5em;color: #388440;text-decoration:none;font-weight:600'><img src="https://imgtr.ee/images/2023/05/29/1bETL.png" height= "35px" alt="1bETL.png" border="0" /> Medical Center Manila</a>
                </div>
                <p style='font-size:1.7em;'><b>Hi,</b></p>
                <p>Good Day, ${appointmentDetails.Fname} ${appointmentDetails.Lname}, Your appointment on ${appointmentDetails.date} has been cancelled. We deeply apologize for the inconvenience. Kindly give us a call at ${appointmentDetails.doctor_Secretary_contact_number} if you wanted to reschedule your appointment.
                <br>
                <br>
                Please be noted that your rescheduled appointment will be in our priority.
                Thank you for understanding.
                <br>
                <p style='font-size:0.9em;'>Regards,<br />Medical Center Manila</p>
                <hr style='border:none;border-top:1px solid #eee' />
                <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
                  <p>Medical Center Manila Inc</p>
                  <p>850 United Nations Ave, Paco</p>
                  <p>Manila, Metro Manila</p>
                </div>
              </div>
            </div>`,
    });
    console.log("Message sent: %s", info.messageId);
  }
  main().catch(console.error);
};

exports.notifyPatientsThruEmailThatRejected = (appointmentDetails) => {
  async function main() {
    let transporter = mail.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: EmailObjects.address,
        pass: EmailObjects.password,
      },
    });

    let info = await transporter.sendMail({
      from: EmailObjects.from,
      to: appointmentDetails.email,
      subject: "Hospital Appointment",
      html: `
            <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
              <div style='margin:50px auto;width:70%;padding:20px 0'>
                <div style='border-bottom:1px solid #eee'>
                  <a href=''style='font-size:1.5em;color: #388440;text-decoration:none;font-weight:600'><img src="https://imgtr.ee/images/2023/05/29/1bETL.png" height= "35px" alt="1bETL.png" border="0" /> Medical Center Manila</a>
                </div>
                <p style='font-size:1.7em;'><b>Hi,</b></p>
                <p>Good Day! ${appointmentDetails.Fname} ${appointmentDetails.Lname}, We regret to inform that your appointment has been rejected. We deeply apologize for the inconvenience. Kindly give us a call at ${appointmentDetails.doctor_Secretary_contact_number} if you would like to rebook your appointment.</p>
                <p style='font-size:0.9em;'>Regards,<br />Medical Center Manila</p>
                <hr style='border:none;border-top:1px solid #eee' />
                <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
                  <p>Medical Center Manila Inc</p>
                  <p>850 United Nations Ave, Paco</p>
                  <p>Manila, Metro Manila</p>
                </div>
              </div>
            </div>`,
    });
    console.log("Message sent: %s", info.messageId);
  }
  main().catch(console.error);
};

exports.notifySecretaryAboutNewRequest = (
  doctor_first_name,
  doctor_last_name,
  email
) => {
  async function main() {
    let transporter = mail.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: EmailObjects.address,
        pass: EmailObjects.password,
      },
    });

    let info = await transporter.sendMail({
      from: EmailObjects.from,
      to: email,
      subject: "Appointment Request",
      html: `
            <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
              <div style='margin:50px auto;width:70%;padding:20px 0'>
                <div style='border-bottom:1px solid #eee'>
                  <a href=''style='font-size:1.5em;color: #388440;text-decoration:none;font-weight:600'><img src="https://imgtr.ee/images/2023/05/29/1bETL.png" height= "35px" alt="1bETL.png" border="0" /> Medical Center Manila</a>
                </div>
                <p style='font-size:1.7em;'><b>New Appointment Request</b></p>
                <p>A patient has requested an appointment with Dr. ${doctor_first_name} ${doctor_last_name}. Please review the appointment request within 24hrs.</p>
                <p style='font-size:0.9em;'>Regards,<br />Medical Center Manila</p>
                <hr style='border:none;border-top:1px solid #eee' />
                <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
                  <p>Medical Center Manila Inc</p>
                  <p>850 United Nations Ave, Paco</p>
                  <p>Manila, Metro Manila</p>
                </div>
              </div>
            </div>`,
    });
    console.log("Message sent: %s", info.messageId);
  }
  main().catch(console.error);
};
