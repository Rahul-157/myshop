/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */
const lunr = require('lunr');
require("dotenv").config()

module.exports.bootstrap = 
	async function (cb) {


	//for any cron jobs u wish to set before running server

	// var schedule = require('node-schedule');
	// sails.config.crontab.crons().forEach(function (item) {
	// 	schedule.scheduleJob(item.interval, sails.config.crontab[item.method]);
	// });

	let userList = await User.find({email:process.env.admail});

	if (userList.length <= 0) {
		let admin = await User.create({
			email: process.env.admail,
			password: process.env.adpass,
			role: "ROLE_ADMIN",
			gender:"Male",
			mobileNumber:"0000000000"
		});
	}
	let catList = await Category.find();

	if (catList.length <= 0) {	
		rows = [{
			name: "HEALTH NUTRITION"
		},{
			name: "AGRICULTURE"
		},{
			name: "FOOD PRODUCTS"
		},{
			name: "SKIN CARE"
		},{
			name: "BABY CARE"
		},{
			name: "HOME CARE"
		},{
			name: "PERSONAL CARE"
		},{
			name: "GARMENTS AND APPARELS"
		},{
			name: "ACCESSORIES"
		},{
			name: "BOOKS"
		},];
		await Category.create(rows);
	}
	// For indexing product names
	let p = await Product.find({},{select:["name","tags"]})
	let idx = lunr(function () {
	this.ref('name')
	this.field('tags')
	p.forEach(function (pp) {
		this.add(pp)
	}, this)
	});
	sails.config.globals.srch_idx=idx;

		cb();
};

