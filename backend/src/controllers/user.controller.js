import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import verifyUser from "../middleware/user.middleware.js";

const generateToken = (userId) => {
    return jwt.sign(
        { _id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '15d' }
    );
};

const registerUser = async function (req, res) {
    try {
        const { username, email, fullname, password } = req.body

        if (!username || !email || !fullname || !password) {
            return res.status(400).json({
                success: false,
                message: 'All feilds are required. '
            });
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email and User name is already registered.'
            })
        }

        const user = await User.create(
            {
                username,
                email,
                fullname,
                password
            }
        )

        const token = generateToken(user._id)
        const registeredUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname
        };
        return res.status(200).json({
            success: true,
            message: 'User registered successfully.',
            user: registeredUser,
            token
        })

    } catch (error) {
        console.log('Error in User register: ', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error "
        })
    }
}

const userLogin = async function (req, res) {
    try {
        const { username, email, password } = req.body;

        if ((!username && !email) || !password) {
            return res.status(400).json({
                success: false,
                message: "All feilds are required."
            });
        }

        // const user = await User.findOne( { 
        //     $or: [ {username}, {email} ]     
        // }) ; 
        const user = await User.findOne({
            $or: [
                { username: identifier },
                { email: identifier }
            ]
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User is not registered.'
            });
        }

        const isPasswordCorrect = await user.isPasswordValid(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials.'
            });
        }

        const loggedInUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname
        };

        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: 'User loggedIn successfully.',
            loggedInUser,
            token
        })

    } catch (error) {
        console.log('Error in login user: ', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error.'
        })
    }
}

const getCurrentUserProfile = async function (req , res ) {
    try {
        const user = req.user;
        
        return res.status(200).json({
            success: true , 
            message: 'User found successfully.' ,
            user
        })
    } catch (error) {
        console.log('Error in get current User Info. : ', error) ; 

        return res.status(500).json({
            success: false , 
            message: 'Internal server error' 
        })
        
    }
}

const userLogOut = async function (req , res ) {
    try {
        return res.status(200).json({
            success: true , 
            message: 'User logged out successfully.'
        })
    } catch (error) {
        console.log('error in user logout:', error) ; 
        return res.status(500).json({
            success: false , 
            message: error.message || 'Internal Server Error' ,
        })
    }
}

const deleteUser = async function (req , res ) {
    try {
        const userId = req.user._id 
        const user = await User.findByIdAndDelete(userId);

        if(!user) {
            return res.status(404).json({
                success: false , 
                message: 'User not found.'
            })
        }

        // await User.findByIdAndDelete(userId) ; 

        return res.status(200).json({
            success: true , 
            message: 'User deleted successfully.' 
        }) ; 
    } catch (error) {
        console.log('Error in User deletion: ', error) ;
        return res.status(500).json({
            success: false , 
            message: error.message || ' Internal Server error'
        })
    }
}

export {
    registerUser,
    userLogin , 
    getCurrentUserProfile , 
    userLogOut , 
    deleteUser
}