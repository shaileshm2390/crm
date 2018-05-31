'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
var _ = require('lodash');
var sm = require("./sendmail");
/**
 * Create a department
 */
exports.create = function (req, res) {
    db.Quotation.create(req.body).then(function (quotation) {
        return res.jsonp(quotation);
    }).catch(function (err) {
        return res.send('/signin', {
            errors: err,
            status: 500
        });
    });
};

//exports.sendMail = function (req, res) {
//    console.log(JSON.stringify(req.costSheet));
//    var result = sm.sendMail({
//        from: 'info@crm.com',
//        to: req.costSheet.Rfq.Buyer.email,
//        subject: 'Cost Sheet',
//        html: '<h1>Hi ' + req.costSheet.Rfq.Buyer.name + ',</h1><p>Your cost sheet are as follow : ' + req.costSheet.data + '</p>'
//    }, function (error, info) {
//        console.log("Result => ", error, info);
//    });

//    return res.jsonp(req.costSheet);
//};

exports.all = function (req, res) {
    db.Quotation.findAll(
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
                },
                {
                    model: db.CostSheet,
                },
            ]
        }).then(function (Quotations) {
            return res.jsonp(Quotations);
        }).catch(function (err) {
            return res.render('error', {
                error: err,
                status: 500
            });
        });
};