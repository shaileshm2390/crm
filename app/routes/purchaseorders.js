'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    purchaseorders = require('../../app/controllers/purchaseorders');



module.exports = function (app) {
    app.route('/purchaseorders')
        .get(users.requiresLogin, purchaseorders.all)   //users.requiresLogin, 
        .post(users.requiresLogin, purchaseorders.create);  //users.requiresLogin, purchaseorders.hasAuthorization, 

    app.route('/rfq/purchaseorders/:rfqId')
        .get(users.requiresLogin, purchaseorders.purchaseordersByRfqId)
        .put(users.requiresLogin, purchaseorders.update);

    app.route('/purchaseorders/:purchaseorderId')
        .get(users.requiresLogin, purchaseorders.show)  //users.requiresLogin, 
        .put(users.requiresLogin, purchaseorders.update)    //users.requiresLogin, departments.hasAuthorization, 
        .delete(users.requiresLogin, purchaseorders.destroy);   //users.requiresLogin, departments.hasAuthorization, 

    // Finish with setting up the articleId param
    // Note: the articles.article function will be called everytime then it will call the next function.
    app.param('purchaseorderId', purchaseorders.purchaseorder);
    app.param('rfqId', purchaseorders.purchaseorderByRfqId);
};

