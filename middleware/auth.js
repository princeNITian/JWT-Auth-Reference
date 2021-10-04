// We can successfully create and log in a user. Still, we’ll create a route that requires a user token in the header, which is the JWT token we generated earlier.
const jwt = require('jsonwebtoken');
const config = process.env;

const verifyToken = (req,res,next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(!token){
        res.status(403).send('A token is required for authentication!');
    }

    try{
        const decoded = jwt.verify(token,config.TOKEN_KEY);
        req.user = decoded;
    }
    catch(err){
        return res.status(401).send("Invalid Token");
    }
    return next();
}

module.exports = verifyToken;