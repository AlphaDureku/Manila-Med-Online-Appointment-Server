const mail = require("nodemailer");
const moment = require("moment");
function generateOTP() {
  return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
}

exports.sendEmailSecretary = (email, body) => {
  async function main() {
    let transporter = mail.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: "templanzamark2002@gmail.com",
        pass: "koaowdqdigdcujwr",
      },
    });

    let info = await transporter.sendMail({
      from: '"templanzamark2002@gmail.com',
      to: email,
      subject: "Your account details",
      html: `username: ${body.username}<br>password:${body.password}`,
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
        user: "templanzamark2002@gmail.com",
        pass: "koaowdqdigdcujwr",
      },
    });

    let info = await transporter.sendMail({
      from: '"templanzamark2002@gmail.com',
      to: email,
      subject: "Security Verification",
      html: `
            <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
              <div style='margin:50px auto;width:70%;padding:20px 0'>
                <div style='border-bottom:1px solid #eee'>
                  <a href=''style='font-size:1.5em;color: #388440;text-decoration:none;font-weight:600'><img src='https://scontent.fmnl4-2.fna.fbcdn.net/v/t39.30808-6/323289895_721708059168068_7716967383321258182_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFCtue87s6eVW82rSocbCt0kveEtFjVanKS94S0WNVqcoext4GgIfTr7acDsVwuhD-MtKlKPrsp8FxMs3V5ofie&_nc_ohc=mbGVH1UEvjEAX_1Hg8n&_nc_ht=scontent.fmnl4-2.fna&oh=00_AfAfheaUrnMEEQkZrrkpY3XWUcFeCZg9SdU6nSOvQPbm3g&oe=643554AC' width='28' 
                 height='25'/> Medical Center Manila</a>
                </div>
                <p style='font-size:1.7em;'><b>Hi,</b></p>
                <p><b>Dont share this code to anyone.</b> </p>
                <p>Thank you for choosing Medical Center Manila, Your will see below your OTP number. </p>
                <h2 style='background: #2F9D44; margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;'>${OTP}</h2>
                <p style='font-size:0.9em;'>Regards,<br />Medical Center Manila</p>
                <hr style='border:none;border-top:1px solid #eee' />
                <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
                  <p>Medical Center Manila Inc</p>
                  <p>1002 PLM General luna</p>
                  <p>Manila</p>
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
        user: "templanzamark2002@gmail.com",
        pass: "koaowdqdigdcujwr",
      },
    });

    let info = await transporter.sendMail({
      from: '"templanzamark2002@gmail.com',
      to: email,
      subject: "Security Verification",
      html: `
            <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
              <div style='margin:50px auto;width:70%;padding:20px 0'>
                <div style='border-bottom:1px solid #eee'>
                  <a href=''style='font-size:1.5em;color: #388440;text-decoration:none;font-weight:600'><img src='https://scontent.fmnl4-2.fna.fbcdn.net/v/t39.30808-6/323289895_721708059168068_7716967383321258182_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFCtue87s6eVW82rSocbCt0kveEtFjVanKS94S0WNVqcoext4GgIfTr7acDsVwuhD-MtKlKPrsp8FxMs3V5ofie&_nc_ohc=mbGVH1UEvjEAX_1Hg8n&_nc_ht=scontent.fmnl4-2.fna&oh=00_AfAfheaUrnMEEQkZrrkpY3XWUcFeCZg9SdU6nSOvQPbm3g&oe=643554AC' width='28' 
                 height='25'/> Medical Center Manila</a>
                </div>
                <p style='font-size:1.7em;'><b>Hi,</b></p>
                <p><b>Dont share this code to anyone.</b> </p>
                <p>Use the OTP code below for verification.</p>
                <h2 style='background: #2F9D44; margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;'>${OTP}</h2>
                <p style='font-size:0.9em;'>Regards,<br />Medical Center Manila</p>
                <hr style='border:none;border-top:1px solid #eee' />
                <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
                  <p>Medical Center Manila Inc</p>
                  <p>1002 PLM General luna</p>
                  <p>Manila</p>
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
        user: "templanzamark2002@gmail.com",
        pass: "koaowdqdigdcujwr",
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
      from: '"templanzamark2002@gmail.com', // sender address
      to: email.doctor_email, // list of receivers
      subject: "Today's Schedule", // Subject line
      html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href=""style="font-size:1.5em;color: #388440;text-decoration:none;font-weight:600"><img src="https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/323289895_721708059168068_7716967383321258182_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFCtue87s6eVW82rSocbCt0kveEtFjVanKS94S0WNVqcoext4GgIfTr7acDsVwuhD-MtKlKPrsp8FxMs3V5ofie&_nc_ohc=z7SE0rt_lhgAX9WFSHd&_nc_ht=scontent.fmnl13-2.fna&oh=00_AfBqcvgJEcTKAO68VFxhKgAT7NfFEU2spxxcqEExEYrEIQ&oe=641D99AC" width="28" 
               height="25"/> Medical Center Manila</a>
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
                <p>1002 PLM General luna</p>
                <p>Manila</p>
              </div>
            </div>
          </div>`,
    });
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
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
        user: "templanzamark2002@gmail.com",
        pass: "koaowdqdigdcujwr",
      },
    });

    let info = await transporter.sendMail({
      from: '"templanzamark2002@gmail.com',
      to: appointmentDetails.email,
      subject: "Hospital Appointment",
      html: `
            <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
              <div style='margin:50px auto;width:70%;padding:20px 0'>
                <div style='border-bottom:1px solid #eee'>
                  <a href=''style='font-size:1.5em;color: #388440;text-decoration:none;font-weight:600'><img src='https://scontent.fmnl4-2.fna.fbcdn.net/v/t39.30808-6/323289895_721708059168068_7716967383321258182_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFCtue87s6eVW82rSocbCt0kveEtFjVanKS94S0WNVqcoext4GgIfTr7acDsVwuhD-MtKlKPrsp8FxMs3V5ofie&_nc_ohc=mbGVH1UEvjEAX_1Hg8n&_nc_ht=scontent.fmnl4-2.fna&oh=00_AfAfheaUrnMEEQkZrrkpY3XWUcFeCZg9SdU6nSOvQPbm3g&oe=643554AC' width='28' 
                 height='25'/> Medical Center Manila</a>
                </div>
                <p style='font-size:1.7em;'><b>Hi,</b></p>
                <p><b>Dont share this code to anyone.</b> </p>
                <p> Good Day ${appointmentDetails.Fname} ${
        appointmentDetails.Lname
      }, Manila Medical Center would like to remind you that your doctor has arrived at the hospital. Your appointment will start at ${moment(
        appointmentDetails.appointmentStart,
        "HH:mm:ss"
      ).format("hh:mm A")}. Thank you!</p>
                <p style='font-size:0.9em;'>Regards,<br />Medical Center Manila</p>
                <hr style='border:none;border-top:1px solid #eee' />
                <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
                  <p>Medical Center Manila Inc</p>
                  <p>1002 PLM General luna</p>
                  <p>Manila</p>
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
        user: "templanzamark2002@gmail.com",
        pass: "koaowdqdigdcujwr",
      },
    });

    let info = await transporter.sendMail({
      from: '"templanzamark2002@gmail.com',
      to: appointmentDetails.email,
      subject: "Hospital Appointment",
      html: `
            <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
              <div style='margin:50px auto;width:70%;padding:20px 0'>
                <div style='border-bottom:1px solid #eee'>
                  <a href=''style='font-size:1.5em;color: #388440;text-decoration:none;font-weight:600'><img src='https://scontent.fmnl4-2.fna.fbcdn.net/v/t39.30808-6/323289895_721708059168068_7716967383321258182_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFCtue87s6eVW82rSocbCt0kveEtFjVanKS94S0WNVqcoext4GgIfTr7acDsVwuhD-MtKlKPrsp8FxMs3V5ofie&_nc_ohc=mbGVH1UEvjEAX_1Hg8n&_nc_ht=scontent.fmnl4-2.fna&oh=00_AfAfheaUrnMEEQkZrrkpY3XWUcFeCZg9SdU6nSOvQPbm3g&oe=643554AC' width='28' 
                 height='25'/> Medical Center Manila</a>
                </div>
                <p style='font-size:1.7em;'><b>Hi,</b></p>
                <p><b>Dont share this code to anyone.</b> </p>
                <p> Good Day ${appointmentDetails.Fname} ${
        appointmentDetails.Lname
      }, Manila Medical Center would like to remind you that your doctor is going to be late for a while. Rest assured that we will try our best not to alter your appointment start time at ${moment(
        appointmentDetails.appointmentStart,
        "HH:mm:ss"
      ).format("hh:mm A")}. Thank you for your cooperation!</p>
                <p style='font-size:0.9em;'>Regards,<br />Medical Center Manila</p>
                <hr style='border:none;border-top:1px solid #eee' />
                <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
                  <p>Medical Center Manila Inc</p>
                  <p>1002 PLM General luna</p>
                  <p>Manila</p>
                </div>
              </div>
            </div>`,
    });
    console.log("Message sent: %s", info.messageId);
  }
  main().catch(console.error);
  return OTP;
};
