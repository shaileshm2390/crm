﻿'use strict';

module.exports = function (sequelize, DataTypes) {

    var CustomerImage = sequelize.define('CustomerImage', {
        imagePath: DataTypes.TEXT
    }
        //{
        //    associate: function (models) {
        //        customerImage.belongsTo(models.Customer);
        //    }
        //}
    );

    return CustomerImage;
};