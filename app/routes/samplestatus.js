'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    samplestatus = require('../../app/controllers/samplestatus');



module.exports = function (app) {
    // customercomments Routes
    //app.route('/samplestatus/:sampleSubmissionId')
    //    .get(samplestatus.sampleStatusBySampleStatusId)
    app.route('/samplestatus')
        .get(users.requiresLogin, samplestatus.all);
    app.route('/samplestatus/rfq/:rfqId')
        .get(users.requiresLogin, samplestatus.samplestatus);
    app.route('/samplestatus/:id')
        .get(users.requiresLogin, samplestatus.samplestatusById)
        .put(users.requiresLogin, samplestatus.update);
    //    .post(users.requiresLogin, samplestatus.create);

    app.param('rfqId', samplestatus.byRfqId);
    app.param('id', samplestatus.byId);
};

