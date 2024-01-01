const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv").config();
// const errorHandler = require("./middelWares/errorMiddeelware");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { register, login, logout, getUserVoted } = require('./controllers/userController');
const connectDB = require("./middleWares/connectDB");
const { protect, protectAdmin } = require('./middleWares/authMiddleWare')
const { doVote, getVotes } = require('./controllers/voteController')

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "https://voting-mern-pawan.netlify.app/"],
    credentials: true,
})
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Route Middelwares
//app.use("/api/users", userRoute)
app.post("/api/users/register", register);
app.post("/api/users/login", login);
app.get("/api/users/logout", logout);
app.post("/api/users/vote", protect, doVote);
app.get("/api/users/vote", protectAdmin, getVotes);
app.post("/api/users/getVote", protect, getUserVoted);
const PORT = process.env.PORT || 5000;


const startServer = async () => {
    try {
        await connectDB(); // Corrected this line
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server : ', error);
    }
};

startServer();