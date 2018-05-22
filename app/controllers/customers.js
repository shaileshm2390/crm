'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');

/**
 * Find customer by id
 * Note: This is called every time that the parameter :customerId is used in a URL.
 * Its purpose is to preload the customer on the req object then call the next function.
 */
exports.customer = function (req, res, next, id) {
    console.log('id => ' + id);
    db.Customer.find({ where: { id: id } }).then(function (customer) {
        if (!customer) {
            return next(new Error('Failed to load customer ' + id));
        } else {
            req.customer = customer;
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
    // augment the customer by adding the UserId
    // save and return and instance of customer on the res object.
    db.Customer.create(req.body).then(function (customer) {
        if (!customer) {
            return res.send('/signin', { errors: new StandardError('Customer could not be created') });
        } else {
            return res.jsonp(customer);
        }
    }).catch(function (err) {
        return res.send('/signin', {
            errors: err,
            status: 500
        });
    });
};

/**
 * Update a customer
 */
exports.update = function (req, res) {

    // create a new variable to hold the customer that was placed on the req object.
    var customer = req.customer;

    customer.updateAttributes({
        email: req.body.email,
        company: req.body.company,
        name: req.body.name,
        contact: req.body.contact
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
 * Delete an customer
 */
exports.destroy = function (req, res) {

    // create a new variable to hold the customer that was placed on the req object.
    var customer = req.customer;

    customer.destroy().then(function () {
        return res.jsonp(customer);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Show an customer
 */
exports.show = function (req, res) {
    // Sending down the customer that was just preloaded by the customers.customer function
    // and saves customer on the req object.
    return res.jsonp(req.customer);
};

/**
 * List of customer
 */
exports.all = function (req, res) {
    db.Customer.findAll().then(function (customers) {
        return res.jsonp(customers);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 *customer authorizations routing middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.user.CustomerId != 1) {
        return res.send(401, 'User is not authorized ');
    }
    next();
};
