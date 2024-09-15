// const { status } = require('express/lib/response')
const User = require('../models/UserModel')

const createUser = (newUser) =>{
    return new Promise(async (resolve, reject) => {
        const {name, email, password, confirmPassword, phone, access_token, refresh_token} = newUser

        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser != null){
                resolse({
                    status: 'Oke',
                    message: 'Email is already'
                })
            }
            const createdUser = await User.create({
                name, 
                email, 
                password, 
                confirmPassword, 
                phone,
                access_token,
                refresh_token
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
module.exports = {
    createUser
}