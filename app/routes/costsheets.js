'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    costsheets = require('../../app/controllers/costsheets');



module.exports = function (app) {
    // customercomments Routes
    app.route('/costsheets/:id')
        .get(users.requiresLogin, costsheets.costsheetById)
        .put(users.requiresLogin, costsheets.update);
    app.route('/rfq/costsheets/:rfqId')
        .get(users.requiresLogin, costsheets.costsheetsByRfqId)
    app.route('/costsheets')
        .get(users.requiresLogin, costsheets.all)
        .post(users.requiresLogin, costsheets.create);
    app.route('/costsheets/mail/:id')
        .post(users.requiresLogin, costsheets.sendMail);
    app.route('/rfq/costsheets/approved/:costsheetId')
        .get(users.requiresLogin, costsheets.costsheetById);
    //app.route('/rfq/costsheets/:rfqId2/:partid')
    //    .get(users.requiresLogin, costsheets.costsheetsByRfqIdAndPartId);
    app.route('/rfq/costsheets/copycostsheet/:copyPartId')
        .get(users.requiresLogin, costsheets.copyCostsheetByPartId);



    app.param('id', costsheets.costsheet);
    app.param('rfqId', costsheets.costsheetByRfqId);
    app.param('costsheetId', costsheets.approvedCostsheetByRfqId);
    app.param('copyPartId', costsheets.copyCostsheetById);
    //app.param('rfqId2', function (req, res, next, id) { req.rfqId2 = id; });
    //app.param('partid', function (req, res, next, id) { req.partId = id; });
};

