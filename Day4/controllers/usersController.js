const userService = require("../services/usersService");

const signUp = async (req, res, next) => {
    // // validate req.body
    const { name, email, password, age } = req.body;
    if (!name || !email || !password || !age) {
        return res.status(400).json({
            message: "Please fill all the required fields"
        })
    }

    const user = await userService.signUp({
        name,
        email,
        password,
        age
    })

    // return response
    res.status(201).json({
        message: "User Created Successfully",
        data: user
    })
}

const getUserById = async (req, res, next) => {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
        return res.status(404).json({
            message: "User Not Found"
        })
    }


    res.status(200).json({
        message: "User Fetched Successfully",
        data: user
    })
}

const getAllUsers = async (req, res, next) => {
    const data = await userService.getAllUsers(req.query);
    res.status(200).json({
        message: "Users Fetched Successfully",
        data
    })
}

const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    const user = await userService.deleteUser(id);

    if (!user) {
        return res.status(404).json({
            message: "User Not Found"
        })
    }


    // status code 204 => no content 
    res.status(200).json({
        message: "User Deleted Successfully",
    })
}

const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);

    if (!user) {
        return res.status(404).json({
            message: "User Not Found"
        })
    }

    res.status(200).json({
        message: "User Updated Successfully",
        data: user
    })
}

const signIn = async (req, res) => {
    const { email, password } = req.body;

    // check user exists or not
    // compare password
    const user = await userService.validateCredentails({ email, password });
    if (!user) {
        return res.status(401).json({
            message: "Invalid Email & Password Combination"
        })
    }
    // generate token
    const token = await userService.generateJWT(user);

    res.status(200).json({
        message: "User Signed In Successfully",
        data: { token }
    })

}

module.exports = {
    signUp,
    getUserById,
    getAllUsers,
    deleteUser,
    updateUser,
    signIn
}