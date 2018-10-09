'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    developerhandovers = require('../../app/controllers/developerhandovers');

module.exports = function (app) {   
    app.route('/developerhandovers')
        .get(users.requiresLogin, developerhandovers.all)
        .post(users.requiresLogin, developerhandovers.save);

    app.route('/developerhandovers/rfq/:rfqId')
       .get(users.requiresLogin, developerhandovers.getDeveloperhandovers)

    app.route('/developerhandovers/:id')
        .put(users.requiresLogin, developerhandovers.update)
    
    app.param('rfqId', developerhandovers.developerhandoverByRfqId);
    app.param('id', developerhandovers.developerHandover);
};

