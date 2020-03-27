'use strict';

module.exports = function (sequelize, DataTypes) {

	var RfqParts = sequelize.define('RfqParts', {
		partName: DataTypes.STRING
	},
        {
        	associate: function (models) {
                RfqParts.belongsTo(models.Rfq);
                RfqParts.hasMany(models.CostSheet);
                RfqParts.hasMany(models.Samplesubmission);
                RfqParts.hasMany(models.DeveloperHandover);
                RfqParts.hasMany(models.Samplesubmissionimage);
                RfqParts.hasMany(models.SampleInspectionReport);
        	}
        }
    );

	return RfqParts;
};