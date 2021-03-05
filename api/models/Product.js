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
		price: {
            type: "string",
            required:true
		},
		description: {
            type: 'string',
           
		},
		category: {
			model:'category'
		},
		productImage: {
            type: 'string',
            required:true
		},
		tags: {
			type: 'string'
		},
		quantity:{
			type: 'string',
			defaultsTo:'0'
		},
		description_hindi:{
			type: 'string'
		},
		imc_code:{
			type: 'string'
		},
		ingredients:{
			type: 'string'
		},
		uses:{
			type: 'string'
		},
		benefits:{
			type: 'string'
		},
		uses_hindi:{
			type: 'string'
		},
		benefits_hindi:{
			type: 'string'
		},
		toJSON: function () {
			var obj = this.toObject();
			return obj;
		}
	},
	autoPK: false,

	beforeCreate: function (values, next) {
		next();
	},
	beforeDestroy: async function (criteria, next) {
		next();
	},
	beforeUpdate: async function (values, next) {
		next();
	}
};