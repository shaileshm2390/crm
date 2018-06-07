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
        .get(samplestatus.all);
    //    .post(users.requiresLogin, samplestatus.create);

    //app.param('sampleSubmissionId', samplestatus.samplestatus);
};

