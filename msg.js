var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2')

var sendMail =  (mail, htmlMessage) => {

    //let testAccount =  nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      
      
      auth: {
        xoauth2: xoauth2.createXOAuth2Generator({
            user: 'yassine5255@gmail.com',
            clientId:'507701173119-86poiqslchjs4v706ed1isg6jg1bi1ad.apps.googleusercontent.com',
            clientSecret:'507701173119-86poiqslchjs4v706ed1isg6jg1bi1ad.apps.googleusercontent.com',
            refreshToken:''
        })
      }
    });
  
    // send mail with defined transport object
    var mailOptions = {
            from: 'yassine <yassine5255@gmail.com', // sender address
            to: mail, // list of receivers
            subject: "Verification", // Subject line
            
            html: htmlMessage // html body
    }

    transporter.sendMail(mailOptions, function(error, response){
        if(error){
            console.log("Error mail");
            console.log(error);
        }else{
            console.log("Mail success")
        }
        transporter.close();
    })

};

module.exports = sendMail