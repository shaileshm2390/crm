'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    rawMaterialMasters = require('../../app/controllers/rawMaterialMasters');



module.exports = function (app) {
    app.route('/rawmaterials')
        .get(users.requiresLogin, rawMaterialMasters.all)   //users.requiresLogin, 
        .post(users.requiresLogin, rawMaterialMasters.create)  //users.requiresLogin, 
        .post(users.requiresLogin, rawMaterialMasters.add);
    app.route('/rawmaterials/:id')
        .get(users.requiresLogin, rawMaterialMasters.show)  //users.requiresLogin, 
        .put(users.requiresLogin, rawMaterialMasters.update)    //users.requiresLogin, departments.hasAuthorization, 
        .delete(users.requiresLogin, rawMaterialMasters.destroy);   //users.requiresLogin, departments.hasAuthorization, 

    // Finish with setting up the articleId param
    // Note: the articles.article function will be called everytime then it will call the next function.
    app.param('id', rawMaterialMasters.rawMaterialMaster);
};

