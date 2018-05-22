'use strict';

module.exports = function (sequelize, DataTypes) {

    var Buyer = sequelize.define('Buyer', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        contact: DataTypes.STRING
    },
        {
            associate: function (models) {
                Buyer.belongsTo(models.Customer);
            }
        }
    );

    return Buyer;
};