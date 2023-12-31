const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Vote = require("../models/voteModel");

const doVote = asyncHandler(async (req, res) => {

    const { vote } = req.body;

    if (!vote) {
        return res.status(406).json({ message: "Please Select one candidate !!!" });
    }
    const user = req.user;

    try {

        //Checkk if user already voted
        if (user.isVoted) {
            return res.status(406).json({ message: "Already voted!!!" });
        }
        if (vote < 1 || vote > 4) {
            return res.status(404).json({ message: "Not Allowed to vote other than these condidates!" });
        }

        const candidateName = `candidate${vote}`;

        await Vote.findOneAndUpdate({}, { $inc: { [candidateName]: 1 } });
        //update user that he/she already voted
        user.isVoted = true;
        await user.save();
        res.status(200).json({ success: true, message: "Voted successfully!" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

const getVotes = asyncHandler(async (req, res) => {
    // const user = req.user;
    try {
        // Retrieve the vote list if the user is an admin
        const voteList = await Vote.find();
        if (!voteList) {
            return res.status(200).json({ message: "No votes found!", voteList: voteList });
        }
        console.log("VoteList : ", voteList);
        return res.status(200).json(voteList);
    } catch (error) {
        return res.status(500).json({ message: "Unexpected Error Occure!!" }); // Unexpected server error
    }

})

module.exports = {
    doVote: doVote,
    getVotes: getVotes
}