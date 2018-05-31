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
    db.Buyer.create(req.body).then(function (buyer) {
        return res.jsonp(buyer);
    }).catch(function (err) {
        return res.send('/signin', {
            errors: err,
            status: 500
        });
    });
};

exports.all = function (req, res) {
    db.Buyer.findAll({
        include: [
            { model: db.Customer, attributes: ['id', 'name', 'company', 'email'] },
            { model: db.BuyerImage }
        ]}).then(function (buyers) {
        return res.jsonp(buyers);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

exports.buyer = function (req, res, next, id) {
    db.Buyer.findAll({
        where: { CustomerId: id }, include: [
            { model: db.Customer, attributes: ['id', 'name', 'company', 'email'] },
            { model: db.BuyerImage }
        ]
    }).then(function (buyer) {
        if (!buyer) {
            req.buyer = {};
            return next();
        } else {
            req.buyer = buyer;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};

exports.buyerEdit = function (req, res, next, id) {
    db.Buyer.find({
        where: { id: id }, include: [
            { model: db.Customer, attributes: ['id', 'name', 'company', 'email'] },
            { model: db.BuyerImage }
        ]
    }).then(function (buyer) {
        if (!buyer) {
            req.buyer = {};
            return next();
        } else {
            req.buyer = buyer;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};


exports.buyerByCustomerId = function (req, res) {
    return res.jsonp(req.buyer);
};

exports.buyerById = function (req, res) {
    return res.jsonp(req.buyer);
};


/**
 * Update a Buyer
 */
exports.update = function (req, res) {
    // create a new variable to hold the department that was placed on the req object.
    var buyer = req.buyer;

    buyer.updateAttributes({
        name: req.body.name,
        emai: req.body.email,
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
 * Delete an Buyer
 */
exports.destroy = function (req, res) {

    // create a new variable to hold the department that was placed on the req object.    
    var buyer = req.buyer;
    
    buyer.destroy().then(function () {
        console.log("in buyer destroy!!");
        return res.jsonp(buyer);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};