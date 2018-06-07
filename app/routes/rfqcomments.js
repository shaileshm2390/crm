'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    rfqcomments = require('../../app/controllers/rfqcomments');



module.exports = function (app) {
    // customercomments Routes
    app.route('/rfqcomments/:rfqId')
        .get(users.requiresLogin, rfqcomments.rfqCommentByRfqId)
    app.route('/rfqcomments')
        .get(users.requiresLogin, rfqcomments.all)
        .post(users.requiresLogin, rfqcomments.create);
    app.param('rfqId', rfqcomments.rfqcomment);
};

