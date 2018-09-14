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
exports.rawMaterialMaster = function (req, res, next, id) {
    db.RawMaterialMaster.find({ where: { id: id } }).then(function (rawMaterialMaster) {
        if (!rawMaterialMaster) {
            req.rawMaterialMaster = {};
            return next();
        } else {
            req.rawMaterialMaster = rawMaterialMaster;
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
    db.RawMaterialMaster.create(req.body).then(function (rawMaterialMaster) {
        if (!rawMaterialMaster) {
            return res.send('/signin', { errors: new StandardError('RawMaterialMaster could not be created') });
        } else {
            return res.jsonp(rawMaterialMaster);
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
    var rawMaterialMaster = req.rawMaterialMaster;

    rawMaterialMaster.updateAttributes({
        material: req.body.material,
        rate: req.body.rate,
        scrapRate: req.body.scrapRate,
        scrapRecovery: req.body.scrapRecovery
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
    var rawMaterialMaster = req.rawMaterialMaster;
    rawMaterialMaster.destroy().then(function () {
        return res.jsonp(rawMaterialMaster);
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
    return res.jsonp(req.rawMaterialMaster);
};

/**
 * List of department
 */
exports.all = function (req, res) {
    db.RawMaterialMaster.findAll().then(function (rawMaterialMasters) {
        return res.jsonp(rawMaterialMasters);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};
exports.add = function (req, res) {
    // augment the department by adding the UserId
    // save and return and instance of department on the res object.
    db.RawMaterialMaster.create(req.body).then(function (rawMaterialMaster) {
        if (!rawMaterialMaster) {
            return res.send('/signin', { errors: new StandardError('RawMaterialMaster could not be created') });
        } else {
            return res.jsonp(rawMaterialMaster);
        }
    }).catch(function (err) {
        return res.send('/signin', {
            errors: err,
            status: 500
        });
    });
};