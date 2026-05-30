const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");

const jwtSignAsync = util.promisify(jwt.sign);

const signUp = async ({ name, email, password, age }) => {
    try {
        // generate hashed password from incoming the plain text password
        const hashedPassword = await bcrypt.hash(password, 12);
        // save user in db with hashed password
        const createdUser = await User.create({
            name,
            email,
            password: hashedPassword,
            age
        });
        return createdUser;
    } catch (error) {
        throw error;
    }
}

const getUserById = async (id) => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        throw error;
    }
}

const getAllUsers = async (query) => {
    try {
        const { page = 1, limit = 10 } = query;
        /**
         * 1 page => first 10  | skip 0 limit 10 | (1-1)*10 = 0
         * 2 page => next 10 skip 10 limit 10 | (2-1)*10 = 10
         * 3 page => next 10 skip 20 limit 10 | (3-1)*10 = 20
         */
        const skip = (page - 1) * limit;

        const users = await User.find().skip(skip).limit(limit);
        const totalCount = await User.countDocuments();

        const pagination = {
            page: Number(page),
            limit: Number(limit),
            totalCount,
            totalPages: Math.ceil(totalCount / limit)
        }
        return { users, pagination };
    } catch (error) {
        throw error;
    }
}

const deleteUser = async (id) => {
    try {
        // if user exist, return user then delete it, if it doesn't exist will return null
        const user = await User.findOneAndDelete({ _id: id });
        return user;
    } catch (error) {
        throw error;
    }
}

const updateUser = async (id, data) => {
    try {
        const update = {
            name: data.name,
            password: data.password,
            age: data.age
        }
        const user = await User.findByIdAndUpdate(id, update, { new: true });
        return user;
    } catch (error) {
        throw error;
    }
}

const validateCredentails = async ({ email, password }) => {
    try {
        // fetch user by email
        const user = await User.findOne({ email });
        if (!user) {
            return null;
        }
        // compare hashed password with the incoming password using bcrypt.compare
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    } catch (error) {
        throw error;
    }
}

const generateJWT = async (user) => {
    try {
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        const options = {
            expiresIn: "1h"
        };

        const secret = process.env.JWT_SECRET;
        const token = await jwtSignAsync(payload, secret, options);
        return token;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    signUp,
    getUserById,
    getAllUsers,
    deleteUser,
    updateUser,
    validateCredentails,
    generateJWT
}
