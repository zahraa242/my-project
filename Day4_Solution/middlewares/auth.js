const util = require("util");
const jwt = require("jsonwebtoken");

const jwtVerifyAsync = util.promisify(jwt.verify);

const auth = async (req, res, next) => {
    try {
        const tokenHeader = req.headers.authorization;
        const token = tokenHeader.split(" ")[1];

        const decryptedPayload = await jwtVerifyAsync(token, process.env.JWT_SECRET);

        req.user = decryptedPayload;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized"
        })
    }
}

module.exports = auth;
