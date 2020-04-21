'use strict';

module.exports = function (sequelize, DataTypes) {

    var POPartDetails = sequelize.define('POPartDetails', {
        sampleSubmissionTargetDate: DataTypes.DATE,
        developerTargetDate: DataTypes.DATE,
        RfqPartId: DataTypes.STRING,
        RfqId: DataTypes.STRING
    });

    return POPartDetails;
};