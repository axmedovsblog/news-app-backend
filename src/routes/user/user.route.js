const { Router } = require("express")
const { UserController } = require('../../controller/user/user.controller')
const { UserValidator } = require('../../validators/user/user.validator')
const { expressValidate } = require('../../validators/index.js')
const { authMiddleware } = require('../../middlewares/auth.middleware.js')
const { roleMiddleware } = require('../../middlewares/role.middleware.js')
const { RoleCollection } = require('../../utils/constants.js')
const userRouter = new Router()

userRouter.post(
	"/signup-admin",
	UserValidator.signUpAdmin(),
	expressValidate,
	UserController.signUpAdmin
)
userRouter.post(
	"/signup",
	UserValidator.signUp(),
	expressValidate,
	UserController.signUp
)
userRouter.post(
	"/login",
	UserValidator.login(),
	expressValidate,
	UserController.login
)

userRouter.get(
	"/me",
  authMiddleware,
	UserController.me
);

userRouter.get(
	"/users",
  authMiddleware,
	roleMiddleware([RoleCollection.ADMIN]),
	UserController.getAllUsers
);

module.exports = { userRouter }