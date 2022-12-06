import Router from 'express'

const authRouter = new Router()
import controller from './authController.js'
import {check} from 'express-validator'

import roleMiddleware from "./middlewaree/roleMiddleware.js";

authRouter.post('/registration', [
    check('username', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 4 и меньше 10 символов").isLength({min:4, max:10})
], controller.registration)
authRouter.post('/login', controller.login)
authRouter.get('/users',roleMiddleware(['USER','ADMIN']), controller.getUsers)
authRouter.get('/user',roleMiddleware(['USER','ADMIN']), controller.getUser)
authRouter.patch('/user',roleMiddleware(['USER','ADMIN']),controller.updateUser)
authRouter.patch('/user-password',roleMiddleware(['USER','ADMIN']),controller.updateUserPassword)
export default authRouter