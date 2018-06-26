'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    buyerimages = require('../../app/controllers/buyerimages');

module.exports = function (app) {
    app.route('/buyerimages')
        .get(users.requiresLogin, buyerimages.all)
        .post(users.requiresLogin, buyerimages.create);  //users.requiresLogin, 
    app.route('/buyerimages/:buyerId')
        .get(users.requiresLogin, buyerimages.buyerImagesByBuyerId);
    app.route('/buyerimages/:id')
        .delete(users.requiresLogin, buyerimages.destroy);

    app.param('buyerId', buyerimages.imagesByBuyerId);
    app.param('id', buyerimages.buyerimage);
};

