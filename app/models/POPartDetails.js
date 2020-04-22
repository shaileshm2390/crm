'use strict';

module.exports = function (sequelize, DataTypes) {

    var POPartDetail = sequelize.define('POPartDetail', {
        sampleSubmissionTargetDate: DataTypes.DATE,
        developerTargetDate: DataTypes.DATE,
        RfqPartId: DataTypes.INTEGER,
        RfqId: DataTypes.INTEGER
    });

    return POPartDetail;
};