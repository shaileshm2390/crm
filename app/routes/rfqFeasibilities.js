'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    rfqFeasibilities = require('../../app/controllers/rfqFeasibilities');

module.exports = function (app) {   
    app.route('/rfqFeasibilities')
        .get(users.requiresLogin, rfqFeasibilities.all)
        .post(users.requiresLogin, rfqFeasibilities.update);
        //.post(users.requiresLogin, rfqFeasibilities.save);

    app.route('/rfqFeasibilities/attachments')
        .post(users.requiresLogin, rfqFeasibilities.uploadattachment);

    app.route('/rfqFeasibilities/rfq/:rfqId')
        .get(users.requiresLogin, rfqFeasibilities.getRfqFeasibilities);
    
    app.param('rfqId', rfqFeasibilities.rfqFeasibilitiesByRfqId);
};

