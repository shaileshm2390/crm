'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
var _ = require('lodash');
const request = require('request');
var ipAddress;
request('http://api.ipstack.com/check?access_key=a0a80aaea559ceb4d5ebacc03c30f6d3', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    ipAddress = body.ip;
});


/**
 * Create a department
 */
exports.save = function (req, res) {

    db.HandoverSubmitted.create(req.body).then(function (handoverSubmitted) {
            // insert watchdog data
            var fullUrl = req.originalUrl; //req.protocol + '://' + req.get('host') + req.originalUrl;

            db.Watchdog.create({
                message: "New Developer handover is created with id = " + handoverSubmitted.id,
                ipAddress: ipAddress,
                pageUrl: fullUrl,
                userId: handoverSubmitted.UserId,
                previousData: "",
                updatedData: JSON.stringify(handoverSubmitted)
            });
            return res.jsonp(handoverSubmitted);
        }).catch(function (err) {
            return res.send('/signin', {
                errors: err,
                status: 500
            });
        });
};