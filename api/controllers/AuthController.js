const passport = require('passport');
const logger = sails.log;
require('dotenv').config()
module.exports = {
	signup_view : function(req,res){
		res.view('partials/signup',{layout:'template'})
	},
	signup: async function (req, res) {
			logger.info("SIGN Up Body   :   ", req.body);
			if (
				!req.body.firstName ||
				!req.body.lastName ||
				!req.body.email ||
				!req.body.mobileNumber ||
				!req.body.password
			) {
				return res.view('partials/signup',{
					status: 'error',
					layout:"template",
					message:"All fields are mandatory"
				});
			}
			let validateEmail = await ValidationService.validateEmail(req.body.email);
			if (validateEmail === false) {
				return res.view('partials/signup',{
					status: 'error',
					layout:"template",
					message:"Invalid Email"
				});
			}
			let validateMobile = await ValidationService.validateMobileNumber(
				req.body.mobileNumber
			);
			if (validateMobile === false) {
				return res.view('partials/signup',{
					status: 'error',
					layout:"template",
					message:"Invalid Mobile Number"
				});
			}
			let validateFirstName = await ValidationService.validateAlphaString(
				req.body.firstName
			);
			if (validateFirstName === false) {
				return res.view('partials/signup',{
					status: 'error',
					layout:"template",

					message:"Invalid Firstname"
				});
			}
			let validateLastName = await ValidationService.validateAlphaString(
				req.body.lastName
			);
			if (validateLastName === false) {
				return res.view('partials/signup',{
					status: 'error',
					layout:"template",

					message:"Invalid Lastname"
				});
			}

			// if user has abandoned signup process earlier then pickup from that point only
			let existingEmail = await User.findOne({
				email: req.body.email,
			});
			if (existingEmail) {
				
				 if (!existingEmail.isEmailVerified)  {
						if (existingEmail.otp == "NULL") {
								let uniqueotp = UserService.randomNumber(4);
								let user = await User.update({
									id: existingEmail.id
								}, {
									otp: uniqueotp
								});
								let subject = 'One Time Password';
								let message = MessageService.otp_msg(uniqueotp,existingEmail.id);
								// MailService.sendEmail (message, existingEmail.email,existingEmail.firstName, subject);
								DeleteOtp.AutoDestroyOtp(user[0]);
							}
						return res.view('partials/verify_otp',{
							status:"Success",
							message:"Verify OTP",
					layout:"template",

							email:existingEmail.email,
							password:req.body.password
						});
				}
				return res.redirect('/');
			}

			// if user doesnt exist at all
			else{
			let uniqueotp = UserService.randomNumber(4);
			let userData = {
				firstName: req.body.firstName,
				lastName: req.body.lastName ? req.body.lastName : '',
				email: req.body.email,
				password:req.body.password,
				otp: uniqueotp,
				mobileNumber: req.body.mobileNumber,
				role: "ROLE_USER"
			};
			try {
				let user = await User.create(userData);
				UserService.uploadPicture(req.file('picture'),'customer/',async function (err, uploadedFile) {
					if(err){
						return;
					}
					let data = JSON.parse(JSON.stringify(uploadedFile[0]));
						let img_path = "/customer/" + data.fd.split('/')[parseInt(process.env.index)];
						if(user){
							await User.update({id:user.id},{profilePicture:img_path})
						}
				});
				let message = MessageService.otp_msg(uniqueotp,user.id);
				let subject = 'One Time Password';
				// MailService.sendEmail (message, user.email,user.firstName, subject);
				DeleteOtp.AutoDestroyOtp(user);
				if (!user) {
					return res.serverError("Try <a href='/signup'>Signing up</a>  again! ")
				}
				else{
					return res.view('partials/verify_otp',{
						layout:"template",

						status:"success",
						message:"Verify OTP",
						email:user.email,
						password:req.body.password
					});
				}
			} catch (err) {
				logger.error('Following error is generated: ' + err);
				return res.serverError("Try <a href='/signup'>Signing up</a>  again! ")
			}
		}
	},

	login_view : function(req,res){
		res.view('partials/login',{	layout:"template",	})
	},

	login: async function (req, res) {
		if (!req.body.email || !req.body.password) {
			return res.view('partials/login',{
				status: 'error',
				layout:"template",
				message:"Email and Password both are required"
			});
		}
		let validateEmail = await ValidationService.validateEmail(
			req.body.email
		);
		if (validateEmail === false) {
			return res.view('partials/login',{
				status: 'error',
				layout:"template",
				message:"Invalid Email"
			});
		}
		let user = await User.findOne({
			email: req.body.email
		});
		if (!user) {
			return res.view('partials/login',{
				status: 'error',
				layout:"template",
				message:"You are not registered. Click here to <a href='/signup'>Signup</a>"
			});
		}
		try {
			if (user.password) {
				passport.authenticate('local', function (err, user, info) {
					if ((err) || (!user)) {
						return res.view('partials/login',{
							status: 'error',
							message: info,
							layout:"template",
						});
					} else {
						req.logIn(user, function (err) {
							if (err) {
								return res.serverError();
							} else {
								res.cookie('jwt', CipherService.createToken(user), {
									secure: req.connection.encrypted ? true : false,
									httpOnly: true,
									signed:true
								  });
								return res.redirect('/')
							}
						})
					}
				})(req, res);
			} 
		} catch (err) {
			logger.info('Login Error   :   ', err);
			return res.serverError("Try <a href='/login'>Signing in</a>  again! ")
		}
	},

	verifyOtp: async function (req, res) {
		if(req.body.action=="Resend")
		return this.resendotp(req,res)

		if (!req.body.otp || !req.body.email) {
			return res.view('partials/verify_otp',{
				status: 'error',
				message: 'OTP field is mandatory',
				layout:"template",

				email:req.body.email
			});
		}
		let matchotp = await User.findOne({
			email: req.body.email
		});
		if (matchotp.otp != req.body.otp) {
			return res.view('partials/verify_otp',{
				status: 'error',
				message: 'Invalid OTP',
				layout:"template",
				email:req.body.email
			});
		}
		try {
			let user = await User.update({
				id: matchotp.id
			},{
				isEmailVerified: true
			});
			user =  await User.findOne({
				email: req.body.email
			});
			if (user) {
				return this.login(req,res)
			}
		} catch (err) {
			logger.error('following error is generated: ' + err);
			return res.serverError("Try <a href='/signup'>Signing up</a>  again! ")
		}
	},

	verifyEmail : async function(req,res){
		if(req.params.id){
			let user = await User.update({
				id:req.params.id
			},{
				isEmailVerified:true
			});
			if(user){
				res.view('partials/home',{
					layout:'template',
					status:"success",
					message:"Email verified"
				});
			}
			else{
				res.serverError()
			}
	}
		
	},

	resendotp: async function (req, res) {
		let userExist = await User.findOne({
			email: req.body.email
		});
		if (!userExist) {
			return res.forbidden();
		}
		if(userExist.otp!="NULL"){
			return res.view('partials/verify_otp',{
				status: 'error',
				message: 'Wait until 1 minute to resend OTP',
				layout:'template',
				email:req.body.email,
				password:req.body.password
			});
		}
		try {
			let uniqueotp = UserService.randomNumber(4);
			
			let user = await User.update({
				id: userExist.id
			}, {
				otp: uniqueotp
			});
			if (user) {
				let message = MessageService.otp_msg(uniqueotp,user.id);
				DeleteOtp.AutoDestroyOtp(user[0]);
				let subject = 'One Time Password';
				// MailService.sendEmail (message, user[0].email,user[0].firstName, subject);
				return res.view('partials/verify_otp',{
					status: 'success',
					message: 'OTP has been sent to registered email.',
					layout:'template',
					email:req.body.email,
					password:req.body.password
				});
			}
		} catch (err) {
			logger.info('following error is generated: ', err);
			return res.serverError();
		}
	},

	logout: async function (req, res) {
		// logger.info(req.cookie)
		if (!req.user) {
			return res.serverError();
		}
		req.user=undefined;
		res.cookie('jwt', null, {
			secure: req.connection.encrypted ? true : false,
			httpOnly: true
		  });
		req.session.destroy();
		res.redirect('/')
	}
};
