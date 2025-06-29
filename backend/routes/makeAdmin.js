const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post("/makeadmin/:id", async (req, res) => {
    // console.log("Making user an admin");
    await User.findByIdAndUpdate(req.params.id, {
        isAdmin: true // Set isAdmin to true
    }, {
        new: true,          // return updated doc
        runValidators: true // validate schema rules
      });
      console.log("User made admin successfully");
    res.end();
})

module.exports = router;