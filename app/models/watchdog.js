'use strict';

module.exports = function (sequelize, DataTypes) {

    var Watchdog = sequelize.define('Watchdog', {
        message: DataTypes.STRING,
        ipAddress: DataTypes.STRING,
        pageUrl: DataTypes.STRING,
        userId: DataTypes.INTEGER,
        previousData: DataTypes.TEXT,
        updatedData: DataTypes.TEXT
    } ,
	{
		associate: function (models) {
                Watchdog.belongsTo(models.Rfq);
                Watchdog.belongsTo(models.RfqParts);
            }	
		}
    );

    return Watchdog;
};