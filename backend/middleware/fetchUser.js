const jwt = require("jsonwebtoken");

const fetchUser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        next();        
    } catch (error) {
        console.error(error.message);
        res.status(401).send({ error: "Please authenticate using a valid token" });        
    }
}

module.exports = fetchUser;