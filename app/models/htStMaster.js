'use strict';

module.exports = function (sequelize, DataTypes) {

    var HTSTMaster = sequelize.define('HTSTMaster', {
        parameter: DataTypes.STRING,
        details: DataTypes.TEXT,
        rate: DataTypes.DOUBLE
    }
    );

    return HTSTMaster;
};