/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end. 
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */


module.exports.routes = {


	'GET /validate_me/:id':'AuthController.verifyEmail',
	'POST /signup': 'AuthController.signup',
	'GET /signup': 'AuthController.signup_view',
	'GET /login': 'AuthController.login_view',
	'POST /login': 'AuthController.login',
	'POST /verify_otp':'AuthController.verifyOtp',
	'POST /resendotp':'AuthController.resendotp',
	'GET /logout' : 'AuthController.logout',


	'GET /productdetails/:id':'HomeController.product_details',
	'GET /all':'HomeController.all_products',
	'GET /page/:page': 'HomeController.home',
	'GET /':'HomeController.home',
	'GET /c/:cat_name/page/:page' : 'HomeController.show_category_wise',
	'GET /c/:cat_name' : 'HomeController.show_category_wise',
	'POST /search_results':'HomeController.search_query',
	
	

	'GET /classified' : 'AdminController.signin_v',
	'GET /classified/logout' : 'AdminController.logout',
	'POST /classified' :'AdminController.signin',
	'GET /classified/home' : 'AdminController.home',
	'POST /classified/search_results' : 'AdminController.search_query',
	'GET /classified/users':'AdminController.manageUsers',
	'GET /classified/deleteUser/:id' : 'AdminController.deleteUser',
	'GET /classified/editUser/:id' : 'AdminController.editUser',
	'GET /classified/products':'AdminController.manageProducts',
	'GET /classified/addProduct' : 'AdminController.addProduct',
	'POST /classified/addProduct' : 'AdminController.addProduct',
	'GET /classified/deleteProduct/:id' : 'AdminController.deleteProduct',
	'GET /classified/editProduct/:id' : 'AdminController.editProduct',
	'POST /classified/editProduct/:id' : 'AdminController.editProduct',
	'GET /classified/productDetails/:id' :'AdminController.viewProduct',
	'GET /classified/categories':'AdminController.manageCategories',
	'POST /classified/addCategory' : 'AdminController.addCategory',
	'POST /classified/editCategory' : 'AdminController.editCategory',
	'GET /classified/deleteCategory/:id':'AdminController.deleteCategory',
	
};