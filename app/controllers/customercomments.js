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
    db.Customercomment.create(req.body).then(function (customercomment) {
        return res.jsonp(customercomment);
    }).catch(function (err) {
        return res.send('/signin', {
            errors: err,
            status: 500
        });
    });
};

exports.all = function (req, res) {
    db.Customercomment.findAll({ include: [{ model: db.User, attributes: ['id', 'email', 'firstName', 'lastName'] }, { model: db.Customer, attributes: ['id', 'name', 'company', 'email'] }] }).then(function (customercomments) {
        return res.jsonp(customercomments);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

exports.customercomment = function (req, res, next, id) {
    db.Customercomment.findAll({
        where: { CustomerId: id }, include: [{ model: db.User, attributes: ['id', 'email', 'firstName', 'lastName'] }, { model: db.Customer, attributes: ['id', 'name', 'company', 'email'] }]
    }).then(function (customercomment) {
        if (!customercomment) {
            return next(new Error('Failed to load customercomment ' + id));
        } else {
            req.customercomment = customercomment;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};


exports.customerCommentByCustomerId = function (req, res) {
    return res.jsonp(req.customercomment);
};