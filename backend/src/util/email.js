const asyncHandler = require("./asyncHandler");
const ejs = require("ejs");
const path = require("path");
const nodemailer = require("nodemailer");
const sendEmail = asyncHandler(async (options) => {
        // 1. Create a transporter.
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
        const {email, template, data} = options
        const templatePath = path.join(__dirname, `../emails/${template}`);
        const html = await ejs.renderFile(templatePath, data);
        const mailOPtions = {
            from: process.env.EMAIL_FROM,
            to: email,
            html

        }
        await transporter.sendMail(mailOPtions);
    }
)
module.exports = sendEmail