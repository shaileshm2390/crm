'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
    packingAndForwardings = require('../../app/controllers/packingAndForwardings');



module.exports = function (app) {
    app.route('/packingAndForwardings')
        .get(users.requiresLogin, packingAndForwardings.all)
        .post(users.requiresLogin, packingAndForwardings.create)
        .post(users.requiresLogin, packingAndForwardings.add);
    app.route('/packingAndForwardings/:id')
        .get(users.requiresLogin, packingAndForwardings.show)  
        .put(users.requiresLogin, packingAndForwardings.update)    
        .delete(users.requiresLogin, packingAndForwardings.destroy); 

    app.param('id', packingAndForwardings.packingAndForwarding);
};

