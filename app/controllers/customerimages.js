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
    db.CustomerImage.find({ where: { id: id } }).then(function (customerimage) {
        if (!customerimage) {
            req.customerimages = {};
            return next();
        } else {
            req.customerimage = customerimage;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};

exports.all = function (req, res) {
    db.CustomerImage.findAll({ include: [{ model: db.Customer }] }).then(function (customerimages) {
        return res.jsonp(customerimages);
    }).catch(function (err) {
        //return res.render('error', {
        //    error: err,
        //    status: 500
        //});
        console.log(err);
    });
};

exports.imagesByCustomerId = function (req, res, next, id) {
    db.CustomerImage.findAll({ where: { CustomerId: id } }).then(function (customerimages) {
        if (!customerimages) {
            req.customerimages = {};
            return next();
        } else {
            req.customerimages = customerimages;
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
    var sampleFile = req.files;
    sampleFile.file.name = Math.floor(Date.now() / 1000) + "-" + sampleFile.file.name;
    sampleFile.file.mv(__dirname + '/../../public/temp/' + sampleFile.file.name, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            var response = { pathFromRoot : "/temp/" + sampleFile.file.name, success: true };                     
            return res.jsonp(response);  
        }
    });
};
 
exports.destroy = function (req, res) {
    var customerimage = req.customerimage;
    var imagePath = (__dirname + customerimage.imagePath).replace(/\//g, "\\").replace("app\\controllers", "public");
    var fs = require('fs');
    if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, function (err) { });
    }
    customerimage.destroy().then(function () {
        return res.jsonp(customerimage);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

exports.customerImagesByCustomerId = function (req, res) {
    return res.jsonp(req.customerimages);
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
