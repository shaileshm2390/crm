'use strict';

/**
	* User Model
	*/ 

var crypto = require('crypto');
 
module.exports = function(sequelize, DataTypes) {
     
	var User = sequelize.define('User', 
		{
            firstName: DataTypes.STRING, 
            lastName: DataTypes.STRING,
            email: DataTypes.STRING,
            contact: DataTypes.STRING,
			hashedPassword: DataTypes.STRING,
			provider: DataTypes.STRING,
            salt: DataTypes.STRING,
            active: DataTypes.BOOLEAN
		}, 
		{
			instanceMethods: {
				toJSON: function () {
					var values = this.get();
					delete values.hashedPassword;
					delete values.salt;
					return values;
				},
				makeSalt: function() {
					return crypto.randomBytes(16).toString('base64'); 
				},
				authenticate: function(plainText){
					return this.encryptPassword(plainText, this.salt) === this.hashedPassword;
				},
				encryptPassword: function(password, salt) {
					if (!password || !salt) {
                        return '';
                    }
					salt = new Buffer(salt, 'base64');
                    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
				}
			},
			associate: function(models) {
                User.belongsTo(models.Department);
			} 
		}
    );  


	return User;
};
