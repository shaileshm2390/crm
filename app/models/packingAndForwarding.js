'use strict';

module.exports = function (sequelize, DataTypes) {

    var PackingAndForwarding = sequelize.define('PackingAndForwarding', {
        name: DataTypes.TEXT,
        rate: DataTypes.DOUBLE
    }
    );

    return PackingAndForwarding;
};