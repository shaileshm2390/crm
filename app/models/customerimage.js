'use strict';

module.exports = function (sequelize, DataTypes) {

    var CustomerImage = sequelize.define('CustomerImage', {
        imagePath: DataTypes.TEXT
    },
        {
            associate: function (models) {
                CustomerImage.belongsTo(models.Customer);
            }
        }
    );

    return CustomerImage;
};