const express = require("express")
const UserRouter = express.Router()
const { User } = require('../models')

UserRouter.post('/users', (req, res) => {
    let body = req?.body
    let newUser = new User(body)
    newUser.save().then(() => {
        return newUser.createSession()
    }).then((refreshToken) => {
        return newUser.generateAccessAuthToken().then((accessToken) => {
            return { accessToken, refreshToken }
        })
    }).then((authToken) => {
        res
            .header('x-refresh-token', authToken.refreshToken)
            .header('x-access-token', authToken.accessToken)
            .send(newUser)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

UserRouter.post('/users/login', (req, res) => {
    let { email, password } = req?.body

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            return user.generateAccessAuthToken().then((accessToken) => {
                return { accessToken, refreshToken }
            })
        }).then((authToken) => {
            res
                .header('x-refresh-token', authToken.refreshToken)
                .header('x-access-token', authToken.accessToken)
                .send(user)
        })
    }).catch((err) => {
        res.status(400).send(err)
    })
})

module.exports = UserRouter