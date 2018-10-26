'use strict';

module.exports = function (sequelize, DataTypes) {

    var RfqFeasibilities = sequelize.define('RfqFeasibilities', {
        partName: DataTypes.STRING,
        isFeasible: DataTypes.BOOLEAN
    },
        {
            associate: function (models) {
                RfqFeasibilities.belongsTo(models.User);
            }
        }
    );

    return RfqFeasibilities;
};