'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    purchaseorders = require('../../app/controllers/purchaseorders');



module.exports = function (app) {
    // Department Routes
    app.route('/purchaseorders')
        //.get(purchaseorders.all)   //users.requiresLogin, 
        .post(purchaseorders.create);  //users.requiresLogin, purchaseorders.hasAuthorization, 
    app.route('/purchaseorders/:purchaseorderId')
        .get(purchaseorders.show)  //users.requiresLogin, 
        .put(purchaseorders.update)    //users.requiresLogin, departments.hasAuthorization, 
        .delete(purchaseorders.destroy);   //users.requiresLogin, departments.hasAuthorization, 

    // Finish with setting up the articleId param
    // Note: the articles.article function will be called everytime then it will call the next function.
    app.param('purchaseorderId', purchaseorders.purchaseorder);
};

