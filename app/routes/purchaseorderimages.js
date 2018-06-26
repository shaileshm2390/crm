'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    purchaseorderimages = require('../../app/controllers/purchaseorderimages');



module.exports = function (app) {
    app.route('/purchaseorderimages')
        .get(users.requiresLogin, purchaseorderimages.all)   //users.requiresLogin, 
        .post(users.requiresLogin, purchaseorderimages.create);  //users.requiresLogin, purchaseorders.hasAuthorization, 
    app.route('/purchaseorderimages/:purchaseorderimagesId')
        .get(users.requiresLogin, purchaseorderimages.show)  //users.requiresLogin, 
        .put(users.requiresLogin, purchaseorderimages.update)    //users.requiresLogin, departments.hasAuthorization, 
        //.delete(purchaseorderimages.destroy);   //users.requiresLogin, departments.hasAuthorization, 

    app.route('/purchaseorderimages/:id')
        .delete(users.requiresLogin, purchaseorderimages.destroy);

    // Finish with setting up the articleId param
    // Note: the articles.article function will be called everytime then it will call the next function.
    app.param('purchaseorderimageId', purchaseorderimages.purchaseorderimage);
    app.param('id', purchaseorderimages.purchaseorderimage);
};

