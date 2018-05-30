'use strict';
// sendmail.js
var nodemailer = require('nodemailer');
module.exports = {
     
    sendMail: function (mailOptions, callback) {
        var res;
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'imdemotest@gmail.com',
                pass: 'imorsetech'
            }
        });

        //transporter.sendMail(mailOptions, function (error, info) {
        //    if (error) {
        //        console.log(error);
        //        res.error = error;
        //    } else {
        //        console.log('Email sent: ' + info.response);
        //        res.info = info;
        //    }
        //    callback(res);
        //});        
        transporter.sendMail(mailOptions, callback);
    }
};