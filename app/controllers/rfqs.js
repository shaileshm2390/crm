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
    db.Rfq.create(req.body).then(function (rfq) {
        return res.jsonp(rfq);
    }).catch(function (err) {
        return res.send('/signin', {
            errors: err,
            status: 500
        });
    });
};

exports.sendInfeasibleMailToCustomer = function (req, res) {
    var mailObject = {
        from: 'info@metaforgeindia.com',
        to: req.body.buyerEmail,
        subject: 'Metaforge - Part Feasibility',
        html: req.body.emailContent
    };
    var attachments = [];
    if (req.body.attachments.length > 0) {
        for (var index = 0; index < req.body.attachments.length; index++) {
            var filenameArr = req.body.attachments[index].split("/");
            attachments.push({
                filename: filenameArr[filenameArr.length - 1],
                path: './public/' + req.body.attachments[index]
            });
        }
    }
    if (attachments.length > 0) {
        mailObject.attachments = attachments;
    }
   

    sm.sendMail(mailObject, function (response) {
        return res.jsonp(response);
    });
};

exports.getReports = function (req, res) {
    var customQuery = 'SELECT r.id, r.subject, r.createdAt, c.data, CONCAT_WS(" ", u.firstName, u.lastName) AS assignedUser, b.name buyerName, b.email buyerEmail, (CASE WHEN (SELECT Count(id) FROM RfqFeasibilities Where RfqId = r.id) > 0 THEN "Done" WHEN (SELECT Count(id) FROM RfqFeasibilities Where RfqId = r.id) = 0 THEN "Pending" END) as  FeasibilityCheck, (SELECT Date(createdAt) FROM CostSheets Where RfqId = r.id  ORDER BY createdAt DESC limit 1 ) as LatestCostsheetPrepared, (SELECT Date(createdAt) FROM CostSheets Where RfqId = r.id AND status="approved" ORDER BY createdAt DESC  limit 1) as LatestCostsheetApproved,  (SELECT Date(createdAt) FROM Quotations Where RfqId = r.id  ORDER BY createdAt DESC limit 1 ) as QuotationsPrepared, (CASE  WHEN (SELECT Count(id) FROM Samplesubmissionimages Where RfqId = r.id) > 0 THEN ( CASE WHEN (SELECT Count(id) FROM Samplesubmissions Where RfqId = r.id) THEN  (SELECT CONCAT_WS(" ", stage, stageProcess) FROM Samplesubmissions Where RfqId = r.id LIMIT 1) ELSE "Drawing" END) ELSE "Pending" END) as  SampleStatus, (SELECT Date(createdAt) FROM PurchaseOrders Where RfqId = r.id  ORDER BY createdAt DESC limit 1) as PurchaseOrder,  (SELECT STATUS  FROM SampleInspectionReports Where RfqId = r.id ORDER BY createdAt DESC limit 1) as SIR, (SELECT Date(createdAt)  FROM HandoverSubmitteds Where RfqId = r.id limit 1) as HandoverSubmitteds, (SELECT expectedLeadTime  FROM DeveloperHandovers Where RfqId = r.id limit 1) as ExpectedLeadTime FROM `Rfqs` r  LEFT JOIN Users u ON u.id = r.UserId LEFT JOIN Buyers b ON b.Id = r.BuyerId LEFT JOIN CostSheets c ON c.RfqId = r.id WHERE DATE(r.createdAt) BETWEEN "' + req.query.fromDate + '" AND "' + req.query.toDate + '" ';

    db.sequelize.query(customQuery, { type: db.sequelize.QueryTypes.SELECT }).then(function (response) {
        return res.jsonp(response);
    });
};

exports.update = function (req, res) {
    if (req.body.UserId === "") {
        req.body.UserId = null;
    }
    var updateObj = {
        UserId: req.body.UserId
    };
    
    db.User.find({ where: { id: req.body.UserId }, include: { model: db.Department, attributes: ['id', 'name'] } }).then(function (user) {
        console.log(user);
        if (user !== null && user.Department.name === 'Marketing') {   
            updateObj.marketingUserId = req.body.UserId;
        }
        var rfq = req.rfq;
        rfq.updateAttributes(updateObj).then(function (a) {
            if (req.body.UserId !== "" && typeof req.body.assignedEmail !== 'undefined' && req.body.assignedEmail !== '') {
                var mailObject = {
                    from: 'info@metaforge.com',
                    to: req.body.assignedEmail,
                    subject: 'Metaforge - RFQ Assigned',
                    html: req.body.emailContent
                };
                sm.sendMail(mailObject, function (response) {
                    console.log("mail sent to " + req.body.assignedEmail);
                });
            }
            return res.jsonp(a);
        }).catch(function (err) {
            return res.render('/signin', {
                error: err,
                status: 500
            });
        });        
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
            },
             {
                 model: db.DeveloperHandover
             },
              {
                  model: db.HandoverSubmitted
              },
             {
                 model: db.SampleInspectionReport
             },
             {
                 model: db.RfqFeasibilities
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

    var user = req.user,
    userCondition = { id: id },
        partCondition = {};
    if (typeof req.query.partId !== "undefined") {
        partCondition = { RfqPartId: req.query.partId};
    }
    if (user.Department.name != "Admin") {
        userCondition.$or = [{ UserId: user.id }, { marketingUserId: user.id }, { UserId: null }];
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
                model: db.CostSheet,
                include: [{ model: db.RfqParts }],
                where: partCondition
            },
            {
                model: db.Quotation
            },
             {
                 model: db.DeveloperHandover
             },
              {
                  model: db.HandoverSubmitted
              },
             {
                 model: db.SampleInspectionReport
             },
             {
                 model: db.RfqFeasibilities
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
            },
             {
                 model: db.DeveloperHandover
             },
              {
                  model: db.HandoverSubmitted
              },
             {
                 model: db.SampleInspectionReport
             },
             {
                 model: db.RfqFeasibilities
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
        where: {
            $or: [{ UserId: id }, { marketingUserId: id }] }, include: [
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
            },
             {
                 model: db.DeveloperHandover
             },
              {
                  model: db.HandoverSubmitted
              },
             {
                 model: db.SampleInspectionReport
             },
             {
                 model: db.RfqFeasibilities
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