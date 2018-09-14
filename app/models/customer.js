'use strict';

module.exports = function (sequelize, DataTypes) {

    var Customer = sequelize.define('Customer', {
        email: DataTypes.STRING,
        company: DataTypes.STRING,
        name: DataTypes.STRING,
        contact: DataTypes.STRING,
        payment: DataTypes.STRING,
        tax: DataTypes.STRING,
        freight: DataTypes.STRING,
        packing: DataTypes.TEXT,
        validity: DataTypes.TEXT,
        terms: DataTypes.TEXT
    },
        {
            associate: function (models) {
                Customer.hasMany(models.CustomerImage);
            }
        }
    );

    return Customer;
};