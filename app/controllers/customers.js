﻿'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
var fs = require('fs');
/**
 * Find customer by id
 * Note: This is called every time that the parameter :customerId is used in a URL.
 * Its purpose is to preload the customer on the req object then call the next function.
 */
exports.customer = function (req, res, next, id) {
    db.Customer.find({
        where: { id: id },
        include: [
            { model: db.CustomerImage }
        ]
    }).then(function (customer) {
        if (!customer) {
            req.customer = {};
            return next();
        } else {
            req.customer = customer;
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
    // augment the customer by adding the UserId
    // save and return and instance of customer on the res object.

    db.Customer.create(req.body).then(function (customer) {
        if (!customer) {
            return res.send('/signin', { errors: new StandardError('Customer could not be created') });
        } else {
            if (req.body.imagesString.trim() !== "") {
                var imageArray = req.body.imagesString.split(",");
                for (var index = 0; index < imageArray.length; index++) {
                    //var oldPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\temp");
                    //var newPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\uploads");

                    //module.exports.move(oldPath, newPath, function () { });
                    var request = {
                        //imagePath: imageArray[index].replace("/temp/", "/uploads/"),
                        imagePath: imageArray[index],
                        CustomerId: customer.id
                    };
                    db.CustomerImage.create(request);
                }                
            }
            return res.jsonp(customer);
        }
    }).catch(function (err) {
        console.log(err);
        //return res.send('/signin', {
        //    errors: err,
        //    status: 500
        //});
        });
};

/**
 * Update a customer
 */
exports.update = function (req, res) {

    // create a new variable to hold the customer that was placed on the req object.
    var customer = req.customer;
    
    customer.updateAttributes({
        email: req.body.email,
        company: req.body.company,
        name: req.body.name,
        contact: req.body.contact,
        payment: req.body.payment,
        tax: req.body.tax,
        freight: req.body.freight,
        packing: req.body.packing,
        validity: req.body.validity,
        terms: req.body.terms
    }).then(function (a) {
        if (req.body.imagesString.trim() !== "") {
            var imageArray = req.body.imagesString.split(",");
            for (var index = 0; index < imageArray.length; index++) {
                //var oldPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\temp");
                //var newPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\uploads");

                //module.exports.move(oldPath, newPath, function () { });
                var request = {
                    //imagePath: imageArray[index].replace("/temp/", "/uploads/"),
                    imagePath: imageArray[index],
                    CustomerId: customer.id
                };
                db.CustomerImage.create(request);
            }
        }
        return res.jsonp(a);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Delete an customer
 */
exports.destroy = function (req, res) {

    // create a new variable to hold the customer that was placed on the req object.
    var customer = req.customer;    
    db.CustomerImage.findAll({ where: { CustomerId: req.customer.id } }).then(function (response) {
        module.exports.deletePhysicalFile(response, function () { });       
    });
    db.CustomerImage.destroy({ where: { CustomerId: req.customer.id } }).then(function () {
        customer.destroy().then(function () {
            db.Customercomment.destroy({ where: { CustomerId: null } });

            db.Buyer.destroy({ where: { CustomerId: null } });
            db.Buyercomment.destroy({ where: { BuyerId: null } });
            // delete buyer images
            db.BuyerImage.findAll({ where: { BuyerId: null } }).then(function (response) {
                module.exports.deletePhysicalFile(response, function () { });
            });
            db.BuyerImage.destroy({ where: { BuyerId: null } });

            db.Rfq.destroy({ where: { BuyerId: null } });
            db.Rfqcomment.destroy({ where: { RfqId: null } });
            db.CostSheet.destroy({ where: { RfqId: null } });
            db.Quotation.destroy({ where: { RfqId: null } });
            db.Samplesubmission.destroy({ where: { RfqId: null } });
            db.PurchaseOrder.destroy({ where: { RfqId: null } });

            // delete rfq images
            db.RfqImage.findAll({ where: { RfqId: null } }).then(function (response) {
                module.exports.deletePhysicalFile(response, function () { });
            });
            db.RfqImage.destroy({ where: { RfqId: null } });

            // delete sample submission images
            db.Samplesubmissionimage.findAll({ where: { SamplesubmissionId: null } }).then(function (response) {
                module.exports.deletePhysicalFile(response, function () { });
            });
            db.Samplesubmissionimage.destroy({ where: { SamplesubmissionId: null } });

            // delete purchase order images
            db.PurchaseOrderImage.findAll({ where: { PurchaseOrderId: null } }).then(function (response) {
                module.exports.deletePhysicalFile(response, function () { });
            });
            db.PurchaseOrderImage.destroy({ where: { PurchaseOrderId: null } });

            return res.jsonp(customer);
        }).catch(function (err) {
            console.log(err);
            //return res.render('error', {
            //    error: err,
            //    status: 500
            //});
        });
    });
};

/**
 * Show an customer
 */
exports.show = function (req, res) {
    // Sending down the customer that was just preloaded by the customers.customer function
    // and saves customer on the req object.
    return res.jsonp(req.customer);
};

/**
 * List of customer
 */
exports.all = function (req, res) {
    db.Customer.findAll({
        include: [
            { model: db.CustomerImage }
        ]
    }).then(function (customers) {
        return res.jsonp(customers);
    }).catch(function (err) {
        //return res.render('error', {
        //    error: err,
        //    status: 500
        //});
        console.log(err);
    });
};

/**
 *customer authorizations routing middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.user.CustomerId != 1) {
        return res.send(401, 'User is not authorized ');
    }
    next();
};

exports.move = function(oldPath, newPath, callback) {

    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                console.log(err);
                //callback(err);
            }
            return;
        }
        callback();
    });

exports.copy = function() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', callback);
        writeStream.on('error', callback);

        readStream.on('close', function () {
            fs.unlink(oldPath, callback);
        });

        readStream.pipe(writeStream);
    }
}

exports.deletePhysicalFile = function (response, callback) {
    for (var index = 0; index < response.length; index++) {
        var imagePath = (__dirname + response[index].imagePath).replace(/\//g, "\\").replace("app\\controllers", "public");
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, function (err) { });
        }
    }
    callback();
};