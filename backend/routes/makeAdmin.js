const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post("/makeadmin/:userId", async (req, res) => {
    // console.log("Making user an admin");
    await User.findByIdAndUpdate(req.params.userId, {
        isAdmin: true // Set isAdmin to true
    }, {
        new: true,          // return updated doc
        runValidators: true // validate schema rules
      });
      console.log("User made admin successfully");
    res.end();
})

module.exports = router;