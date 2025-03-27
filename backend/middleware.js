const jwt = require("jsonwebtoken");
const JWTSIGN="ILUVEXPRESS";

const authmiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send("Not authorized");
    }

    const token= authHeader.split(" ")[1];

    req.userId = jwt.decode(token,JWTSIGN);
    next();
}

module.exports=authmiddleware;
