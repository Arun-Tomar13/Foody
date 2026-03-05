const nodemailer = require("nodemailer");
const sendResponse = require("./response");
const { StatusCodes } = require("http-status-codes");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    pass: process.env.EMAIL_APP_PASSWORD,
    user: process.env.EMAIL,
  },
});

 
const sendEmail = async (res,{sendToEmail,subject,message,data}) => {
  try {
    console.log({sendToEmail,subject,message,data});
    
    const info = await transporter.sendMail({
      from: `Foody <${process.env.EMAIL}>`,
      to: sendToEmail,
      subject: subject,
      text: message, // Plain-text version of the message
      html: data, // HTML version of the message
    });
  
    console.log("Message sent:", info.messageId);
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

module.exports = {sendEmail,orderConfirmationTemplate}


function orderConfirmationTemplate(id,total,items) {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <h2>Thank you for your order!</h2>
      <p>Your order <strong>#${id}</strong> has been successfully placed.</p>
     
      <h3>Order Details:</h3>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
        ${items.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price}</td>
          </tr>
        `).join('')}
      </table>
 
      <p><strong>Total:</strong> ₹${total}</p>
      <p>We will notify you once your order is shipped.</p>
      <hr>
      <p style="font-size: 12px; color: #777;">If you have any questions, contact us at support@zupee.com</p>
    </body>
  </html>
  `;
};