'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
var _ = require('lodash');

/**
 * Create a department
 */
exports.create = function (req, res) {
    db.SampleStatus.create(req.body).then(function (samplestatus) {
        return res.jsonp(samplestatus);
    }).catch(function (err) {
        return res.send('/signin', {
            errors: err,
            status: 500
        });
    });
};

exports.all = function (req, res) {
    db.SampleStatus.findAll({
             order: [['createdAt', 'ASC']],         
    }).then(function (samplestatus) {
        return res.jsonp(samplestatus);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

exports.byId = function (req, res, next, id) {
    db.SampleStatus.find({
        where: { id: id }
    }).then(function (samplestatus) {
        if (samplestatus != null) {
            req.samplestatusById = samplestatus;
        } else {
            req.samplestatusById = {};
        }
        return next();
    }).catch(function (err) {
        console.log(err)
    });
}

exports.byRfqId = function (req, res, next, id) {
    db.Samplesubmission.find({
        where: { RfqId: id },
        include: [{ model: db.SampleStatus }],
        order: [['createdAt', 'ASC']],

    }).then(function (samplesubmission) {
        if (samplesubmission != null && samplesubmission.SampleStatuses.length > 0) {
            req.samplestatusByRfqId = samplesubmission.SampleStatuses;
        } else {
            req.samplestatusByRfqId = [];
        }
        return next();
    }).catch(function (err) {
       console.log(err)
    });
}

exports.samplestatus = function (req, res) {
    return res.jsonp(req.samplestatusByRfqId);
};

exports.samplestatusById = function (req, res) {
    return res.jsonp(req.samplestatusById);
};

exports.update = function (req, res) {
    var samplestatus = req.samplestatusById;
    samplestatus.updateAttributes({
        UserId: req.body.UserId,
        status: req.body.status
    }).then(function (a) {
        return res.jsonp(a);
    }).catch(function (err) {
        console.log(err);
    });
}