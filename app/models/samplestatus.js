'use strict';

module.exports = function (sequelize, DataTypes) {

    var SampleStatus = sequelize.define('SampleStatus', {
        status: DataTypes.STRING,
        targetDate: DataTypes.DATE
    }
    );

    return SampleStatus;
};