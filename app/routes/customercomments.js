'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    customercomments = require('../../app/controllers/customercomments');



module.exports = function (app) {
    // customercomments Routes
    app.route('/customercomments/:customerId')
        .get(users.requiresLogin,customercomments.customerCommentByCustomerId)
    app.route('/customercomments')
        .get(users.requiresLogin, customercomments.all)
        .post(users.requiresLogin, customercomments.create);
    app.param('customerId', customercomments.customercomment);
};

