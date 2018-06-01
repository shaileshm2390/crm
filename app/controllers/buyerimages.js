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
exports.buyerimage = function (req, res, next, id) {
    db.BuyerImage.find({ where: { id: id } }).then(function (buyerimage) {
        if (!buyerimage) {
            req.buyerimage = {};
            return next();
        } else {
            req.buyerimage = buyerimage;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};

exports.all = function (req, res) {
    db.BuyerImage.findAll({ include: [{ model: db.Buyer }] }).then(function (buyerimages) {
        return res.jsonp(buyerimages);
    }).catch(function (err) {
        //return res.render('error', {
        //    error: err,
        //    status: 500
        //});
        console.log(err);
    });
};

exports.imagesByBuyerId = function (req, res, next, id) {
    db.BuyerImage.findAll({ where: { BuyerId: id } }).then(function (buyerImages) {
        if (!buyerImages) {
            req.buyerImages = {};
            return next();
        } else {
            req.buyerImages = buyerImages;
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
    var buyerimage = req.buyerimage;
    var imagePath = (__dirname + buyerimage.imagePath).replace(/\//g, "\\").replace("app\\controllers", "public");
    var fs = require('fs');
    if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, function (err) { });
    }
    buyerimage.destroy().then(function () {
        return res.jsonp(buyerimage);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

exports.buyerImagesByBuyerId = function (req, res) {
    return res.jsonp(req.buyerimages);
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
