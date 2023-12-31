const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protectUser = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(token);
        if (!token) {
            return res.status(400).json({ message: "Token Expired Please Login Again !!!" });
        }

        //Veryfy token
        const verifiedToken = jwt.verify(token, process.env.SECRETE_CODE);

        //get Data from req Object
        const user = await User.findById(verifiedToken.id).select('-password');  //excluiding password field 

        console.log(user);
        if (!user) {
            return res.status(403).json({ message: "User not found!" });
        }
        req.user = user;
        next();

    } catch (e) {
        return res.status(400).json({ message: "Invalid Token Error" })
    }

})

const protectAdmin = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(token);
        if (!token) {
            res.status(400).json({ message: "Token Expired Please Login Again !!!" });
            throw new Error("Token Expired Please Login Again !!!");
        }

        //Veryfy token
        const verifiedToken = jwt.verify(token, process.env.SECRETE_CODE);

        //get Data from req Object
        const user = await User.findById(verifiedToken.id).select('-password');

        console.log("ADMIN :", user);
        if (!user) {
            res.status(403).json({ message: "User not found!" });
            throw new Error("User not found!");
        }
        if (user.role !== 'Admin') {
            res.status(401).json({ message: "Unauthorized Access!" });
            throw new Error("Unauthorized Access!");
        }
        req.user = user;
        next();

    } catch (e) {
        res.status(400).json({ message: "Invalid Token Error" })
        throw new Error("Invalid Token Error!!");
    }

})


module.exports = {
    protect: protectUser,
    protectAdmin: protectAdmin
}