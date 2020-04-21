'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
var _ = require('lodash');
const JSON = require('circular-json');
const request = require('request');
var ipAddress;

request('http://api.ipstack.com/check?access_key=a0a80aaea559ceb4d5ebacc03c30f6d3', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    ipAddress = body.ip;
});

/**
 * Create a POPartDetails
 */
exports.save = function (req, res) {
    db.POPartDetails.create(req.body).then(function (POPartDetails) {
        // insert watchdog data
        var fullUrl = req.originalUrl; //req.protocol + '://' + req.get('host') + req.originalUrl;

        db.Watchdog.create({
            message: "New PO Part Details inserted with id = " + POPartDetails.id + " for RFQ id = " + POPartDetails.RfqId,
            ipAddress: ipAddress,
            pageUrl: fullUrl,
            userId: '',
            previousData: "",
            updatedData: JSON.stringify(rfqParts),
            RfqId: POPartDetails.RfqId
        });
        return res.jsonp(POPartDetails);
    }).catch(function (err) {
        return res.send('/signin', {
            errors: err,
            status: 500
        });
    });
};

exports.destroy = function (req, res) {
    // create a new variable to hold the department that was placed on the req object.
    console.log("req");
    db.POPartDetails.destroy({ where: { RfqId: req.RfqId } }).then(function () {
        return res.jsonp(POPartDetails);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};