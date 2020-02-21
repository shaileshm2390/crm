'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    rfqParts = require('../../app/controllers/rfqParts');

module.exports = function (app) {
    //app.route('/rfqParts')
    //    .get(users.requiresLogin, rfqParts.all)
    //    .post(users.requiresLogin, rfqParts.update);
    ////.post(users.requiresLogin, rfqFeasibilities.save);

    //app.route('/rfqParts/attachments')
    //    .post(users.requiresLogin, rfqFeasibilities.uploadattachment);

    app.route('/rfqParts/rfq/:rfqId')
        .get(users.requiresLogin, rfqParts.getRfqParts);

    app.param('rfqId', rfqParts.rfqPartsByRfqId);
};