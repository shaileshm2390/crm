'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
var _ = require('lodash');
var pdf = require('html-pdf');
var fs = require('fs');
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

    db.RfqFeasibilities.create(req.body).then(function (rfqFeasibilities) {
            // insert watchdog data
            var fullUrl = req.originalUrl; //req.protocol + '://' + req.get('host') + req.originalUrl;

            db.Watchdog.create({
                message: "New feasibilities check is done with id = " + rfqFeasibilities.id + " for RFQ id = " + rfqFeasibilities.RfqId,
                ipAddress: ipAddress,
                pageUrl: fullUrl,
                userId: rfqFeasibilities.UserId,
                previousData: "",
                updatedData: JSON.stringify(rfqFeasibilities)
            });
            return res.jsonp(rfqFeasibilities);
        }).catch(function (err) {
            return res.send('/signin', {
                errors: err,
                status: 500
            });
        });
};

exports.rfqFeasibilities = function (req, res, next, id) {
    db.RfqFeasibilities.find({
        where: { id: id }
    }).then(function (rfqFeasibilities) {
        if (!rfqFeasibilities) {
            req.rfqFeasibilities = {};
            return next();
        } else {
            req.rfqFeasibilities = rfqFeasibilities;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};

exports.update = function (req, res) {

    db.RfqFeasibilities.find({
        where: { RfqId: req.body.RfqId }
    }).then(function () {

        db.RfqFeasibilities.create(req.body).then(function (rfqFeasibilities) {
            // insert watchdog data
            var fullUrl = req.originalUrl; //req.protocol + '://' + req.get('host') + req.originalUrl;

            db.Watchdog.create({
                message: "Update feasibilities check for RFQ id = " + rfqFeasibilities.RfqId,
                ipAddress: ipAddress,
                pageUrl: fullUrl,
                userId: rfqFeasibilities.UserId,
                previousData: "",
                updatedData: JSON.stringify(rfqFeasibilities)
            });
            return res.jsonp(rfqFeasibilities);
        }).catch(function (err) {
            return res.send('/signin', {
                errors: err,
                status: 500
            });
        });
    });
};

exports.all = function (req, res) {
    db.RfqFeasibilities.findAll(
        {
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'email', 'firstName', 'lastName']
                }
            ]
        }).then(function (rfqFeasibilities) {
            return res.jsonp(rfqFeasibilities);
        }).catch(function (err) {
            console.log(err);
        });
};

exports.getRfqFeasibilities = function (req, res) {
    return res.jsonp(req.rfqFeasibilities);
}

exports.rfqFeasibilitiesByRfqId = function (req, res, next, id) {
    db.RfqFeasibilities.findAll({
        where: { RfqId: id },
        include: [
            {
                model: db.User,
                attributes: ['id', 'email', 'firstName', 'lastName']
            }
        ]
    }).then(function (rfqFeasibilities) {
        if (!rfqFeasibilities) {
            //return next(new Error('Failed to load samplesubmissions ' + id));
            req.developerHandovers = {};
            return next();
        } else {
            req.rfqFeasibilities = rfqFeasibilities;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};