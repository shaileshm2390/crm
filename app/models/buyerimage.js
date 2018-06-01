'use strict';

module.exports = function (sequelize, DataTypes) {

    var BuyerImage = sequelize.define('BuyerImage', {
        imagePath: DataTypes.TEXT
    },
        {
            associate: function (models) {
                BuyerImage.belongsTo(models.Buyer);
            }
        }
    );

    return BuyerImage;
};