'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
var defaultMonthDifference = 6;
/**
 * List of Summary
 */
exports.all = function (req, res) {
    var user = req.user, condition = {}, dateTemp, fromDate, toDate;

    dateTemp = new Date();
    toDate = dateTemp.getFullYear() + "-" + (dateTemp.getMonth() < 10 ? "0" + (dateTemp.getMonth() + 1) : (dateTemp.getMonth() + 1)) + "-" + (dateTemp.getDate() < 10 ? "0" + dateTemp.getDate() : dateTemp.getDate());

    dateTemp.setMonth(dateTemp.getMonth() - defaultMonthDifference);
    fromDate = dateTemp.getFullYear() + "-" + (dateTemp.getMonth() < 10 ? "0" + (dateTemp.getMonth() + 1) : (dateTemp.getMonth() + 1)) + "-" + (dateTemp.getDate() < 10 ? "0" + dateTemp.getDate() : dateTemp.getDate());
    
    if (typeof req.body.fromDate !== 'undefined' && req.body.fromDate !== "") {
        fromDate = req.body.fromDate;
    }
    if (typeof req.body.toDate !== 'undefined' && req.body.toDate !== "") {
        toDate = req.body.toDate;
    }
    condition = {
        where: {
            $or: [{ UserId: user.id }, { UserId: null }, { marketingUserId: user.id }], 
			$and: { createdAt: { $gte: fromDate, $lte: toDate } }
        },
        //logging: console.log,
        //raw: true
    };

    if (user.isAdmin) {
        condition = {
            where: {
                createdAt: { $gte: fromDate, $lte: toDate  }
            }
            , logging: console.log
            //raw: true 
        };
    }
    
    var summary = {};
    db.Rfq.findAll(condition).then(function (response) {
        summary.TotalRqf = response.length;

        var rfqIds = [];
        response.forEach(function (data) {
            rfqIds.push(data.id);
        });
        db.Rfq.count({ where: { UserId: null, createdAt: { createdAt: { $gte: fromDate, $lte: toDate } } } }).then(function (openRfq) {
            summary.OpenRfq = openRfq;
            var completedCondition = {
                where: {
                    status: 'complete', RfqId: rfqIds
                }

            };
            db.PurchaseOrder.count(completedCondition).then(function (completedPurchaseOrder) {
                summary.CompletedRfq = completedPurchaseOrder || 0;

                db.Rfq.count({
                    where: { $or: [{ UserId: user.isAdmin ? { $ne: null } : user.id}, { marketingUserId: user.id }], createdAt: { createdAt: { $gte: fromDate, $lte: toDate  }} }}).then(function (TotalWorkedRqf) {
                    summary.PendingRqf = (TotalWorkedRqf - completedPurchaseOrder) >= 0 ? TotalWorkedRqf - completedPurchaseOrder : 0;

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
        userCondition = "", dateTemp, fromDate, toDate;

    dateTemp = new Date();
    toDate = dateTemp.getFullYear() + "-" + (dateTemp.getMonth() < 10 ? "0" + (dateTemp.getMonth() + 1) : (dateTemp.getMonth() + 1)) + "-" + (dateTemp.getDate() < 10 ? "0" + dateTemp.getDate() : dateTemp.getDate());

    dateTemp.setMonth(dateTemp.getMonth() - defaultMonthDifference);
    fromDate = dateTemp.getFullYear() + "-" + (dateTemp.getMonth() < 10 ? "0" + (dateTemp.getMonth() + 1) : (dateTemp.getMonth() + 1)) + "-" + (dateTemp.getDate() < 10 ? "0" + dateTemp.getDate() : dateTemp.getDate());



    if (typeof req.body.fromDate !== 'undefined' && req.body.fromDate !== "") {
        fromDate = req.body.fromDate;
    }
    if (typeof req.body.toDate !== 'undefined' && req.body.toDate !== "") {
        toDate = req.body.toDate;
    }

    if (user.Department.name !== "Admin") {
        userCondition = " AND (r.UserId = " + user.id + " OR r.marketingUserId = " + user.id + ") ";
    }
    var result = {};
    var customQuery = "SELECT COUNT(r.id) AS Count, DATE_FORMAT(r.createdAt,'%Y-%m') As Month " +
        "FROM `Rfqs` r LEFT JOIN PurchaseOrders po ON  po.RfqId = r.id " +
        "WHERE {CONDITION} AND r.createdAt BETWEEN '" + fromDate + "' AND '" + toDate + "' GROUP BY YEAR(r.createdAt), MONTH(r.createdAt)  ORDER BY YEAR(r.createdAt) ASC, MONTH(r.createdAt) ASC";
	//console.log(customQuery.replace("{CONDITION}", condition));
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
    var user = req.user,
        userCondition = "",
        userConditionBasedOnParts = "",
        toDate, fromDate,
        dateTemp = new Date();

    toDate = dateTemp.getFullYear() + "-" + (dateTemp.getMonth() < 10 ? "0" + (dateTemp.getMonth() + 1) : (dateTemp.getMonth() + 1)) + "-" + (dateTemp.getDate() < 10 ? "0" + dateTemp.getDate() : dateTemp.getDate());

    dateTemp.setMonth(dateTemp.getMonth() - defaultMonthDifference);
    fromDate = dateTemp.getFullYear() + "-" + (dateTemp.getMonth() < 10 ? "0" + (dateTemp.getMonth() + 1) : (dateTemp.getMonth() + 1)) + "-" + (dateTemp.getDate() < 10 ? "0" + dateTemp.getDate() : dateTemp.getDate());
       

    if (typeof req.body.fromDate !== 'undefined' && req.body.fromDate !== "") {
        fromDate = req.body.fromDate;
    }
    if (typeof req.body.toDate !== 'undefined' && req.body.toDate !== "") {
        toDate = req.body.toDate;
    }

    userConditionBasedOnParts = " AND rp.createdAt BETWEEN '" + fromDate + "' AND '" + toDate + "' ";
     
    userCondition = " AND r.createdAt BETWEEN '" + fromDate + "' AND '" + toDate + "' ";
    if (user.Department.name !== "Admin") {
        userCondition += " AND (r.UserId = " + user.id + " OR r.marketingUserId = " + user.id + ") ";
        userConditionBasedOnParts += " AND (r.UserId = " + user.id + " OR r.marketingUserId = " + user.id + ") ";
    }

    var customQuery = "SELECT (SELECT Count(po.id) FROM `CostSheets` po INNER JOIN Rfqs r ON r.Id = po.RfqId INNER JOIN RfqParts rp ON rp.Id = po.RfqPartId WHERE status='approved' {PARTSCONDITION}) as CostsheetPrepared, (SELECT Count(po.id) FROM `Quotations` po INNER JOIN Rfqs r ON r.Id = po.RfqId WHERE 1=1 {CONDITION}) as Quotations, (SELECT Count(po.id) FROM `HandoverSubmitteds` po INNER JOIN Rfqs r ON r.Id = po.RfqId WHERE 1=1 {CONDITION}) as SampleSubmitted, (SELECT Count(po.id) FROM `PurchaseOrders` po INNER JOIN Rfqs r ON r.Id = po.RfqId  WHERE 1=1 {CONDITION}) as POReceived, (SELECT Count(po.id) FROM `DeveloperHandovers`  po INNER JOIN Rfqs r ON r.Id = po.RfqId INNER JOIN RfqParts rp ON rp.Id = po.RfqPartId WHERE 1=1 {PARTSCONDITION}) as DeveloperHandovers";

    //console.log(customQuery.replace(/{CONDITION}/g, userCondition));

    db.sequelize.query(customQuery.replace(/{CONDITION}/g, userCondition).replace(/{PARTSCONDITION}/g, userConditionBasedOnParts), { type: db.sequelize.QueryTypes.SELECT}).then(function (response) {    
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
        condition = {
            $or: [{ UserId: req.user.id }, { marketingUserId: req.user.id }]
        }
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
                model: db.PurchaseOrder
            },
              {
                  model: db.HandoverSubmitted
            },
            {
                model: db.Quotation
            },
            {
                model: db.RfqFeasibilities
            },
            {
                model: db.RfqParts,
                include: [{
                    model: db.CostSheet,
                    order: [['status', 'ASC']],
                    limit: 1,
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
                        model: db.SampleInspectionReport
                    },
                    {
                        model: db.DeveloperHandover
                    }]
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
