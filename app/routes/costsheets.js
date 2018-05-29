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
        .put(users.requiresLogin, costsheets.update);
    app.route('/rfq/costsheets/:rfqId')
        .get(costsheets.costsheetsByRfqId)
    app.route('/costsheets')
        .get(users.requiresLogin, costsheets.all)
        .post(users.requiresLogin, costsheets.create);
    app.route('/costsheets/mail/:id')
        .post(users.requiresLogin, costsheets.sendMail);
        

    app.param('id', costsheets.costsheet);
    app.param('rfqId', costsheets.costsheetByRfqId);
};

