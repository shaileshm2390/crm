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
exports.purchaseorderimage = function (req, res, next, id) {
    db.Purchaseorderimage.find({ where: { id: id } }).then(function (purchaseorderimage) {
        if (!purchaseorderimage) {
            return next(new Error('Failed to load purchase order ' + id));
        } else {
            req.purchaseorderimage = purchaseorderimage;
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
    db.Purchaseorderimage.create(req.body).then(function (purchaseorderimage) {
        if (!purchaseorderimage) {
            return res.send('/signin', { errors: new StandardError('purchase order image could not be created') });
        } else {
            return res.jsonp(purchaseorderimage);
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
    var purchaseorderimage = req.purchaseorderimage;

    purchaseorderimage.updateAttributes({
       // name: req.body.name,
        imagePath: req.body.imagePath
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
    console.log(req.purchaseorderimage.id)
    var purchaseorderimage = req.purchaseorderimage;
    db.User.destroy({ where: { PurchaseorderimageId: req.purchaseorderimage.id } }).then(function () {
        purchaseorderimage.destroy().then(function () {
            return res.jsonp(purchaseorderimage);
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
    return res.jsonp(req.purchaseorderimage);
};

/**
 * List of department
 */
exports.all = function (req, res) {
    db.Purchaseorderimage.findAll().then(function (purchaseorderimages) {
        return res.jsonp(purchaseorderimages);
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
    if (req.user.PurchaseorderimageId != 1) {
        return res.send(401, 'purchase order image is not authorized ');
    }
    next();
};
