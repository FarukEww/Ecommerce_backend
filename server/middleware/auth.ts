import jwt from "jsonwebtoken"
import {Request,Response,NextFunction} from "express"

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.headers,"headers");
    try{

        const token = req.headers["authorization"]?.split(" ")[1]
    
    // console.log("token", token);

    if (!token) {
        return res.status(400).send({
            success: false,
            msg: "token is required for authorization..."
        });

        
        
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_USER);
    req.body.user = decode;
    next()
    // console.log(decode ,
    }catch(err:any){
        return res.status(400).send("Invalid token")
    }
    
  
  
    
}

export default verifyToken  