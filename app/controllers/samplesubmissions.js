'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
var _ = require('lodash');

/**
 * Find department by id
 * Note: This is called every time that the parameter :departmentId is used in a URL.
 * Its purpose is to preload the department on the req object then call the next function.
 */
exports.samplesubmission = function (req, res, next, id) {
    db.Samplesubmission.find({ where: { id: id } }).then(function (samplesubmission) {
        if (!samplesubmission) {
            return next(new Error('Failed to load sample submission ' + id));
        } else {
            req.samplesubmission = samplesubmission;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};

/**
 * Create a department
 */
exports.create = function (req, res) {
    // augment the department by adding the UserId
    // save and return and instance of department on the res object.
    db.Samplesubmission.create(req.body).then(function (samplesubmission) {
        if (!samplesubmission) {
            return res.send('/signin', { errors: new StandardError('sample submission could not be created') });
        } else {
            return res.jsonp(samplesubmission);
        }
    }).catch(function (err) {
        return res.send('/signin', {
            errors: err,
            status: 500
        });
    });
};

/**
 * Update a department
 */
exports.update = function (req, res) {

    // create a new variable to hold the department that was placed on the req object.
    var samplesubmission = req.samplesubmission;

    samplesubmission.updateAttributes({
        //name: req.body.name,
        status: req.body.status
    }).then(function (a) {
        return res.jsonp(a);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Delete an department
 */
exports.destroy = function (req, res) {

    // create a new variable to hold the department that was placed on the req object.
    console.log(req.samplesubmission.id)
    var samplesubmission = req.samplesubmission;
    db.User.destroy({ where: { SamplesubmissionId: req.samplesubmission.id } }).then(function () {
        samplesubmission.destroy().then(function () {
            return res.jsonp(samplesubmission);
        }).catch(function (err) {
            return res.render('error', {
                error: err,
                status: 500
            });
        });
    });
};

/**
 * Show an department
 */
exports.show = function (req, res) {
    // Sending down the department that was just preloaded by the departments.department function
    // and saves department on the req object.
    return res.jsonp(req.samplesubmission);
};

/**
 * List of department
 */
exports.all = function (req, res) {
    db.Samplesubmission.findAll().then(function (samplesubmissions) {
        return res.jsonp(samplesubmissions);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 *Department authorizations routing middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.user.SamplesubmissionId != 1) {
        return res.send(401, 'User is not authorized ');
    }
    next();
};
