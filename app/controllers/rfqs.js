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
    db.Rfq.find({
        where: { id: id }, include: [
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
            }
        ]
    }).then(function (rfq) {
        if (!rfq) {
            return next(new Error('Failed to load rfq ' + id));
        } else {
            req.rfq = rfq;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};

exports.rfqByBuyer = function (req, res, next, id) {
    db.Rfq.findAll({
        where: { BuyerId: id }, include: [
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
            }
        ]
    }).then(function (rfq) {
        if (!rfq) {
            return next(new Error('Failed to load rfq ' + id));
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
            }
        ]
    }).then(function (rfq) {
        if (!rfq) {
            return next(new Error('Failed to load rfq ' + id));
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


///**
// * Update a Buyer
// */
//exports.update = function (req, res) {
//    // create a new variable to hold the department that was placed on the req object.
//    var buyer = req.buyer;

//    buyer.updateAttributes({
//        name: req.body.name,
//        emai: req.body.email,
//        contact: req.body.contact
//    }).then(function (a) {
//        return res.jsonp(a);
//    }).catch(function (err) {
//        return res.render('error', {
//            error: err,
//            status: 500
//        });
//    });
//};

///**
// * Delete an Buyer
// */
//exports.destroy = function (req, res) {

//    // create a new variable to hold the department that was placed on the req object.    
//    var buyer = req.buyer;

//    buyer.destroy().then(function () {
//        return res.jsonp(buyer);
//    }).catch(function (err) {
//        return res.render('error', {
//            error: err,
//            status: 500
//        });
//    });
//};