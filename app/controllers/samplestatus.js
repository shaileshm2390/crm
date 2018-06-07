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
         
            model: db.SampleStatus,
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
exports.sampleStatusBySampleStatusId = function (req, res) {
    return res.jsonp(req.samplestatus);
};