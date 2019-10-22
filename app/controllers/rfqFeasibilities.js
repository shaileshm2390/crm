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

    db.RfqFeasibilities.destroy({
        where: { RfqId: req.body.RfqId }
    }).then(function () {

        var insertQuery = "INSERT INTO `RfqFeasibilities` (partName, isFeasible, RfqId, UserId,CreatedAt) VALUES";
        var valuesArray = [];

        function twoDigits(d) {
            if (0 <= d && d < 10) return "0" + d.toString();
            if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
            return d.toString();
        }
        
        Date.prototype.toMysqlFormat = function () {
            return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
        };

        for (var index = 0; index < req.body.records.length; index++) {
            valuesArray.push("('" + req.body.records[index].partName + "'," + (req.body.records[index].isFeasible == "true" ? 1 : 0) + ",'" + req.body.RfqId + "','" + req.body.UserId + "', '" + new Date().toMysqlFormat() + "')");
        }
        insertQuery += valuesArray.join(", ");

        db.sequelize.query(insertQuery, { type: db.sequelize.QueryTypes.INSERT }).then(function (rfqFeasibilities) {        
            // insert watchdog data
            var fullUrl = req.originalUrl; //req.protocol + '://' + req.get('host') + req.originalUrl;

            db.Watchdog.create({
                message: "New feasibilities check is done with RFQ id = " + req.body.RfqId,
                ipAddress: ipAddress,
                pageUrl: fullUrl,
                userId: req.body.UserId,
                previousData: "",
                updatedData: JSON.stringify(req.body.records)
            });

            db.sequelize.query("UPDATE `rfqs` SET `type` = '" + req.body.RfqType + "' WHERE id = '" + req.body.RfqId + "'", { type: db.sequelize.QueryTypes.UPDATE });

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
};

exports.uploadattachment = function (req, res) {
    // augment the department by adding the UserId
    // save and return and instance of department on the res object.
    var sampleFile = req.files;
    sampleFile.file.name = Math.floor(Date.now() / 1000) + "-" + sampleFile.file.name;
    sampleFile.file.mv(__dirname + '/../../public/temp/' + sampleFile.file.name, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            var response = { pathFromRoot: "/temp/" + sampleFile.file.name, success: true };

            return res.jsonp(response);
        }
    });
};

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