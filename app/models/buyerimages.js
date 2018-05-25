'use strict';

module.exports = function (sequelize, DataTypes) {

    var BuyerImage = sequelize.define('BuyerImage', {
        imagePath: DataTypes.TEXT
    }
        //{
        //    associate: function (models) {
        //        customerImage.belongsTo(models.Customer);
        //    }
        //}
    );

    return BuyerImage;
};