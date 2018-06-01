'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
var _ = require('lodash');
var fs = require('fs');
/**
 * Create a department
 */
exports.create = function (req, res) {
    db.Buyer.create(req.body).then(function (buyer) {
        if (!buyer) {
            return res.send('/signin', { errors: new StandardError('Customer could not be created') });
        } else {
            if (req.body.imagesString.trim() !== "") {
                var imageArray = req.body.imagesString.split(",");
                for (var index = 0; index < imageArray.length; index++) {
                    var oldPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\temp");
                    var newPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\uploads");

                    module.exports.move(oldPath, newPath, function () { });
                    var request = {
                        imagePath: imageArray[index].replace("/temp/", "/uploads/"),
                        BuyerId: buyer.id
                    };
                    db.BuyerImage.create(request);
                }
            }
            return res.jsonp(buyer);
        }
    }).catch(function (err) {
        return res.send('/signin', {
            errors: err,
            status: 500
        });
    });
};

exports.all = function (req, res) {
    db.Buyer.findAll({
        include: [
            { model: db.Customer, attributes: ['id', 'name', 'company', 'email'] },
            { model: db.BuyerImage }
        ]}).then(function (buyers) {
        return res.jsonp(buyers);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

exports.buyer = function (req, res, next, id) {
    db.Buyer.findAll({
        where: { CustomerId: id }, include: [
            { model: db.Customer, attributes: ['id', 'name', 'company', 'email'] },
            { model: db.BuyerImage }
        ]
    }).then(function (buyer) {
        if (!buyer) {
            req.buyer = {};
            return next();
        } else {
            req.buyer = buyer;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};

exports.buyerEdit = function (req, res, next, id) {
    db.Buyer.find({
        where: { id: id }, include: [
            { model: db.Customer, attributes: ['id', 'name', 'company', 'email'] },
            { model: db.BuyerImage }
        ]
    }).then(function (buyer) {
        if (!buyer) {
            req.buyer = {};
            return next();
        } else {
            req.buyer = buyer;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};


exports.buyerByCustomerId = function (req, res) {
    return res.jsonp(req.buyer);
};

exports.buyerById = function (req, res) {
    return res.jsonp(req.buyer);
};


/**
 * Update a Buyer
 */
exports.update = function (req, res) {
    // create a new variable to hold the department that was placed on the req object.
    var buyer = req.buyer;

    buyer.updateAttributes({
        name: req.body.name,
        emai: req.body.email,
        contact: req.body.contact
    }).then(function (a) {
        if (req.body.imagesString.trim() !== "") {
            var imageArray = req.body.imagesString.split(",");
            for (var index = 0; index < imageArray.length; index++) {
                var oldPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\temp");
                var newPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\uploads");

                module.exports.move(oldPath, newPath, function () { });
                var request = {
                    imagePath: imageArray[index].replace("/temp/", "/uploads/"),
                    BuyerId: buyer.id
                };
                db.BuyerImage.create(request);
            }
        }
        return res.jsonp(a);
        }).catch(function (err) {
            console.log(err);
        //return res.render('error', {
        //    error: err,
        //    status: 500
        //});
    });
};

/**
 * Delete an Buyer
 */
exports.destroy = function (req, res) {

    // create a new variable to hold the department that was placed on the req object.    
    var buyer = req.buyer;
    
    db.BuyerImage.findAll({ where: { BuyerId: req.buyer.id } }).then(function (response) {
        module.exports.deletePhysicalFile(response, function () { });
    });
    db.BuyerImage.destroy({ where: { BuyerId: req.buyer.id } }).then(function () {
        buyer.destroy().then(function () {
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
            return res.jsonp(buyer);
        }).catch(function (err) {
            return res.render('error', {
                error: err,
                status: 500
            });
        });
    });
};

exports.move = function (oldPath, newPath, callback) {

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

    exports.copy = function () {
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