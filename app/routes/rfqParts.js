'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    rfqParts = require('../../app/controllers/rfqParts');

module.exports = function (app) {
    app.route('/rfqParts')
        .post(users.requiresLogin, rfqParts.update);
        //.get(users.requiresLogin, rfqParts.all)
    //.post(users.requiresLogin, rfqFeasibilities.save);

    //app.route('/rfqParts/attachments')
    //    .post(users.requiresLogin, rfqFeasibilities.uploadattachment);

    app.route('/rfqParts/all')
        .get(users.requiresLogin, rfqParts.getAllRfqParts);

    app.route('/rfqParts/:rfqId')
        .get(users.requiresLogin, rfqParts.getRfqParts);
        
    app.route('/rfqParts/delete/:partId')
        .delete(users.requiresLogin, rfqParts.destroy);
	app.route('/rfqParts/detail/:id')
        .get(users.requiresLogin, rfqParts.getPartDetail);

    app.param('rfqId', rfqParts.rfqPartsByRfqId);
    app.param('partId', rfqParts.rfqPartsByPartId);
	app.param('id', rfqParts.rfqGetPartDetailById);
};