'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    buyerimages = require('../../app/controllers/buyerimages');

module.exports = function (app) {
    // Department Routes
    app.route('/buyerimages')
        .get(buyerimages.all)
        .post(buyerimages.create);  //users.requiresLogin, 
    app.route('/buyerimages/:buyerId')
        .get(buyerimages.buyerImagesByBuyerId);
    app.route('/buyerimages/:id')
        .delete(buyerimages.destroy);

    app.param('buyerId', buyerimages.imagesByBuyerId);
    app.param('id', buyerimages.buyerimage);
};

