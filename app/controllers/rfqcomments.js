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
    db.Rfqcomment.create(req.body).then(function (rfqcomment) {
        return res.jsonp(rfqcomment);
    }).catch(function (err) {
        return res.send('/signin', {
            errors: err,
            status: 500
        });
    });
};

exports.all = function (req, res) {
    db.Rfqcomment.findAll(
        {
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'email', 'firstName', 'lastName']
                },
                {
                    model: db.Rfq,
                    include: [
                        {
                            model: db.Buyer,
                            include: [
                                {
                                    model: db.Customer
                                }
                            ]
                        }
                    ]
                }
            ]
        }).then(function (rfqcomments) {
        return res.jsonp(rfqcomments);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

exports.rfqcomment = function (req, res, next, id) {
    db.Rfqcomment.findAll({
        where: { RfqId: id },
        include: [
            {
                model: db.User,
                attributes: ['id', 'email', 'firstName', 'lastName']
            },
            {
                model: db.Rfq,
                include: [
                    {
                        model: db.Buyer,
                        include: [
                            {
                                model: db.Customer
                            }
                        ]
                    }
                ]
            }
        ]
    }).then(function (rfqcomment) {
        if (!rfqcomment) {
            return next(new Error('Failed to load rfqcomment ' + id));
        } else {
            req.rfqcomment = rfqcomment;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};


exports.rfqCommentByRfqId = function (req, res) {
    return res.jsonp(req.rfqcomment);
};