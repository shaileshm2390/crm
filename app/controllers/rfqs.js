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
    db.Rfq.create(req.body).then(function (rfq) {
        return res.jsonp(rfq);
    }).catch(function (err) {
        return res.send('/signin', {
            errors: err,
            status: 500
        });
    });
};

exports.update = function (req, res) {
    if (req.body.UserId == "") {
        req.body.UserId = null;
    }
    var rfq = req.rfq;
    rfq.updateAttributes({
        UserId: req.body.UserId        
    }).then(function (a) {
        return res.jsonp(a);
    }).catch(function (err) {
        return res.render('/signin', {
            error: err,
            status: 500
        });
    });
};

exports.updateFeasiblity = function (req, res) {
    if (req.body.Feasiblity == "") {
        req.body.Feasiblity = null;
    }
    var rfq = req.rfq;
    rfq.updateAttributes({
        feasiblity: req.body.Feasiblity
    }).then(function (a) {
        return res.jsonp(a);
    }).catch(function (err) {
        return res.render('/signin', {
            error: err,
            status: 500
        });
    });
};

exports.all = function (req, res) {
    db.Rfq.findAll({
        include: [
            {
                model: db.User,
                attributes: ['id', 'email', 'firstName', 'lastName']
            },
            {
                model: db.Buyer,
                attributes: ['id', 'name', 'contact', 'email', 'CustomerId'],
                include: [{ model: db.Customer, attributes: ['id', 'name', 'email', 'company', 'contact'] }]
            },
            {
                model: db.RfqImage
            },
            {
                model: db.Samplesubmission
            },
            {
                model: db.PurchaseOrder
            },
            {
                model: db.CostSheet
            },
            {
                model: db.Quotation
            }
        ]
    }).then(function (rfqs) {
        return res.jsonp(rfqs);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

exports.rfq = function (req, res, next, id) {
    var user = req.user;
    var userCondition = { id: id }
    if (user.Department.name != "Admin") {
        userCondition.$or = [{ UserId: user.id }, { UserId: null }];
    }
    db.Rfq.find({
        where: userCondition, include: [
            {
                model: db.User,
                attributes: ['id', 'email', 'firstName', 'lastName']
            },
            {
                model: db.Buyer,
                attributes: ['id', 'name', 'contact', 'email', 'CustomerId'],
                include: [{ model: db.Customer}]
            },
            {
                model: db.RfqImage
            },
            {
                model: db.Samplesubmission
            },
            {
                model: db.PurchaseOrder
            },
            {
                model: db.CostSheet
            },
            {
                model: db.Quotation
            }
        ]
    }).then(function (rfq) {
        if (!rfq) {
            req.rfq = {};
            return next();
        } else {
            req.rfq = rfq;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};

exports.rfqByBuyer = function (req, res, next, id) {
    var user = req.user;
    var userCondition = { BuyerId: id}
    if (user.Department.name != "Admin") {
        userCondition.$or = [{ UserId: user.id }, { UserId: null }];
    }
    db.Rfq.findAll({
        where: userCondition, include: [
            {
                model: db.User,
                attributes: ['id', 'email', 'firstName', 'lastName']
            },
            {
                model: db.Buyer,
                attributes: ['id', 'name', 'contact', 'email', 'CustomerId'],
                include: [{ model: db.Customer, attributes: ['id', 'name', 'email', 'company', 'contact'] }]
            },
            {
                model: db.RfqImage
            },
            {
                model: db.Samplesubmission
            },
            {
                model: db.PurchaseOrder
            },
            {
                model: db.CostSheet
            },
            {
                model: db.Quotation
            }
        ]
    }).then(function (rfq) {
        if (!rfq) {
            req.rfq = {};
            return next();
        } else {
            req.rfq = rfq;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};

exports.rfqByUser = function (req, res, next, id) {
    db.Rfq.findAll({
        where: { UserId: id }, include: [
            {
                model: db.User,
                attributes: ['id', 'email', 'firstName', 'lastName']
            },
            {
                model: db.Buyer,
                attributes: ['id', 'name', 'contact', 'email', 'CustomerId'],
                include: [{ model: db.Customer, attributes: ['id', 'name', 'email', 'company', 'contact'] }]
            },
            {
                model: db.RfqImage
            },
            {
                model: db.Samplesubmission
            },
            {
                model: db.PurchaseOrder
            },
            {
                model: db.CostSheet
            },
            {
                model: db.Quotation
            }
        ]
    }).then(function (rfq) {
        if (!rfq) {
            req.rfq = {};
            return next();
        } else {
            req.rfq = rfq;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};

exports.rfqs = function (req, res) {
    return res.jsonp(req.rfq);
};