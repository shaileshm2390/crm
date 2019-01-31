'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
var _ = require('lodash');
/**
 * Find packingAndForwarding by id
 * Note: This is called every time that the parameter :id is used in a URL.
 * Its purpose is to preload the packingAndForwarding on the req object then call the next function.
 */
exports.packingAndForwarding = function (req, res, next, id) {    
    db.PackingAndForwarding.find({ where: { id: id } }).then(function (packingAndForwarding) {    
        if (!packingAndForwarding) {
            req.packingAndForwarding = {};
            return next();
        } else {
            req.packingAndForwarding = packingAndForwarding;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};

/**
 * Create a PackingAndForwarding
 */
exports.create = function (req, res) {
    // augment the department by adding the UserId
    // save and return and instance of department on the res object.
    db.PackingAndForwarding.create(req.body).then(function (packingAndForwarding) {
        if (!packingAndForwarding) {
            return res.send('/signin', { errors: new StandardError('PackingAndForwarding could not be created') });
        } else {
            return res.jsonp(packingAndForwarding);
        }
    }).catch(function (err) {
        return res.send('/signin', {
            errors: err,
            status: 500
        });
    });
};

/**
 * Update a PackingAndForwarding
 */
exports.update = function (req, res) {

    // create a new variable to hold the department that was placed on the req object.
    var packingAndForwarding = req.packingAndForwarding;

    packingAndForwarding.updateAttributes({
        name: req.body.name,
        rate: req.body.rate
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
 * Delete an PackingAndForwarding
 */
exports.destroy = function (req, res) {

    // create a new variable to hold the department that was placed on the req object.
    var packingAndForwarding = req.packingAndForwarding;
    packingAndForwarding.destroy().then(function () {
        return res.jsonp(packingAndForwarding);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Show an packingAndForwarding
 */
exports.show = function (req, res) {
    // Sending down the department that was just preloaded by the departments.department function
    // and saves department on the req object.
    return res.jsonp(req.packingAndForwarding);
};

/**
 * List of packingAndForwarding
 */
exports.all = function (req, res) {
    db.PackingAndForwarding.findAll().then(function (PackingAndForwardings) {
        return res.jsonp(PackingAndForwardings);
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
    db.PackingAndForwarding.create(req.body).then(function (packingAndForwarding) {
        if (!packingAndForwarding) {
            return res.send('/signin', { errors: new StandardError('Packing And Forwarding could not be created') });
        } else {
            return res.jsonp(packingAndForwarding);
        }
    }).catch(function (err) {
        return res.send('/signin', {
            errors: err,
            status: 500
        });
    });
};