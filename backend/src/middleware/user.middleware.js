import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyUser = async function(req , res , next ) {
    try {
        const authHeader = req.headers.authorization ; 

        if( !authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({
                success: false , 
                message: 'Unauthorized User' 
            }) ; 
        }

        const token = authHeader.split(' ')[1] ; 
        const decode = jwt.verify(token , process.env.JWT_SECRET) ; 

        const user = await User.findById(decode._id).select("-password") ; 

        if(!user ) {
            return res.status(400).json({
                success: false , 
                message:'User not found. Invalid Token.'
            }) ; 
        } 

        req.user = user ; 
        next() ; 
    } catch (error) {
        console.log("Error in verification:", error);

        if ( error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

export default verifyUser;