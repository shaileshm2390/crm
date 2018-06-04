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
    var isAdmin = true;
    if (user.Department.name != "Admin") {
        var condition = { where: { UserId: user.id } };
        isAdmin = false;
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
            db.PurchaseOrder.count({
                where: {
                    status: 'completed', RfqId: rfqIds
                }
            }).then(function (completedPurchaseOrder) {
                summary.PendingRqf = summary.TotalRqf - completedPurchaseOrder;
                summary.CompletedRfq = completedPurchaseOrder || 0;

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
};

exports.getRfqChartDetail = function (req, res) {
    var condition = "r.UserId IS NULL";
    var result = {};
    var customQuery = "SELECT COUNT(r.id) AS Count, CONCAT(YEAR(r.createdAt) ,'-', MONTH(r.createdAt)) As Month " +
        "FROM `rfqs` r LEFT JOIN purchaseorders po ON  po.RfqId = r.id " +
        "WHERE {CONDITION} AND r.createdAt > DATE_SUB(now(), INTERVAL 6 MONTH)  GROUP BY YEAR(r.createdAt), MONTH(r.createdAt) DESC";
    db.sequelize.query(customQuery.replace("{CONDITION}", condition), { type: db.sequelize.QueryTypes.SELECT }).then(function (response) {
        result.Open = response;
        condition = "po.status = 'completed'";
        db.sequelize.query(customQuery.replace("{CONDITION}", condition), { type: db.sequelize.QueryTypes.SELECT }).then(function (response) {
            result.Completed = response;
            condition = "po.id IS NULL";
            db.sequelize.query(customQuery.replace("{CONDITION}", condition), { type: db.sequelize.QueryTypes.SELECT }).then(function (response) {
                result.Pending = response;
                return res.jsonp(result);
            });
            
        });
    });
};
