'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    costsheets = require('../../app/controllers/costsheets');



module.exports = function (app) {
    // customercomments Routes
    app.route('/costsheets/:id')
        .get(costsheets.costsheetById)
    app.route('/costsheets/:rfqId')
        .get(costsheets.costsheetsByRfqId)
    app.route('/costsheets')
        .get(users.requiresLogin, costsheets.all)
        .post(users.requiresLogin, costsheets.create);

    app.param('id', costsheets.costsheet);
    app.param('rfqId', costsheets.costsheetByRfqId);
};

