'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');

/**
 * Find customer by id
 * Note: This is called every time that the parameter :customerId is used in a URL.
 * Its purpose is to preload the customer on the req object then call the next function.
 */
exports.customerimage = function (req, res, next, id) {
    console.log('id => ' + id);
    db.Customerimage.find({ where: { id: id } }).then(function (customerimage) {
        if (!customerimage) {
            return next(new Error('Failed to load customer image ' + id));
        } else {
            req.customerimage = customerimage;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};

/**
 * Create a department
 */
exports.create = function (req, res) {
  
        console.log("Uploaded image  -->  ", req.files);
       
};






/**
 *customer authorizations routing middleware
 */
//exports.hasAuthorization = function (req, res, next) {
//    if (req.user.CustomerId != 1) {
//        return res.send(401, 'User is not authorized ');
//    }
//    next();
//};
