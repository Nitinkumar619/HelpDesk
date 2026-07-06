const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});


const sendMail = (options) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: process.env.EMAIL,
        ...options,
      },
      (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      }
    );
  });
};


const generateTicketSubmissionHTML = (name, type, code) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #4f46e5;">Your Ticket Has Been Submitted</h2>
      <p>Hi <span style="font-size: 1.1rem; color: rgb(85, 235, 15);">${name}</span>,</p>
      <p>Your complaint regarding <span style="font-size: 1.2rem; color: rgb(239, 51, 67);">${type}</span> has been recorded.</p>
      <p><strong>Your Ticket Code:</strong> <span style="font-size: 1.2rem; color: #4f46e5;">${code}</span> You can track complaint status using this ticket number.</p>
      <p style="margin-top: 20px;">We will get back to you shortly.</p>
      <br>
      <p style="font-size: 0.9rem; color: gray;">Thank you,<br>IIITA Help Desk Team</p>
    </div>
  `;
};


const sendTicketSubmissionMail = (email, name, type, code) => {
  const htmlContent = generateTicketSubmissionHTML(name, type, code);

  return sendMail({
    to: email,
    subject: "IIITA Help Desk - Ticket Submitted",
    html: htmlContent,
  });
};


const generateAssignedPersonnelHTML = (name, type, assignedName, assignedContact) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #4f46e5;">Personnel Assigned to Your Complaint</h2>
      <p>Hi <span style="font-size: 1.1rem; color: rgb(85, 235, 15);">${name}</span>,</p>
      <p>A personnel has been assigned to your complaint regarding <span style="font-size: 1.2rem; color: rgb(239, 51, 67);">${type}</span>.</p>
      <p><strong>Assigned Personnel:</strong> <span style="font-size: 1.1rem; color: #333;">${assignedName}</span></p>
      <p><strong>Contact:</strong> <span style="font-size: 1.1rem; color: #333;">${assignedContact}</span></p>
      <p style="margin-top: 20px;">Please feel free to reach out to the assigned personnel for any assistance.</p>
      <br>
      <p style="font-size: 0.9rem; color: gray;">Thank you,<br>IIITA Help Desk Team</p>
    </div>
  `;
};

const adminAssignedPersonnelMail = (email, name, type, assignedName, assignedContact) => {
  const htmlAssigned = generateAssignedPersonnelHTML(name, type, assignedName, assignedContact);
  return sendMail({
    to:email,
    subject: "IIITA Help Desk - Personnel Assigned",
    html: htmlAssigned,
  })
};


const generateComplaintResolvedHTML = (name, type) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #4f46e5;">Your Complaint Has Been Resolved</h2>
      <p>Hi <span style="font-size: 1.1rem; color: rgb(85, 235, 15);">${name}</span>,</p>
      <p>We are pleased to inform you that your complaint regarding 
      <span style="font-size: 1.2rem; color: rgb(239, 51, 67);">${type}</span> 
      has been resolved.</p>
      <p style="margin-top: 20px;">If you believe the issue is not fully resolved, you can reopen the ticket or contact support.</p>
      <br>
      <p style="font-size: 0.9rem; color: gray;">Thank you for your patience, you can give feedback from your dashboard itself<br>IIITA Help Desk Team</p>
    </div>
  `;
};

const complaintResolvedMail = (email, name, type) => {
  const htmlResolved = generateComplaintResolvedHTML(name, type);
  return sendMail({
    to: email,
    subject: "IIITA Help Desk - Complaint Resolved",
    html: htmlResolved,
  });
};

const generateForgotPasswordHTML = (name, resetLink) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Hello ${name},</h2>
      <p>You requested a password reset for your IIITA Help Desk account.</p>
      <p>Please click the button below to reset your password:</p>
      <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background-color:#4F46E5;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
      <br/>
      <p style="font-size: 0.9rem; color: gray;">Regards,<br>IIITA Help Desk Team</p>
    </div>
  `;
}
const sendForgotPasswordMail = (email, name, resetLink) => {
  const htmlContent = generateForgotPasswordHTML(name, resetLink);
  console.log(email, name, resetLink);
  return sendMail({
    to: email,
    subject: "IIITA Help Desk - Password Reset",
    html: htmlContent,
  });
};

module.exports = { 
  sendMail, 
  sendTicketSubmissionMail, 
  adminAssignedPersonnelMail, 
  complaintResolvedMail,
  sendForgotPasswordMail
};
