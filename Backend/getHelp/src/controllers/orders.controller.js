
const jwt = require("jsonwebtoken")
const userModel = require("../model/users.model") 
async function orders(req, res){
    try{
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  

        const userId = decoded._id

        const user = await userModel.findById(userId).select("orders");
        console.log(user)
        console.log(user.orders.length)
        return res.json(user.orders)

    }
    catch(err){
        res.status(401).json({"message": `something went wrong ${err}`})
    }
    res.json("")
}


module.exports = orders