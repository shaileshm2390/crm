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
    db.Buyercomment.create(req.body).then(function (buyercomment) {
        return res.jsonp(buyercomment);
    }).catch(function (err) {
        return res.send('/signin', {
            errors: err,
            status: 500
        });
    });
};

exports.all = function (req, res) {
    db.Buyercomment.findAll({ include: [{ model: db.User, attributes: ['id', 'email', 'firstName', 'lastName'] }, { model: db.Buyer, attributes: ['id', 'name', 'contact', 'email'] }] }).then(function (buyercomments) {
        return res.jsonp(buyercomments);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

exports.buyercomment = function (req, res, next, id) {
    db.Buyercomment.findAll({
        where: { BuyerId: id }, include: [{ model: db.User, attributes: ['id', 'email', 'firstName', 'lastName'] }, { model: db.Buyer, attributes: ['id', 'name', 'contact', 'email'] }]
    }).then(function (buyercomment) {
        if (!buyercomment) {
            return next(new Error('Failed to load buyercomment ' + id));
        } else {
            req.buyercomment = buyercomment;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};


exports.buyerCommentByBuyerId = function (req, res) {
    return res.jsonp(req.buyercomment);
};