'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    purchaseorderimages = require('../../app/controllers/purchaseorderimages');



module.exports = function (app) {
    // Department Routes
    app.route('/purchaseorderimages')
    .get(purchaseorderimages.all)   //users.requiresLogin, 
        .post(purchaseorderimages.create);  //users.requiresLogin, purchaseorders.hasAuthorization, 
    app.route('/purchaseorderimages/:purchaseorderimagesId')
        .get(purchaseorderimages.show)  //users.requiresLogin, 
        .put(purchaseorderimages.update)    //users.requiresLogin, departments.hasAuthorization, 
        .delete(purchaseorderimages.destroy);   //users.requiresLogin, departments.hasAuthorization, 

    // Finish with setting up the articleId param
    // Note: the articles.article function will be called everytime then it will call the next function.
    app.param('purchaseorderimageId', purchaseorderimages.purchaseorderimage);
};

