import User from './models/User.js'
import Role from './models/Role.js'
import bcrypt from'bcryptjs'
import {validationResult} from "express-validator";
import jwt from "jsonwebtoken"
import secret from './config.js'
import Post from "./Post.js";
import PostService from "./PostService.js";


const generateAccessToken = (id,roles) => {
    const payload = {
        id,
        roles,
    }
    return jwt.sign(payload, secret,{expiresIn:'24h'})
}

class authController {
    async registration(req,res) {
        try {
            console.log('этот лог из файла authController')
            const errors = validationResult(req)
            console.log(errors)
            if(!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации: имя не может быть пустым", errors})
            }
            const {username,password} = req.body
            const candidate = await User.findOne({username})
            console.log(candidate)
            if(candidate) {
                return res.status(409).json({message:'Пользователь с таким именем уже существует'})
            }
            const hashPassword = bcrypt.hashSync(password, 3)
            const userRole = await Role.findOne({value: "USER"})
            const user = new User({username, password: hashPassword, roles: [userRole.value]})
            await user.save()
            return res.json({message: 'Пользователь успешно зарегистрирован'})
        } catch(e) {
            console.log(e)
            res.status(500).json({message: 'Registration error'})
        }
    }
    async login(req,res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if(!user) {
                return res.status(400).json({message:`Пользователь ${username} не найден`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if(!validPassword) {
                return res.status(400).json({message:"Введён неверный пароль"})
            }
            const token = generateAccessToken(user._id, user.roles)
            res.cookie('token', token, {
                httpOnly: false
            })
            console.log(token)
            return res.json({token})
        } catch(e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})

        }
    }
    async getUsers(req,res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch(e) {
            console.log(e)
            res.status(400).json({message: 'error'})
        }
    }
    async getUser(req,res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const verifiedToken = jwt.verify(token, secret)
            const user = await User.findById(verifiedToken.id)
            console.log(user)
            user.password = null
            res.json(user)
        } catch(e) {
            console.log(e)
            res.status(400).json({message: 'error'})
        }
    }
    async updateUser(req,res) {

        try {
            const token = req.headers.authorization.split(' ')[1]
            const verifiedToken = jwt.verify(token, secret)

            const user = await User.findById(verifiedToken.id)
            Object.assign(user, req.body)

            user.save()

            res.send({data: user})
            } catch(e) {
                console.log(e)
                res.status(400).json({message: 'error'})
            }
    }
    async updateUserPassword(req,res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const verifiedToken = jwt.verify(token, secret)

            const user = await User.findById(verifiedToken.id)
            // user.password = undefined
            //let password = user.password
            //console.log(password)
            const hashPassword = bcrypt.hashSync(req.body.password, 3)
            user.password = hashPassword
            user.save()
            res.send({data: user})
        } catch(e) {
            console.log(e)
            res.status(400).json({message: 'error'})
        }
    }
}

export default new authController()