'use strict';

module.exports = function (sequelize, DataTypes) {

	var RfqParts = sequelize.define('RfqParts', {
		partName: DataTypes.STRING
	},
        {
        	associate: function (models) {
        		RfqParts.belongsTo(models.Rfq);
        	}
        }
    );

	return RfqParts;
};