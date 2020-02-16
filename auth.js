var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken')
var _ = require('lodash');
require('dotenv').config()
let email = process.env.EMAIL
let password = process.env.PASSWORD

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: email,
      pass: password,
    },
  });

var sendMail = async (user, EMAIL_SECRET) =>{
    try {
        const emailToken = jwt.sign(
            {
                user: _.pick(user, 'id'),
            },
                EMAIL_SECRET,
            {
                expiresIn: '1d',
            },);

        const url = `http://localhost:8000/confirmation/${emailToken}`;
        
        await transporter.sendMail({
            to: user.email,
            subject: 'Confirm Email',
            html: `Please click here to confirm your email: <a href="${url}">"Confirmation"</a>`,
            });
            } catch (e) {
                console.log(e);
            }
        return user
}

module.exports = sendMail