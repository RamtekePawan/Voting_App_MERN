const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.SECRETE_CODE, { expiresIn: "1day" })
}
//Register User 
const register = asyncHandler(async (req, res) => {

    //destructuring values from request
    try {
        const { name, email, password, phone } = req.body || {};

        console.log("User From Request: ", req.body || {});

        // basic Validations  
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please Enter all the fields." });
            // throw new Error("Please Enter all the fields.");
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Minimum 6 characters needed for password." });
            // throw new Error("Please Enter at least 6 characters");
        }

        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exists" });
            // throw new Error("User Already Exists");
        }

        // adding user to DB
        const user = await User.create({ email: email, name: name, password: password, phone: phone });

        //Generating Token 
        const token = generateToken(user);

        //Send HTTP-Only Cookie
        res.cookie("token", token, {
            path: "/",                               //root path
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), //1 Day
            sameSite: "none",
            secure: true,
        });



        //passing response to client
        if (user) {
            const { _id, name, email, phone } = user;
            res.status(201).json({
                _id,
                name,
                email,
                phone,
                token,
            });
            console.log("User With Token : ", req.body || {});
        } else {
            return res.status(400).json({ message: "Invalid User !!!" });
            // throw new Error("Invalid User !!!");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})


const getUserVoted = asyncHandler(async (req, res) => {
    const { email } = req.body;
    console.log(email);
    const user = await User.findOne({ email: email });
    const isVoted = user.isVoted;
    return res.status(200).json({ isVoted: isVoted })
});
//Login User
const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    console.log(email, password);


    try {
        const user = await User.findOne({ email: email });
        if (!email || !password) {
            res.status(401).json({ message: "Please Enter proper values  !!" });
            // throw new Error("Please Enter proper values!").status(401);
        }
        if (!user) {
            return res.status(401).json({ message: "User Not found, please sign up" });
            // throw new Error("User Not Found !!!").status(401);
        }
        if (user.password !== password) {
            return res.status(401).json({ message: "Password is Incorrect !!!" });
            // throw new Error("Password is Incorrect !!!").status(401);
        }

        //Generate token
        const token = generateToken(user._id);

        res.cookie("token", token, {
            path: "/",                               //root path
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), //1 Day
            sameSite: "none",
            secure: true,
        });
        if (user && password === user.password) {
            const { _id, name, email, phone, role, isVoted } = user;
            if (role != "Admin") {
                res.status(200).json({
                    _id,
                    name,
                    email,
                    phone,
                    role,
                    isVoted,
                    token,
                });
            } else {
                if (role == "Admin") {
                    res.status(200).json({
                        _id,
                        name,
                        email,
                        phone,
                        role,
                        isVoted,
                        token,
                        message: "Welcome Admin !!!"
                    });
                } else {
                    //res.status(400).json({ error: "Invalid Request!!!" });
                    throw new Error("Invalid Request!!!").status(400);
                }
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }

})

const logout = asyncHandler(async (req, res) => {
    res.cookie('token', '', {
        path: "/",                               //root path
        httpOnly: true,
        expires: new Date(0), //1 Day
        sameSite: "none",
        secure: true,
    })
    return res.status(200).json({ message: "Successfully Logged Out !!!" });

})

module.exports = {
    register: register,
    login: login,
    logout: logout,
    getUserVoted: getUserVoted
};
