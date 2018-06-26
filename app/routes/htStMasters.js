'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    htStMasters = require('../../app/controllers/htStMasters');



module.exports = function (app) {
    app.route('/htstmasters')
        .get(users.requiresLogin, htStMasters.all)
        .post(users.requiresLogin, htStMasters.create);

    app.route('/htstmasters/:id')
        .get(users.requiresLogin, htStMasters.show)  
        .put(users.requiresLogin, htStMasters.update)    
        .delete(users.requiresLogin, htStMasters.destroy); 

    app.param('id', htStMasters.htStMaster);
};

