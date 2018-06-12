'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function (app) {
// User Routes
    var users = require('../../app/controllers/users');
     
// User Routes
    app.get('/signout', users.signout);
    app.get('/users/me', users.me);
    app.route('/users')
        .get(users.all)
        .post(users.requiresLogin, users.create);
    app.route('/users/:userId')
        .get(users.requiresLogin, users.show)
        .put(users.requiresLogin, users.hasAuthorization, users.update)
        .delete(users.requiresLogin, users.hasAuthorization, users.destroy);
    app.get('/users/reset/:userId', users.requiresLogin, users.hasAuthorization, users.resetPassword);     

// Setting up the users api
  //  app.post('/users', users.create);

// Setting the local strategy route
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);


    // Setting social authentication routes

// Setting the facebook oauth route

    app.post('/auth/facebook/token', users.facebookUser);


    app.post('/auth/google', users.googleSocailUser);

    // Setting the twitter oauth route
    app.post('/auth/twitter', users.twitterSocialUser);

    // Finish with setting up the userId param
    app.param('userId', users.user);


};

