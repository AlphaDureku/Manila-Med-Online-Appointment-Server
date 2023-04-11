const mail = require("nodemailer");

function generateOTP() {
  return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
}

exports.sendEmail_Booking = (email) => {
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

exports.sendEmail_Tracking = (email) => {
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
