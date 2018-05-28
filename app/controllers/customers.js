'use strict';

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
            return next(new Error('Failed to load customer ' + id));
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
   // console.log(req.body);
    var imageArray = req.body.imagesString.split(",");

    db.Customer.create(req.body).then(function (customer) {
        if (!customer) {
            return res.send('/signin', { errors: new StandardError('Customer could not be created') });
        } else {
            var imageArray = req.body.imagesString.split(",");
            for (var index = 0; index < imageArray.length; index++) {
                var oldPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\temp");
                var newPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\uploads");

                module.exports.move(oldPath, newPath, function () { });
                var request = {
                    imagePath: imageArray[index].replace("/temp/", "/uploads/"),
                    CustomerId: customer.id
                };
                db.CustomerImage.create(request);
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
    //console.log("customer request data 1  -->  " + req);

    console.log("imagesString 1  -->  " + JSON.stringify(req.body));
    
    customer.updateAttributes({
        email: req.body.email,
        company: req.body.company,
        name: req.body.name,
        contact: req.body.contact
    }).then(function (a) {
        console.log("imagesString  2" + JSON.stringify(req.body));
        var imageArray = req.body.imagesString.split(",");
        for (var index = 0; index < imageArray.length; index++) {
            var oldPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\temp");
            var newPath = (__dirname + imageArray[index]).replace(/\//g, "\\").replace("app\\controllers\\temp", "public\\uploads");

            module.exports.move(oldPath, newPath, function () { });
            var request = {
                imagePath: imageArray[index].replace("/temp/", "/uploads/"),
                CustomerId: customer.id
            };
            console.log(request);
            db.CustomerImage.create(request);
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
        for (var index = 0; index < response.length; index++) {
            var imagePath = (__dirname + response[index].imagePath).replace(/\//g, "\\").replace("app\\controllers", "public");
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, function (err) { });
            }
        }
    });
    db.CustomerImage.destroy({ where: { CustomerId: req.customer.id } }).then(function () {
    customer.destroy().then(function () {
        return res.jsonp(customer);
    }).catch(function (err) {
        return res.render('error', {
            error: err,
            status: 500
        });
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
