'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');
var _ = require('lodash');
const JSON = require('circular-json');
const request = require('request');
var ipAddress;

request('http://api.ipstack.com/check?access_key=a0a80aaea559ceb4d5ebacc03c30f6d3', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    ipAddress = body.ip;
});
/**
 * Find department by id
 * Note: This is called every time that the parameter :departmentId is used in a URL.
 * Its purpose is to preload the department on the req object then call the next function.
 */
exports.purchaseorder = function (req, res, next, id) {
    db.PurchaseOrder.find({ where: { id: id } }).then(function (purchaseorder) {
        if (!purchaseorder) {
            req.purchaseorder = {};
            return next();
        } else {
            req.purchaseorder = purchaseorder;
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
    // augment the department by adding the UserId
    // save and return and instance of department on the res object.

    db.PurchaseOrder.create(req.body).then(function (purchaseorder) {
        if (!purchaseorder) {
            return res.send('/signin', { errors: new StandardError('purchaseorder could not be created') });
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
                        PurchaseOrderId: purchaseorder.id
                    };
                    db.PurchaseOrderImage.create(request);
                }
            }
            var fullUrl = req.originalUrl; //req.protocol + '://' + req.get('host') + req.originalUrl;

            db.Watchdog.create({
                message: "New Purchase order is created",
                ipAddress: ipAddress,
                pageUrl: fullUrl,
                userId: req.user.id,
                previousData: "",
                updatedData: JSON.stringify(purchaseorder)
            });

            return res.jsonp(purchaseorder);
        }
    }).catch(function (err) {
        //return res.send('/signin', {
        //    errors: err,
        //    status: 500
        //});
        console.log(err);
    });
};

/**
 * Update a department
 */
exports.update = function (req, res) {
    // create a new variable to hold the department that was placed on the req object.

    var purchaseorder = req.purchaseorders;
    var previousData;
    db.PurchaseOrder.find({
        where: { RfqId: purchaseorder.RfqId, RfqPartId: purchaseorder.RfqPartId },
        include: [
            { model: db.Rfq },
            {model: db.PurchaseOrderImage,}
        ]
    }).then(function (purchaseorder) {
        if (!purchaseorder) {
            req.purchaseorders = {};
            return next();
        } else {
            req.purchaseorders = purchaseorder;
            previousData = { "id": req.purchaseorders.id, "status": req.purchaseorders.status,"application" :req.purchaseorders.application,"gstNum":req.purchaseorders.gstNum,"hsnNum":req.purchaseorders.hsnNum, "RfqId": req.purchaseorders.RfqId, "updatedAt": req.purchaseorders.updatedAt, "createdAt": req.purchaseorders.createdAt };
            //return next();
        }
    
    purchaseorder.updateAttributes({
        status: req.body.status,
        application : req.body.application,
        gstNum : req.body.gstNum,
        hsnNum : req.body.hsnNum
    }).then(function (a) {
        if (req.body.imagesString.trim() !== "") {
            var imageArray = req.body.imagesString.split(",");
            for (var index = 0; index < imageArray.length; index++) {
              /*  var oldPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\temp");
                var newPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\uploads");

                module.exports.move(oldPath, newPath, function () { });*/
                var request = {
                    //imagePath: imageArray[index].replace("/temp/", "/uploads/"),
                    imagePath: imageArray[index],
                    PurchaseOrderId: purchaseorder.id
                };
                db.PurchaseOrderImage.create(request);
            }
        }
        var fullUrl = req.originalUrl; //req.protocol + '://' + req.get('host') + req.originalUrl;
        var updatedData = { "id": purchaseorder.id, "status": purchaseorder.status,"application" :purchaseorder.application,"gstNum":purchaseorder.gstNum,"hsnNum":purchaseorder.hsnNum, "RfqId": purchaseorder.RfqId, "updatedAt": purchaseorder.updatedAt, "createdAt": purchaseorder.createdAt };

        db.Watchdog.create({
            message: "Purchase order is updated",
            ipAddress: ipAddress,
            pageUrl: fullUrl,
            userId: req.user.id,
            previousData: JSON.stringify(previousData),
            updatedData: JSON.stringify(updatedData)
        });
        return res.jsonp(a);
    }).catch(function (err) {
        return (err);
    });
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Delete an department
 */
exports.destroy = function (req, res) {

    // create a new variable to hold the department that was placed on the req object.
    var purchaseorder = req.purchaseorder;
    db.User.destroy({ where: { PurchaseorderId: req.purchaseorder.id } }).then(function () {
        purchaseorder.destroy().then(function () {
            return res.jsonp(purchaseorder);
        }).catch(function (err) {
            return res.render('error', {
                error: err,
                status: 500
            });
        });
    });
};

/**
 * Show an department
 */
exports.show = function (req, res) {
    // Sending down the department that was just preloaded by the departments.department function
    // and saves department on the req object.
    return res.jsonp(req.purchaseorder);
};

/**
 * List of department
 */
exports.all = function (req, res) {

    db.PurchaseOrder.findAll({
        include: [
            { model: db.PurchaseOrderImage }
        ]
    }).then(function (purchaseorders) {
        return res.jsonp(purchaseorders);
    }).catch(function (err) {
        //return res.render('error', {
        //    error: err,
        //    status: 500
        //});
        console.log(err);
    });
};

/**
 *Department authorizations routing middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.user.PurchaseorderId != 1) {
        return res.send(401, 'User is not authorized ');
    }
    next();
};

exports.move = function (oldPath, newPath, callback) {

    var fs = require('fs');
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
}
exports.copy = function () {
    var readStream = fs.createReadStream(oldPath);
    var writeStream = fs.createWriteStream(newPath);

    readStream.on('error', callback);
    writeStream.on('error', callback);

    readStream.on('close', function () {
        fs.unlink(oldPath, callback);
    });

    readStream.pipe(writeStream);
};

exports.purchaseordersByRfqId = function (req, res) {
    return res.jsonp(req.purchaseorders);
};

exports.purchaseorderByRfqId = function (req, res, next, id) {
    db.PurchaseOrder.find({
        where: { RfqId: id , RfqPartId: req.query.partId},
        include: [
            {
                model: db.Rfq,

            },
            {
                model: db.PurchaseOrderImage,
            }
        ]
    }).then(function (purchaseorder) {
        if (!purchaseorder) {
            //return next(new Error('Failed to load samplesubmissions ' + id));
            req.purchaseorders = {};
            return next();
        } else {
            req.purchaseorders = purchaseorder;
            return next();
        }
    }).catch(function (err) {
        return next(err);
    });
};
