const { Router } = require("express")
const { UserController } = require('../../controller/user/user.controller')
const { UserValidator } = require('../../validators/user/user.validator')
const { expressValidate } = require('../../validators/index.js')
const userRouter = new Router()

userRouter.post("/signup-admin" ,UserValidator.signUpAdmin(), expressValidate ,UserController.signUpAdmin)
module.exports = { userRouter }