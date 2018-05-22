'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    buyers = require('../../app/controllers/buyers');



module.exports = function (app) {
    // customercomments Routes
    app.route('/buyers/:customerId')
        .get(users.requiresLogin, buyers.buyerByCustomerId);
    app.route('/buyers/edit/:buyerId')
        .get(users.requiresLogin, buyers.buyerById)
        .put(users.requiresLogin, buyers.update)
        .delete (users.requiresLogin, buyers.destroy);  
    app.route('/buyers')
        .get(users.requiresLogin, buyers.all)
        .post(users.requiresLogin, buyers.create);

    app.param('customerId', buyers.buyer);
    app.param('buyerId', buyers.buyerEdit);
};

