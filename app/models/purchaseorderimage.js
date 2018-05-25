'use strict';

module.exports = function (sequelize, DataTypes) {

    var PurchaseOrderImage = sequelize.define('PurchaseOrderImage', {
        imagePath: DataTypes.TEXT
    },
        {
            associate: function (models) {
                PurchaseOrderImage.belongsTo(models.PurchaseOrder);
            }
        }
    );

    return PurchaseOrderImage;
};