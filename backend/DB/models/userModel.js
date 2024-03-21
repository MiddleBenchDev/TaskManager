const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const bCrypt = require("bcryptjs")
const _ = require("lodash")

const secretKey = '1518902854dgdhfdj0301866096@#$0277957868'

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    sessions: [{
        token: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Number,
            required: true
        }
    }]
})

// instance methods
UserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    return _.omit(userObject, ['password', 'sessions'])
}

UserSchema.methods.generateAccessAuthToken = function () {
    const user = this
    return new Promise((resolve, reject) => {
        jwt.sign({ _id: user._id.toHexString() }, secretKey, { expiresIn: '15m' }, (err, token) => {
            if (!err) {
                return resolve(token)
            } else {
                return reject()
            }
        })
    })
}

UserSchema.methods.generateRefreshAuthToken = function () {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (!err) {
                console.log("if")
                let token = buf.toString('hex')
                return resolve(token)
            } else {
                console.log("generate refresh token", err)
            }
        })
    })
}


UserSchema.methods.createSession = function () {
    console.log("user session")
    let user = this
    return user.generateRefreshAuthToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken)
    }).then((refreshToken) => {
        return refreshToken
    }).catch((e) => {
        return Promise.reject('Failed to save session to the database.\n' + e)
    })
}

// model methods

UserSchema.static.findByIdAndToken = function (_id, token) {
    const user = this

    return user.findOne({
        _id,
        'session_token': token
    })
}

UserSchema.statics.findByCredentials = function (email, password) {
    let user = this
    return user.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject()
        }
        return new Promise((resolve, reject) => {
            bCrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user)
                } else {
                    reject()
                }
            })
        })
    })
}

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
    let secondsSinceEpoch = Date.now() / 1000
    if (expiresAt > secondsSinceEpoch) {
        return false
    } else {
        return true
    }
}


// middleware
UserSchema.pre('save', function (next) {
    let user = this
    let cosFactor = 10
    if (user.isModified('password')) {
        bCrypt.genSalt(cosFactor, (err, salt) => {
            bCrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

// helper methods
let saveSessionToDatabase = (user, refreshToken) => {
    return new Promise((resolve, reject) => {
        let expiresAt = generateRefreshTokenExpiryTime()
        user.sessions.push({ token: refreshToken, expiresAt })
        user.save().then(() => {
            return resolve(refreshToken)
        }).catch((e) => {
            reject(e)
        })
    })
}

let generateRefreshTokenExpiryTime = () => {
    let daysUntilExpire = '10'
    let secondsUntileExpire = ((daysUntilExpire * 24) * 60) * 60
    return ((Date.now() / 1000) + secondsUntileExpire)
}

const User = mongoose.model('User', UserSchema)

module.exports = { User }