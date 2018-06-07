'use strict';

module.exports = function (sequelize, DataTypes) {

    var SampleStatus = sequelize.define('SampleStatus', {
        status: DataTypes.STRING,
        target_date: DataTypes.STRING
    }
    );

    return SampleStatus;
};