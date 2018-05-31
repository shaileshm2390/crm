'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    quotations = require('../../app/controllers/quotations');



module.exports = function (app) {   
    app.route('/quotations')
        .get(users.requiresLogin, quotations.all)
        .post(users.requiresLogin, quotations.create);


    //app.param('id', costsheets.costsheet);
    //app.param('rfqId', costsheets.costsheetByRfqId);
    //app.param('costsheetId', costsheets.approvedCostsheetByRfqId);
};

