'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    samplesubmissionimages = require('../../app/controllers/samplesubmissionimages');



module.exports = function (app) {
    // Department Routes
    app.route('/samplesubmissionimages')
    .get(samplesubmissionimages.all)   //users.requiresLogin, 
    .post(samplesubmissionimages.create);  //users.requiresLogin, purchaseorders.hasAuthorization, 
    app.route('/samplesubmissionimages/:samplesubmissionimagesId')
        .get(samplesubmissionimages.show)  //users.requiresLogin, 
        .put(samplesubmissionimages.update);   //users.requiresLogin, departments.hasAuthorization, 
        //.delete(samplesubmissionimages.destroy);  //users.requiresLogin, departments.hasAuthorization,
    app.route('/samplesubmissionimages/:id')
        .delete(samplesubmissionimages.destroy);

    // Finish with setting up the articleId param
    // Note: the articles.article function will be called everytime then it will call the next function.
    app.param('samplesubmissionimageId', samplesubmissionimages.samplesubmissionimage);
    app.param('id', samplesubmissionimages.samplesubmissionimage);
};

