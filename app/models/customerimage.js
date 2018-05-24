'use strict';

module.exports = function (sequelize, DataTypes) {

    var customerImage = sequelize.define('Customerimage', {
        imagePath: DataTypes.TEXT
    },
        {
            associate: function (models) {
                customerImage.belongsTo(models.Customer);
            }
        }
    );

    return customerImage;
};