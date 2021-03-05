const passport = require('passport');
const fs = require('fs');
require('dotenv').config();

module.exports = {

	signin_v: function (req, res) {
		if (req.user)
			return res.redirect('/classified/home')
		return res.view('admin/login')
	},
	signin: function (req, res) {
		passport.authenticate('local', function (err, user, info) {
			if ((err) || (!user)) {
				req.flash('errMessage', info.message);
				return res.redirect('/classified')
			} else {
				req.logIn(user, function (err) {
					if (err) {
						res.redirect('/');
					} else {
						if (req.user.role == 'ROLE_ADMIN') {
							return res.redirect("/classified/home");
						}
						res.forbidden('You are not allowed here');
					}
				})
			}
		})(req, res);
	},
	logout: function (req, res) {
		req.session.destroy();
		res.redirect('/classified');
	},
	home: async function (req, res) {
		res.view('admin/home', {
			layout: 'base_admin'
		})
	},
	manageUsers: async function (req, res) {
		let user = await User.find();
		if (user && user.size == 1)
			return res.view("admin/users", {
				layout: 'base_admin'
			})
		else {
			return res.view("admin/users", {
				layout: 'base_admin',
				users: user
			})
		}
	},
	viewUser: async function (req, res) {
		let user = await User.findOne({
			id: req.param('userId')
		}).populate('idProof');
		
		return res.view('admin/viewUser', {
			layout: false,
			user: user
		});
	},
	deleteUser: async function (req, res) {
		User.destroy({
			id: req.param('id')
		}, function (err) {
			if (!err) {
				res.view('admin/users', {
					layout: 'base_admin',
					status: 'success',
					message: "User deleted!"
				});
			} else {
				res.serverError('Unable to delete User')
			}
		});
	},
	editUser: async function (req, res) {
		let user = await User.findOne({
			id: req.params.id
		})

		if (req.method == 'GET' && user)
			return res.view("admin/edit_user", {
				layout: 'base_admin',
				user: user,
			});
		UserService.uploadPicture(req.file('picture'), 'products/',async function (err, uploadedFile) {
			if (err) {
					return
			}
			if (uploadedFile && uploadedFile.length != 0) {
				let data = JSON.parse(JSON.stringify(uploadedFile[0]));
				let img_path = "/products/" + data.fd.split('/')[parseInt(process.env.index)];
				if (product) {
					await Product.update({
						id: product.id
					}, {
						productImage: img_path
					})
				}
			}
		});
		let productData = {
			price: parseInt(req.body.price),
			description: req.body.description ,
			description_hindi:  req.body.description_hindi ,
			benefits: req.body.benefits ,
			benefits_hindi:  req.body.benefits_hindi,
			uses: req.body.uses ,
			uses_hindi: req.body.uses_hindi ,
			ingredients: req.body.ingredients,
			imc_code: req.body.imc_code,
			quantity: parseInt(req.body.quantity),
			tags: req.body.tags!=product.tags?product.tags+req.body.tags:product.tags
		};
		let updated_product  = await Product.update({id:product.id},productData);
		if(updated_product.length){
			return res.view("admin/edit_product", {
					layout: 'base_admin',
					status:"success",
					message:"Product Updated",
					product:updated_product[0]
				})
		}
		else
		return res.view("admin/edit_product", {
			layout: 'base_admin',
			status:"error",
			message:"Could not update product",
			product:product
		})
	},

	manageProducts: async function (req, res) {
		let products = await Product.find().populate('category').sort('category ASC');
		if (products && products.size == 0)
			return res.view("admin/products", {
				layout: 'base_admin',
			})
		else
			return res.view("admin/products", {
				layout: 'base_admin',
				products: products
			})
	},
	addProduct: async function (req, res) {
		if (req.method == 'GET') {
			let cats = await Category.find();
			return res.view('admin/addProduct', {
				layout: 'base_admin',
				categories: cats
			});
		}
		if (
			!req.body.name ||
			!req.body.price ||
			req.body.picture=='' ||
			!req.body.imc_code ||
			!req.body.category
		) {
			UserService.uploadPicture(req.file('picture'), 'products/', async function (err, uploadedFile) {
				if (err) {
						return;
					}
				});
			  return res.view('admin/addProduct', {
				layout: 'base_admin',
				status: 'error',
				message: "Name, Price, IMC Code, Category and Image are required."
			});
			
		}
		let productData = {
			id: await UserService.generateId(req.body.name),
			name: req.body.name,
			price: parseFloat(req.body.price),
			description: typeof req.body.description != 'undefined' ? req.body.description : "",
			description_hindi: typeof req.body.description_hindi != 'undefined' ? req.body.description_hindi : "",
			benefits: typeof req.body.benefits != 'undefined' ? req.body.benefits : "",
			benefits: typeof req.body.benefits_hindi != 'undefined' ? req.body.benefits_hindi : "",
			benefits: typeof req.body.uses != 'undefined' ? req.body.uses : "",
			benefits: typeof req.body.uses_hindi != 'undefined' ? req.body.uses_hindi : "",
			ingredients: typeof req.body.ingredients != 'undefined' ? req.body.ingredients : "",
			imc_code: req.body.imc_code,
			quantity:  req.body.quantity!=''?parseInt(req.body.quantity):0,
			productImage: '-',
			tags: await UserService.generateTags(req.body.name),
			category: await Category.findOne({
				name: req.body.category
			}),
		};
		try {
			if(!productData.category)
			return res.view("admin/addProduct",{
				layout: 'base_admin',
				status: 'error',
				message: "Select category from dropdown list only (Double Click)"
			})
			let product = await Product.create(productData);

			await UserService.uploadPicture(req.file('picture'), 'products/', async function (err, uploadedFile) {
				if (err) {
						await Product.destroy({
							id: product.id
						});
						product=null
				}
		
				if (uploadedFile && uploadedFile.length != 0) {
					let data = JSON.parse(JSON.stringify(uploadedFile[0]));
					let img_path = "/products/" + data.fd.split('/')[parseInt(process.env.index)];
					if (product) {
						await Product.update({
							id: product.id
						}, {
							productImage: img_path
						})
					}
				}
			});
			if (!product) {
				return res.view("admin/addProduct",{
					layout: 'base_admin',
					status: 'error',
					message: "Could not upload Image, try later"
				})
			}
			return res.view('admin/addProduct', {
				layout: 'base_admin',
				status: 'success',
				message: "Product added"
			});
		} catch (error) {
			res.serverError(error)
		}
	},
	deleteProduct: async function (req, res) {
		console.log("deleting product")
		Product.destroy({
			id: req.param('id')
		}, async function (err) {
			let p = await Product.find();
			if (!err) {
				res.view('admin/products',{
					layout:'base_admin',
					status:"success",
					message:"Product Deleted",
					products:p
				});
			} else {
				res.view('/admin/products',{
					layout:'base_admin',
					status:"error",
					messsage:err,
					products:p
				});
			}
		});
	},
	editProduct: async function (req, res) {		
		let product = await Product.findOne({
			id: req.params.id
		})

		if (req.method == 'GET' && product)
			return res.view("admin/edit_product", {
				layout: 'base_admin',
				product: product,
			});
		UserService.uploadPicture(req.file('picture'), 'products/',async function (err, uploadedFile) {
			if (err) {
					return
			}
			if (uploadedFile && uploadedFile.length != 0) {
				let data = JSON.parse(JSON.stringify(uploadedFile[0]));
				let img_path = "/products/" + data.fd.split('/')[parseInt(process.env.index)];
				if (product) {
					await Product.update({
						id: product.id
					}, {
						productImage: img_path
					})
				}
			}
		});
		let productData = {
			price: parseInt(req.body.price),
			description: req.body.description ,
			description_hindi:  req.body.description_hindi ,
			benefits: req.body.benefits ,
			benefits_hindi:  req.body.benefits_hindi,
			uses: req.body.uses ,
			uses_hindi: req.body.uses_hindi ,
			ingredients: req.body.ingredients,
			imc_code: req.body.imc_code,
			quantity: parseInt(req.body.quantity),
			tags: req.body.tags!=product.tags?product.tags+req.body.tags:product.tags
		};
		let updated_product  = await Product.update({id:product.id},productData);
		if(updated_product.length){
			return res.view("admin/edit_product", {
					layout: 'base_admin',
					status:"success",
					message:"Product Updated",
					product:updated_product[0]
				})
		}
		else
		return res.view("admin/edit_product", {
			layout: 'base_admin',
			status:"error",
			message:"Could not update product",
			product:product
		})
	},
	viewProduct: async function (req, res) {
		let product = await Product.findOne({
			id: req.params.id
		})
		if (product)
			return res.view("admin/product_details", {
				layout: 'base_admin',
				product: product,
			})
		else
			return res.view("admin/products", {
				layout: 'base_admin',
				status: "error",
				message: "Product not Found"
			})
	},

	search_query:async function(req,res){
        if(req.body.search_query!=""){
            let results = sails.config.globals.srch_idx.search(req.body.search_query+'~1')
            var products = []
           for(let i =0 ; i<results.length;i++){
                let product = await Product.find({name:results[i].ref}).populate('category');
                products.push(product[0])
            };
            res.view('admin/products',{
                layout:"base_admin",
                products:products
            })
        }   
	},
	
	manageCategories : async function(req,res){
		let cats = await Category.find();
		res.view('admin/categories',{
			layout:"base_admin",
			categories:cats
		})
	},
	editCategory: async function(req,res){
		let updated_cat = await Category.update({name:req.body.category},{name:req.body.name});
		if(updated_cat){
		let cats = await Category.find();
			res.view('admin/categories',{
				layout:"base_admin",
				categories:cats,
				status:"sucess",
				message:"Category Updated"
			})
		}
	},
	addCategory: async function (req, res) {
		let new_cat = await Category.create({
			id: (req.body.new_cat).split(' ').join('-').toLowerCase(),
			name:req.body.new_cat.toUpperCase()
		});
		if(new_cat){
			let p = await Category.find();
			res.view('/admin/categories',{
				layout:'base_admin',
				status:"success",
				messsage:"Inserted Successfully",
				categories:p
			});
		}
		
		 else {
				res.view('/admin/categories',{
					layout:'base_admin',
					status:"error",
					messsage:err,
					categories:p
				});
			}
	},
	deleteCategory: async function (req, res) {
		Category.destroy({
			id: req.param('id')
		}, async function (err) {
			let p = await Category.find();
			if (!err) {
				res.view('admin/categories',{
					layout:'base_admin',
					status:"success",
					message:"Category Deleted",
					categories:p
				});
			} else {
				res.view('/admin/categories',{
					layout:'base_admin',
					status:"error",
					messsage:err,
					categories:p
				});
			}
		});
	},
};