const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTPService = require("./OtpService");

const TempUser = require("../models/tempUserModel");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, phone } = newUser;

    try {
      const checkUser = await User.findOne({ email });
      if (checkUser) {
        return resolve({
          status: "ERR",
          message: "The email is already in use"
        });
      }

      const hash = bcrypt.hashSync(password, 10);

      const otpToken = await OTPService.sendMailWithOTP(email);

      const savedTempUser = await TempUser.create({
        name,
        email,
        password: hash,
        phone,
        isAdmin: false,
        otpToken
      });

      resolve({
        status: "OK",
        message: "OTP has been sent to your email. Please verify.",
        tempUser: savedTempUser
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: "Error occurred during user registration: " + e.message
      });
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;

    try {
      const checkUser = await User.findOne({
        email: email
      });
      console.log(checkUser)
      const isAdmin = checkUser.isAdmin;
      const id = checkUser._id;
      if (!checkUser) {
        resolve({
          status: "ERR",
          message: "User is not defined"
        });
        return;
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "User or password incorrect"
        });
        return;
      }
      const access_token = await genneralAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin
      });

      const refresh_token = await genneralRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin
      });
      const name = checkUser.name;
      const phone = checkUser.phone;
      resolve({
        status: "Oke",
        massage: "Success",
        dataUser: { id, name, email, password, isAdmin, phone },
        access_token,
        refresh_token
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (!checkUser) {
        return resolve({
          status: "Error",
          message: "User not found"
        });
      }

      const updatedUser = await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
      });

      if (!updatedUser) {
        return resolve({
          status: "Error",
          message: "Update failed"
        });
      }

      return resolve({
        status: "Success",
        message: "User updated successfully",
        data: updatedUser
      });
    } catch (e) {
      reject({
        status: "Error",
        message: "An error occurred while updating the user",
        error: e
      });
    }
  });
};

const deleteUser = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });
      if (checkUser === null) {
        return reject({
          status: 404,
          message: "User is not defined"
        });
      }

      await User.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete success"
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyUser = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany({ _id: ids });
      resolve({
        status: "Oke",
        massage: "delete success"
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find();
      resolve({
        status: "Oke",
        massage: "success",
        data: allUser
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        _id: id
      });
      if (user === null) {
        resolve({
          status: "Oke",
          message: "User is not defined"
        });
      }

      resolve({
        status: "Oke",
        massage: "success",
        data: user
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  deleteManyUser,
  getAllUser,
  getDetailsUser
};
