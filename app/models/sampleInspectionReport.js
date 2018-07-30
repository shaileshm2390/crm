'use strict';

module.exports = function (sequelize, DataTypes) {

    var SampleInspectionReport = sequelize.define('SampleInspectionReport', {
        status: DataTypes.STRING,
        report: DataTypes.TEXT
    },
        {
            associate: function (models) {
                SampleInspectionReport.belongsTo(models.Rfq);
                SampleInspectionReport.hasMany(models.SampleInspectionReportImage)
            }
        }
    );

    return SampleInspectionReport;
};