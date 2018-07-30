'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    samplesubmissionimages = require('../../app/controllers/samplesubmissionimages');



module.exports = function (app) {
    app.route('/samplesubmissionimages')
        .get(users.requiresLogin, samplesubmissionimages.all)   //users.requiresLogin, 
        .post(users.requiresLogin, samplesubmissionimages.create);  //users.requiresLogin, purchaseorders.hasAuthorization, 
    app.route('/samplesubmissionimages/rfqId/:rfqId')
       .get(users.requiresLogin, samplesubmissionimages.show);   //users.requiresLogin,
    app.route('/samplesubmissionimagesintodb')
        .post(users.requiresLogin, samplesubmissionimages.insert);  //users.requiresLogin, purchaseorders.hasAuthorization, 
    app.route('/samplesubmissionimages/:samplesubmissionimagesId')
        .get(users.requiresLogin, samplesubmissionimages.show)  //users.requiresLogin, 
        .put(users.requiresLogin, samplesubmissionimages.update);   //users.requiresLogin, departments.hasAuthorization, 
        //.delete(samplesubmissionimages.destroy);  //users.requiresLogin, departments.hasAuthorization,
    app.route('/samplesubmissionimages/:id')
        .delete(users.requiresLogin, samplesubmissionimages.destroy);

    // Finish with setting up the articleId param
    // Note: the articles.article function will be called everytime then it will call the next function.
    app.param('samplesubmissionimageId', samplesubmissionimages.samplesubmissionimage);
    app.param('id', samplesubmissionimages.samplesubmissionimage);
    app.param('rfqId', samplesubmissionimages.getByRfqId);
};

