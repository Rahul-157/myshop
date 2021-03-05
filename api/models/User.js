const uuid = require('uuid');

module.exports = {
	attributes: {
		id: {
			type: 'string',
			primaryKey: true,
			defaultsTo: uuid.v4,
		},
		email: {
			type: 'string',
			unique: true,
			required: true,
		},
		firstName: {
			type: 'string',
		},
		lastName: {
			type: 'string',
		},
		otp: {
			type: 'string',
			defaultsTo:"NULL"
		},
		isEmailVerified: {
			type: 'boolean',
			defaultsTo: false,
		},
		mobileNumber: {
			type: 'string'
		},
		password: {
			type: 'string',
		},
		profilePicture: {
			type: 'string',
			defaultsTo:"/customer/default.png"
		},
		role: {
			type:'string',
			defaultsTo:'ROLE_USER'
		},
		toJSON: function () {
			var obj = this.toObject();
			delete obj.password;
			return obj;
		}
	},
	autoPK: false,

	beforeCreate: function (values, next) {
		// console.log('Before Create');
		this.password = CipherService.hashPassword(values);
		next();
	},
	beforeDestroy: async function (criteria, next) {
		console.log(criteria,next);
		
		// await Foreignkeyreferencetable.destroy({
		// 	user: criteria.where.id
		// });
	
		next();
	},
	beforeUpdate: async function (values, next) {
		this.password = CipherService.hashPassword(values);
		next();
	}
};