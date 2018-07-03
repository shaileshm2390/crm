'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
var _ = require('lodash');
var sm = require("./sendmail");

const request = require('request');
var ipAddress;
request('http://api.ipstack.com/check?access_key=a0a80aaea559ceb4d5ebacc03c30f6d3', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    ipAddress = body.ip;
});

/**
 * Create a department
 */
exports.create = function (req, res) {

    db.CostSheet.create(req.body).then(function (costSheet) {
        var fullUrl = req.originalUrl; //req.protocol + '://' + req.get('host') + req.originalUrl;

        db.Watchdog.create({
            message: "New Costsheet created",
            ipAddress: ipAddress,
            pageUrl: fullUrl,
            userId: costSheet.UserId,
            previousData: "",
            updatedData: JSON.stringify(costSheet)
        });
        return res.jsonp(costSheet);
    }).catch(function (err) {
        //return res.send('/signin', {
        //    errors: err,
        //    status: 500
        //});
        console.log(err);
    });
};

exports.approvedCostsheetByRfqId = function (req, res, next, id) {
    db.CostSheet.find({
        where: { RfqId: id},
        order: [['createdAt', 'DESC']],
        limit: 1,
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
                                model: db.Customer,
                                required: false
                            }
                        ],
                        required: false
                    }
                ]
            }
        ]
    }).then(function (costSheet) {
        if (!costSheet) {
            req.costSheet = {};
            return next();
        } else {
            req.costSheet = costSheet;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
}


exports.sendMail = function (req, res) {
    var result = sm.sendMail({
        from: 'info@crm.com',
        to: req.costSheet.Rfq.Buyer.email,
        subject: 'Cost Sheet',
        html: '<h1>Hi ' + req.costSheet.Rfq.Buyer.name + ',</h1><p>Your cost sheet are as follow : ' + req.costSheet.data + '</p>'
    }, function(error, info) {
        console.log("Result => ", error, info);
    });    
    
    return res.jsonp(req.costSheet);
};

exports.update = function (req, res) {

    // create a new variable to hold the department that was placed on the req object.
    var costSheet = req.costSheet;

    costSheet.updateAttributes({
        status: req.body.status
    }).then(function (a) {
        return res.jsonp(a);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

exports.all = function (req, res) {
    db.CostSheet.findAll(
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
        }).then(function (CostSheets) {
            return res.jsonp(CostSheets);
        }).catch(function (err) {
            return res.render('error', {
                error: err,
                status: 500
            });
        });
};

exports.costsheetByRfqId = function (req, res, next, id) {
    db.CostSheet.findAll({
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
    }).then(function (costSheets) {
        if (!costSheets) {
            return next(new Error('Failed to load CostSheet ' + id));
        } else {
            req.costSheets = costSheets;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};



exports.costsheet = function (req, res, next, id) {
    db.CostSheet.find({
        where: { id: id },
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
                                model: db.Customer,
                                required: false
                            }
                        ],
                        required: false
                    }
                ]
            }
        ]
    }).then(function (costSheet) {
        if (!costSheet) {
            req.costSheet = {};
            return next();
        } else {
            req.costSheet = costSheet;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};

exports.costsheetsByRfqId = function (req, res) {
    return res.jsonp(req.costSheets);
};


exports.costsheetById = function (req, res) {
    return res.jsonp(req.costSheet);
};