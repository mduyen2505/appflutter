// const { status } = require('express/lib/response')
const User = require('../models/UserModel')
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require('./JwtService')

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
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin 
            })

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin 
            })

            console.log('access_token', access_token)
                resolve({
                    status: 'Oke',
                    massage: 'Success',
                    access_token,
                    refresh_token
                })
        
        }catch(e){
            reject(e)
        }
    })
}

const updateUser = (id, data) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id : id
            })
                if (checkUser === null){
                    resolve({
                        status: 'Oke',
                        message: 'User is not defined'
                    })
                }
                
                const updatedUser = await User.findByIdAndUpdate(id, data, { new : true})

                resolve({
                    status: 'Oke',
                    massage: 'Success',
                    data: updatedUser
                   
                })
        
        }catch(e){
            reject(e)
        }
    })
}
    


module.exports = {
    createUser,
    loginUser,
    updateUser
}