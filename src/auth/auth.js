const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
    console.log("Authenticating with JWT...");
    const token = req.cookies.jwtToken;
    if (!token) {
        console.log("No token found.");
        return res.status(401).send('Forbidden access');
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        console.log("Token decoded : ", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).send('Authentication failed');
    }

};



module.exports = authenticateJWT;