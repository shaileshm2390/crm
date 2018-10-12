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

    db.DeveloperHandover.create(req.body).then(function (developerHandover) {
            // insert watchdog data
            var fullUrl = req.originalUrl; //req.protocol + '://' + req.get('host') + req.originalUrl;

            db.Watchdog.create({
                message: "New Developer handover is created with id = " + developerHandover.id,
                ipAddress: ipAddress,
                pageUrl: fullUrl,
                userId: developerHandover.UserId,
                previousData: "",
                updatedData: JSON.stringify(developerHandover)
            });
            return res.jsonp(developerHandover);
        }).catch(function (err) {
            return res.send('/signin', {
                errors: err,
                status: 500
            });
        });
};

exports.developerHandover = function (req, res, next, id) {
    db.DeveloperHandover.find({
        where: { id: id }
    }).then(function (developerHandover) {
        if (!developerHandover) {
            req.developerHandover = {};
            return next();
        } else {
            req.developerHandover = developerHandover;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};

exports.update = function (req, res) {

    db.DeveloperHandover.find({
        where: { id: req.body.id }
    }).then(function (developerHandovers) {

        developerHandovers.updateAttributes({
            data: req.body.data,
            expectedLeadTime: req.body.expectedLeadTime
        }).then(function (a) {
            var fullUrl = req.originalUrl; //req.protocol + '://' + req.get('host') + req.originalUrl;

            db.Watchdog.create({
                message: "Developer handover is updated with id = " + a.id,
                ipAddress: ipAddress,
                pageUrl: fullUrl,
                userId: a.UserId,
                previousData: "",
                updatedData: JSON.stringify(a)
            });
            return res.jsonp(a);
        }).catch(function (err) {
            return res.render('error', {
                error: err,
                status: 500
            });
        });
    });
};

exports.all = function (req, res) {
    db.DeveloperHandover.findAll(
        {
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'email', 'firstName', 'lastName']
                }
            ]
        }).then(function (developerHandovers) {
            return res.jsonp(developerHandovers);
        }).catch(function (err) {
            console.log(err);
        });
};

exports.getDeveloperhandovers = function (req, res) {
    return res.jsonp(req.developerHandovers);
}

exports.developerhandoverByRfqId = function (req, res, next, id) {
    db.DeveloperHandover.findAll({
        where: { RfqId: id },
        include: [
            {
                model: db.User,
                attributes: ['id', 'email', 'firstName', 'lastName']
            }
        ]
    }).then(function (developerHandovers) {
        if (!developerHandovers) {
            //return next(new Error('Failed to load samplesubmissions ' + id));
            req.developerHandovers = {};
            return next();
        } else {
            req.developerHandovers = developerHandovers;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};