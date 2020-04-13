'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var _ = require('lodash');
var config = require('./config');
var winston = require('./winston');
var db = {};

 
winston.info('Initializing Sequelize...');

// create your instance of sequelize
//var onHeroku = !!process.env.DYNO;

//winston.info('Checking if running on Heroku: ',onHeroku);

//var sequelize =  //onHeroku ?
//    new Sequelize(process.env.DATABASE_URL, {
//        dialect: 'postgres',
//        protocol: 'postgres',
//        dialectOptions: {
//            ssl: true
//        },
//        logging: config.enableSequelizeLog === 'true' ? winston.verbose : false
//    })
//    :
    //new Sequelize(config.db.name, config.db.username, config.db.password, {
    //    host: config.db.host,
    //    port: config.db.port,
    //    dialect: 'mysql',
    //    storage: config.db.storage,
    //    logging: config.enableSequelizeLog === 'true' ? winston.verbose : false
    //});

//var sequelize = new Sequelize(process.env.DATABASE_URL || config.DATABASE_URL, {
//     logging: config.enableSequelizeLog === 'true' ? winston.verbose : false
//    //logging: console.log
//});

/*var sequelize = new Sequelize("imorsdnq_crm", "imorsdnq_imorscrm", "!R?CTKdnRG-e", {
    host: "imorsetech.com",
        port: 3306,
        dialect: 'mysql',
        logging: config.enableSequelizeLog === 'true' ? winston.verbose : false
});*/
var sequelize = new Sequelize("metaforge_crm", "root", "*3:M0XoP6Nmnw5", {
    host: "103.212.121.81",
        dialect: 'mysql',
        logging: config.enableSequelizeLog === 'true' ? winston.verbose : false
});
/*
var sequelize = new Sequelize("metaforge_crm", "root", "", {
    host: "localhost",
        dialect: 'mysql',
        logging: config.enableSequelizeLog === 'true' ? winston.verbose : false
});*/

// loop through all files in models directory ignoring hidden files and this file
fs.readdirSync(config.modelsDir)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    // import model files and save model names
    .forEach(function (file) {
        //winston.info('Loading model file ' + file);
        var model = sequelize.import(path.join(config.modelsDir, file));
        db[model.name] = model;
    });

// invoke associations on each of the models
Object.keys(db).forEach(function (modelName) {
    if (db[modelName].options.hasOwnProperty('associate')) {
        db[modelName].options.associate(db)
    }
});
 
// Synchronizing any model changes with database. 
// set FORCE_DB_SYNC=true in the environment, or the program parameters to drop the database,
//   and force model changes into it, if required;
// Caution: Do not set FORCE_DB_SYNC to true for every run to avoid losing data with restarts
sequelize
    .sync({
        force: config.FORCE_DB_SYNC === 'true',
        logging: config.enableSequelizeLog === 'true' ? winston.verbose : false,
		alter: true,
		preserveColumnsOnSync: true // PLEASE recommend a better name
    })
    .then(function () {
        winston.info("Database " + (config.FORCE_DB_SYNC === 'true' ? "*DROPPED* and " : "") + "synchronized");
    }).catch(function (err) {
        winston.error("An error occurred: ", err);
    });

// assign the sequelize variables to the db object and returning the db. 
module.exports = _.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db);
