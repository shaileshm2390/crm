'use strict';

module.exports = function (sequelize, DataTypes) {

    var RfqImage = sequelize.define('RfqImage', {
        imagePath: DataTypes.TEXT
    }
        //{
        //    associate: function (models) {
        //        customerImage.belongsTo(models.Customer);
        //    }
        //}
    );

    return RfqImage;
};