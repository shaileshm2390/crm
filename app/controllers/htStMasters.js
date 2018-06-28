'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
var _ = require('lodash');
/**
 * Find rawMaterialMaster by id
 * Note: This is called every time that the parameter :id is used in a URL.
 * Its purpose is to preload the department on the req object then call the next function.
 */
exports.htStMaster = function (req, res, next, id) {    
    db.HTSTMaster.find({ where: { id: id } }).then(function (hTSTMaster) {    
        if (!hTSTMaster) {
            req.htStMaster = {};
            return next();
        } else {
            req.htStMaster = hTSTMaster;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};

/**
 * Create a RawMaterialMaster
 */
exports.create = function (req, res) {
    // augment the department by adding the UserId
    // save and return and instance of department on the res object.
    db.HTSTMaster.create(req.body).then(function (hTSTMaster) {
        if (!hTSTMaster) {
            return res.send('/signin', { errors: new StandardError('RawMaterialMaster could not be created') });
        } else {
            return res.jsonp(hTSTMaster);
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
    var htStMaster = req.htStMaster;

    htStMaster.updateAttributes({
        parameter: req.body.parameter,
        rate: req.body.rate,
        details: req.body.details
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
    var htStMaster = req.htStMaster;
    htStMaster.destroy().then(function () {
        return res.jsonp(htStMaster);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Show an department
 */
exports.show = function (req, res) {
    // Sending down the department that was just preloaded by the departments.department function
    // and saves department on the req object.
    return res.jsonp(req.htStMaster);
};

/**
 * List of department
 */
exports.all = function (req, res) {
    db.HTSTMaster.findAll().then(function (HTSTMasters) {
        return res.jsonp(HTSTMasters);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};