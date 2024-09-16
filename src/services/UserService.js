// const { status } = require('express/lib/response')
const User = require('../models/UserModel')
const bcrypt = require("bcrypt")
const { genneralAccessToken } = require('./JwtService')

const createUser = (newUser) =>{
    return new Promise(async (resolve, reject) => {
        const {name, email, password, confirmPassword, phone} = newUser

        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser != null){
                resolve({
                    status: 'Oke',
                    message: 'Email is already'
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            console.log('hash', hash)
            const createdUser = await User.create({
                name, 
                email, 
                password: hash,  
                phone
            })
            if(createdUser){

                resolve({
                    status: 'Oke',
                    massage: 'Success',
                    data: createdUser
                })
            }
        }catch(e){
            reject(e)
        }
    })
}


const loginUser = (userLogin) =>{
    return new Promise(async (resolve, reject) => {
        const {name, email, password, confirmPassword, phone} = userLogin

        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null){
                resolve({
                    status: 'Oke',
                    message: 'User is not defined'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
                console.log('comparePassword', comparePassword)
            
            if(!comparePassword){
                resolve({
                    status: 'Oke',
                    message: 'User or password incorrect'
                })
            }
            const access_token = genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin 
            })
            console.log('access_token', access_token)
                resolve({
                    status: 'Oke',
                    massage: 'Success',
                    data: checkUser
                })
        
        }catch(e){
            reject(e)
        }
    })
}

module.exports = {
    createUser,
    loginUser
}