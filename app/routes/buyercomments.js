'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    buyercomments = require('../../app/controllers/buyercomments');



module.exports = function (app) {
    // customercomments Routes
    app.route('/buyercomments/:buyerId')
        .get(users.requiresLogin, buyercomments.buyerCommentByBuyerId)
    app.route('/buyercomments')
        .get(users.requiresLogin, buyercomments.all)
        .post(users.requiresLogin, buyercomments.create);

    app.param('buyerId', buyercomments.buyercomment);
};

