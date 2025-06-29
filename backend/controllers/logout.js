function logOutUser(req,res){
    console.log("Logging out user...");
    res.clearCookie("token"); // Replace 'token' with your cookie name
    res.status(200).json({ message: "Logged out successfully" });
}

module.exports = logOutUser;