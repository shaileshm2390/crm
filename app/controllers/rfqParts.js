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
            updatedData: JSON.stringify(rfqParts),
					RfqId: rfqParts.RfqId, 
					RfqPartId: req.rfqParts.id
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


exports.getAllRfqParts = function (req, res) {
    db.RfqParts.findAll().then(function (parts) {
        return res.jsonp(parts);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

exports.rfqPartsByPartId = function (req, res, next, id) {
    db.RfqParts.find({ where: { id: id } }).then(function (rfqParts) {
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

exports.update = function (req, res) {
    function twoDigits(d) {
        if (0 <= d && d < 10) return "0" + d.toString();
        if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
        return d.toString();
    }

    Date.prototype.toMysqlFormat = function () {
        return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
    };
    if (parseInt(req.body.records[0].id) === 0) {
        db.sequelize.query("INSERT INTO `RfqParts` (partName, createdAt,updatedAt, RfqId) VALUES ('" + req.body.records[0].partName + "','" + new Date().toMysqlFormat() + "','" + new Date().toMysqlFormat() + "','" + req.body.RfqId + "')", { type: db.sequelize.QueryTypes.INSERT }).then(function (rfqParts) {
            // insert watchdog data
            var fullUrl = req.originalUrl; //req.protocol + '://' + req.get('host') + req.originalUrl;

            db.Watchdog.create({
                message: "New Part details is inserted with RFQ id = " + req.body.RfqId,
                ipAddress: ipAddress,
                pageUrl: fullUrl,
                previousData: "",
                updatedData: JSON.stringify(req.body.records),
					RfqId: req.body.RfqId, 
					RfqPartId: rfqParts.id
            });

            return res.jsonp(rfqParts);
        }).catch(function (err) {
            return res.send('/signin', {
                errors: err,
                status: 500
            });
        });
    } else {
        db.sequelize.query("Update `RfqParts` SET partName = '" + req.body.records[0].partName + "', updatedAt = '" + new Date().toMysqlFormat() + "' WHERE id = '" + req.body.records[0].id + "' AND RfqId = '" + req.body.RfqId + "'", { type: db.sequelize.QueryTypes.UPDATE }).then(function (rfqParts) {
            // insert watchdog data
            var fullUrl = req.originalUrl; //req.protocol + '://' + req.get('host') + req.originalUrl;

            db.Watchdog.create({
                message: "Part details has been updated successfully with RFQ id = " + req.body.RfqId,
                ipAddress: ipAddress,
                pageUrl: fullUrl,
                previousData: "",
                updatedData: JSON.stringify(req.body.records),
					RfqId: req.body.RfqId, 
					RfqPartId: req.body.records[0].id
            });
            return res.jsonp(rfqParts);
        }).catch(function (err) {
            console.log(err);
            return res.send('/signin', {
                errors: err,
                status: 500
            });
        });
    }
};

exports.destroy = function (req, res) {
    // create a new variable to hold the department that was placed on the req object.
    var rfqParts = req.rfqParts;
    db.RfqParts.destroy({ where: { id: req.rfqParts.id } }).then(function () {
            return res.jsonp(rfqParts);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};