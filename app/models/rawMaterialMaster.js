'use strict';

module.exports = function (sequelize, DataTypes) {

    var RawMaterialMaster = sequelize.define('RawMaterialMaster', {
        material: DataTypes.STRING,
        rate: DataTypes.DOUBLE,
        scrapRate: DataTypes.DOUBLE,
        scrapRecovery: DataTypes.DOUBLE
    }
    );

    return RawMaterialMaster;
};