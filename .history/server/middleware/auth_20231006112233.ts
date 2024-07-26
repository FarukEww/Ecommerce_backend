import jwt from "jsonwebtoken"
import {Request,Response,NextFunction} from "express"

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.headers,"headers");
    const token = req.headers["authorization"]?.split(" ")[1]
    
    // console.log("token", token);

    if (!token) {
        return res.status(400).send({
            success: false,
            msg: "token is required for authorization..."
        });

        
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        // console.log(decode ,"decode");
    } catch (error) {
        return res.status(400).send("Invalid token")
    }
    return next()
    
}

export default verifyToken  