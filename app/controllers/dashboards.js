'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
/**
 * List of Summary
 */
exports.all = function (req, res) {
    var user = req.user;    
    var condition = {
        where: { $or: [{ UserId: user.id }, { UserId: null }] }
    };
    if (user.isAdmin) {
        condition = {};
    }
    var summary = {};
    db.Rfq.findAll(condition).then(function (response) {
        summary.TotalRqf = response.length;

        var rfqIds = [];
        response.forEach(function (data) {
            rfqIds.push(data.id);
        });
        db.Rfq.count({ where: { UserId: null } }).then(function (openRfq) {
            summary.OpenRfq = openRfq;
            var completedCondition = {
                where: {
                    status: 'complete', RfqId: rfqIds
                }
            };
            if (user.isAdmin) {
                completedCondition = {
                    where: {
                        status: 'complete'
                    }
                };
            }
            db.PurchaseOrder.count(completedCondition).then(function (completedPurchaseOrder) {
                summary.CompletedRfq = completedPurchaseOrder || 0;

                db.Rfq.count({ where: (user.isAdmin ? { UserId: { $ne: null } }  : { UserId: user.id }) }).then(function (TotalWorkedRqf) {
                    summary.PendingRqf = TotalWorkedRqf - completedPurchaseOrder;

                    if (summary.TotalRqf > 0) {
                        summary.CompletedPercentage = Math.round((summary.CompletedRfq / summary.TotalRqf) * 100);
                        summary.PendingPercentage = Math.round((summary.PendingRqf / summary.TotalRqf) * 100);
                        summary.OpenPercentage = Math.round((summary.OpenRfq / summary.TotalRqf) * 100);
                    } else {
                        summary.CompletedPercentage = 0;
                        summary.PendingPercentage = 0;
                        summary.OpenPercentage = 0;
                    }
                    return res.jsonp(summary);
                });
            });
        });
    });
};

exports.getRfqChartDetail = function (req, res) {
    var condition = "r.UserId IS NULL",
        user = req.user,
        userCondition = "";
    if (user.Department.name != "Admin") {
        userCondition = " AND r.UserId = " + user.id + " ";
    }
    var result = {};
    var customQuery = "SELECT COUNT(r.id) AS Count, CONCAT(YEAR(r.createdAt) ,'-', MONTH(r.createdAt)) As Month " +
        "FROM `Rfqs` r LEFT JOIN PurchaseOrders po ON  po.RfqId = r.id " +
        "WHERE {CONDITION} AND r.createdAt > DATE_SUB(now(), INTERVAL 6 MONTH)  GROUP BY YEAR(r.createdAt), MONTH(r.createdAt) DESC";
    db.sequelize.query(customQuery.replace("{CONDITION}", condition), { type: db.sequelize.QueryTypes.SELECT }).then(function (response) {
        result.Open = response;
        condition = "po.status = 'Complete'" + userCondition;
        db.sequelize.query(customQuery.replace("{CONDITION}", condition), { type: db.sequelize.QueryTypes.SELECT }).then(function (response) {
            result.Completed = response;
            condition = "po.id IS NULL" + userCondition;
            db.sequelize.query(customQuery.replace("{CONDITION}", condition), { type: db.sequelize.QueryTypes.SELECT }).then(function (response) {
                result.Pending = response;
                return res.jsonp(result);
            });
            
        });
    });
};

exports.getRfqPieChartDetail = function (req, res) {
    var condition = "UserId IS NULL",
        user = req.user,
        userCondition = "";
    if (user.Department.name != "Admin") {
        userCondition = " AND UserId = " + user.id + " ";
    }

    var customQuery = "SELECT (SELECT Count(id) FROM `CostSheets` WHERE status='approved' {CONDITION}) as CostsheetPrepared, (SELECT Count(id) FROM `Quotations` WHERE 1=1 {CONDITION}) as Quotations, (SELECT Count(id) FROM `HandoverSubmitteds` WHERE 1=1 {CONDITION}) as SampleSubmitted, (SELECT Count(po.id) FROM `PurchaseOrders` po INNER JOIN Rfqs r ON r.Id = po.RfqId  WHERE 1=1 {CONDITION}) as POReceived, (SELECT Count(id) FROM `DeveloperHandovers` WHERE 1=1 {CONDITION}) as DeveloperHandovers";
    
    db.sequelize.query(customQuery.replace(/{CONDITION}/g, userCondition), { type: db.sequelize.QueryTypes.SELECT}).then(function (response) {    
        return res.jsonp(response[0]);
    });
};

exports.getOpenRfq = function (req, res) {
  
    db.Rfq.findAll({
        where: { UserId: null }, include: [
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
                model: db.RfqFeasibilities
            }
        ]
    }).then(function (rfq) {
        if (!rfq) {
            req.rfq = {};
        } else {
            req.rfq = rfq;
        }
        return res.jsonp(req.rfq);
    }).catch(function (err) {
       // return next(err);
    });
};


exports.getMyRfq = function (req, res) {
    var condition = {
        UserId: {
            $ne: null
        } };
    if (req.user.Department.name != "Admin") {
        condition = { UserId: req.user.id };
    }
    db.Rfq.findAll({
        where: condition, include: [           
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
                model: db.CostSheet,
                order: [['createdAt', 'DESC']],
                limit: 1,
            },
            {
                model: db.PurchaseOrder
            },
            {
                model: db.Samplesubmission,
                order: [['createdAt', 'DESC']],
                limit: 1,
            },
             {
                 model: db.Samplesubmissionimage,
                 order: [['createdAt', 'DESC']],
                 limit: 1,
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
                model: db.Quotation
            },
            {
                model: db.RfqFeasibilities
            }
        ]
    }).then(function (rfq) {
        if (!rfq) {
            req.rfq = {};
        } else {
            req.rfq = rfq;
        }
        return res.jsonp(req.rfq);
    }).catch(function (err) {
        // return next(err);
    });
}
