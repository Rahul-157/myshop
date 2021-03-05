var fs = require('fs');
require('dotenv').config();
module.exports = {
	
	forgotPassword: async function (req, res) {
		try {
			let uniqueotp = UserService.randomNumber(4);
			let user = await User.findOne({
				email: req.param('email'),
				isEmailVerified: true,
				ispasswordCreated: true,
			});
			if (user) {
				user = await User.update({
					id: user.id
				}, {
					otp: uniqueotp
				});
				let message = MessageService.otp_msg(uniqueotp);
				let subject = 'One Time Password';
				await MailService.sendEmail(message, user[0].email, subject);
				return res.json({
					status: 'SUCCESS',
					message: 'OTP Sent Successfully'
				});
			} else {
				return res.json({
					status: 'ERROR',
					message: 'User Not Found/User Not verified',
					data: {},
				});
			}
		} catch (err) {
			return res.json({
				status: 'ERROR',
				message: 'Some Error Occured',
				data: {},
			});
		}
	},

	resetPassword: async function (req, res) {
		try {
			let user = await User.findOne({
				email: req.body.email
			});
			if (user && user.otp==req.body.otp) {
				let validatePassword = await ValidationService.validatePassword(
					req.body.password
				);
				let newPasswordMatch = await CipherService.comparePassword(
					req.body.password,
					user
				);
				if (validatePassword) {
					if (newPasswordMatch) {
						console.log('newPassword Match');
						return res.json({
							status: 'ERROR',
							message: 'Your new password should not be same as old password',
							data: {},
						});
					} else {
						user = await User.update({
							id: user.id
						}, {
							password: req.body.password
						});
						return res.json({
							status: 'SUCCESS',
							message: 'Password reset Successfully',
							data: {},
						});
					}
				} else {
					return res.json({
						status: 'ERROR',
						message: 'Password must be eight characters long',
						data: {},
					});
				}
			}
		} catch (err) {
			return res.json({
				status: 'ERROR',
				message: 'Some Error Occured',
				data: {},
			});
		}
	},

	changePassword: async function (req, res) {
		try {
			let oldPassword = req.body.oldPassword;
			let newPassword = req.body.newPassword;
			let user = await User.findOne({
				id: req.user.id
			});

			if (user.password) {
				let passwordMatch = await CipherService.comparePassword(
					oldPassword,
					user
				);
				let newPasswordMatch = await CipherService.comparePassword(
					newPassword,
					user
				);
				console.log('Password Match  :  ', passwordMatch);

				if (passwordMatch) {
					let validatePassword = await ValidationService.validatePassword(
						newPassword
					);
					if (validatePassword) {
						if (newPasswordMatch) {
							return res.json({
								status: 'ERROR',
								message: 'Your new password should not be same as old password',
								data: {},
							});
						} else {
							user = await User.update({
								id: user.id
							}, {
								password: newPassword
							});
							return res.json({
								status: 'SUCCESS',
								message: 'Password Successfully Updated',
								data: {},
							});
						}
					} else {
						return res.json({
							status: 'ERROR',
							message: 'Password must be eight characters long',
							data: {},
						});
					}
				} else {
					return res.json({
						status: 'ERROR',
						message: 'Old password not matched',
						data: {},
					});
				}
			} else {
				return res.json({
					status: 'ERROR',
					message: 'Old password not matched',
					data: {},
				});
			}
		} catch (err) {
			return res.json({
				status: 'ERROR',
				message: 'Some Error Occured',
				data: {},
			});
		}
	},

	uploadpicture: async function (req, res) {
		try {
				UserService.uploadPicture(req, req.body.path,async function (err, uploadedFile) {
					let data = JSON.parse(JSON.stringify(uploadedFile[0]));
					var location = data.fd.split('/');
					var addr = "/assets/customer/" + location[parseInt(process.env.index)];
					if (uploadedFile.length === 0) {
						return res.json({
							status: 'ERROR',
							message: 'No file was uploaded',
							data: {},
						});
					}
					let user = await User.update({
						id: req.user.id
					}, {
						picture: addr
					});
					return res.json({
						status: 'SUCCESS',
						message: 'Picture uploaded successfully!',
						data: {},
					});
				});

		} catch (err) {

			return res.json({
				status: 'ERROR',
				message: 'Some Error Occured',
				data: {},
			});
		}
	},

	showImage: async function (req, res) {
		const filePath = "/home/ubuntu/dror-web" + req.query.filePath;

		fs.readFile(filePath, function (err, data) {
			res.writeHead(200, {
				'Content-Type': 'image/jpeg'
			});
			res.end(data); // Send the file data to the browser.
		});
	},

	verifyEmail: async function (req, res) {
		try {

			let user = await User.findOne({
				id: req.params.id
			});
			if (user) {
				await User.update({
					id: user.id
				}, {
					isEmailVerified: true
				});
				return res.json({
					status: 'SUCCESS',
					message: 'Email Verified',
					data: {},
				});
			} else {
				return res.json({
					status: 'ERROR',
					message: 'User Not Found',
					data: {},
				});
			}
		} catch (err) {
			return res.json({
				status: 'ERROR',
				message: 'Some Error Occured',
				data: {},
			});
		}
	}
};