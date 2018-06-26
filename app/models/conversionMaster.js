'use strict';

module.exports = function (sequelize, DataTypes) {

    var ConversionMaster = sequelize.define('ConversionMaster', {
        operation: DataTypes.STRING,
        machine: DataTypes.STRING,
        rate: DataTypes.DOUBLE,
        efficiency: DataTypes.DOUBLE
    }
    );

    return ConversionMaster;
};