'use strict';

module.exports = function (sequelize, DataTypes) {

    var Customer = sequelize.define('Customer', {
        email: DataTypes.STRING,
        company: DataTypes.STRING,
        name: DataTypes.STRING,
        contact: DataTypes.STRING
    }, 
        {
            associate: function (models) {
                Customer.hasMany(models.CustomerImage);
           }
        }
    );

    return Customer;
};