/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */

module.exports.policies = {

	'*': true,

	//for a controller named AuthController
	AuthController: {
		// for route name setAgreementAccepted set the policies for authentaication and auth
		
	},
	AdminController:{
		home:['isAdmin'],

		manageUsers:['isAdmin'],
		editUser:['isAdmin'],
		deleteUser:['isAdmin'],
		viewUser:['isAdmin'],

		manageProducts:['isAdmin'],
		editProduct:['isAdmin'],
		deleteProduct:['isAdmin'],
		viewProduct:['isAdmin'],
		addProduct:['isAdmin'],

		manageCategories:['isAdmin'],
		editCategory:['isAdmin'],
		deleteCategory:['isAdmin'],
		addCategory:['isAdmin'],
	
		logout:['isAdmin']
	},
	HomeController:{
		
	}
};