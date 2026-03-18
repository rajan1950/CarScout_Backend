const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const validateToken = (req, res, next) => {

    try{

        const token = req.headers.authorization
        if (token){

            if(token.startsWith("Bearer ")){

                const tokenValue = token.split(" ")[1];

                const decoded = jwt.verify(tokenValue, secret)
                req.user = decoded;
                next()

            }else{
                return res.status(401).json({
                    message: "token is not valid"
                });
            }

        }else{
            return res.status(401).json({
                message: "token is not provided"
            });
        }

    }catch(err){
        return res.status(401).json({
            message: "Unauthorized",
            err:err
        });
    }
}

 module.exports = validateToken;