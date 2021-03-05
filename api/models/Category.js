const uuid = require('uuid');

module.exports = {
	attributes: {
		id: {
			type: 'string',
			primaryKey: true
		},
		name: {
			type: 'string',
			required: true
        },
        product:{
            collection:'product',
            via:'category'
        },
		toJSON: function () {
			var obj = this.toObject();
			return obj;
		}
	},
	autoPK: false,

	beforeCreate: function (values, next) {
        // // console.log('Before Create');
        // let cat = Category.findOne({id:values.category})
		// this.category = cat.id;
		next();
	},
	beforeDestroy: async function (criteria, next) {
		// console.log(criteria,next);
		
		// await Foreignkeyreferencetable.destroy({
		// 	user: criteria.where.id
		// });
	
		next();
	},
	beforeUpdate: async function (values, next) {
		// this.password = CipherService.hashPassword(values);
		next();
	}
};