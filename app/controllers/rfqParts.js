'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
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
    db.RfqParts.create(req.body).then(function (rfqParts) {
        // insert watchdog data
        var fullUrl = req.originalUrl; //req.protocol + '://' + req.get('host') + req.originalUrl;

        db.Watchdog.create({
            message: "New feasibilities check is done with id = " + rfqParts.id + " for RFQ id = " + rfqParts.RfqId,
            ipAddress: ipAddress,
            pageUrl: fullUrl,
            userId: rfqParts.UserId,
            previousData: "",
            updatedData: JSON.stringify(rfqParts)
        });
        return res.jsonp(rfqParts);
    }).catch(function (err) {
        return res.send('/signin', {
            errors: err,
            status: 500
        });
    });
};

exports.rfqParts = function (req, res, next, id) {
    db.RfqParts.find({
        where: { id: id }
    }).then(function (rfqParts) {
        if (!rfqParts) {
            req.rfqParts = {};
            return next();
        } else {
            req.rfqParts = rfqParts;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};

exports.getRfqParts = function (req, res) {
    return res.jsonp(req.rfqParts);
};

exports.rfqPartsByRfqId = function (req, res, next, id) {
    db.RfqParts.findAll({
        where: { RfqId: id },
    }).then(function (rfqParts) {
        if (!rfqParts) {
            //return next(new Error('Failed to load samplesubmissions ' + id));
            req.developerHandovers = {};
            return next();
        } else {
            req.rfqParts = rfqParts;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};